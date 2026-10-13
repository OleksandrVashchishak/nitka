"use client";

import Link from "next/link";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from "react";
import { LoadingButtonLabel } from "@/components/ui-loader";

export type ButtonSize = "s" | "m" | "l" | "xl";
export type ButtonTone =
  | "light"
  | "dark"
  | "brand"
  | "outline"
  | "ghost"
  | "black"
  | "ink"
  | "accent";

type SharedProps = {
  size?: ButtonSize;
  tone?: ButtonTone;
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "color" | "children" | "href" | "type"
  > & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function buttonClassName({
  size = "l",
  tone = "dark",
  fullWidth,
  className,
}: Pick<SharedProps, "size" | "tone" | "fullWidth" | "className">) {
  return [
    "fata-button",
    `fata-button--${size}`,
    `fata-button--${tone}`,
    fullWidth ? "fata-button--full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Ant Design–style outward wave on click. */
function playButtonWave(target: HTMLElement) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const wave = document.createElement("span");
  wave.className = "fata-button-wave";
  wave.setAttribute("aria-hidden", "true");
  target.appendChild(wave);

  const cleanup = () => {
    wave.removeEventListener("animationend", cleanup);
    wave.remove();
  };
  wave.addEventListener("animationend", cleanup);
}

function withWavePointerDown<T extends HTMLElement>(
  disabled: boolean | undefined,
  onPointerDown?: (event: PointerEvent<T>) => void,
) {
  return (event: PointerEvent<T>) => {
    if (!disabled && event.button === 0) {
      playButtonWave(event.currentTarget);
    }
    onPointerDown?.(event);
  };
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const classes = buttonClassName(props);
  const content = (
    <LoadingButtonLabel
      loading={Boolean(props.loading)}
      loadingText={props.loadingText}
    >
      {props.children}
    </LoadingButtonLabel>
  );

  if (props.href != null) {
    const {
      size: _size,
      tone: _tone,
      fullWidth: _fullWidth,
      loading,
      loadingText: _loadingText,
      className: _className,
      children: _children,
      href,
      onPointerDown,
      ...linkRest
    } = props;

    return (
      <Link
        href={href}
        className={classes}
        ref={ref as Ref<HTMLAnchorElement>}
        aria-disabled={loading || undefined}
        tabIndex={loading ? -1 : undefined}
        {...linkRest}
        onPointerDown={withWavePointerDown(loading, onPointerDown)}
      >
        {content}
      </Link>
    );
  }

  const {
    size: _size,
    tone: _tone,
    fullWidth: _fullWidth,
    loading,
    loadingText: _loadingText,
    className: _className,
    children: _children,
    type = "button",
    disabled,
    onPointerDown,
    ...buttonRest
  } = props;

  const isDisabled = Boolean(disabled || loading);

  return (
    <button
      type={type}
      className={classes}
      ref={ref as Ref<HTMLButtonElement>}
      disabled={isDisabled}
      {...buttonRest}
      onPointerDown={withWavePointerDown(isDisabled, onPointerDown)}
    >
      {content}
    </button>
  );
});
