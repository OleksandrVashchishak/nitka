"use client";

import Link from "next/link";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
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
    ...buttonRest
  } = props;

  return (
    <button
      type={type}
      className={classes}
      ref={ref as Ref<HTMLButtonElement>}
      disabled={disabled || loading}
      {...buttonRest}
    >
      {content}
    </button>
  );
});
