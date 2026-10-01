"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

export type IconButtonVariant = "ghost" | "close" | "quick-add";
export type IconButtonSize = "xs" | "s" | "m" | "l" | "xl";

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "color"
> & {
  /** Required for a11y — icon-only control */
  "aria-label": string;
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
};

const DEFAULT_SIZE: Record<IconButtonVariant, IconButtonSize> = {
  ghost: "xs",
  close: "l",
  "quick-add": "xl",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      variant = "ghost",
      size,
      className,
      type = "button",
      ...props
    },
    ref,
  ) {
    const resolvedSize = size ?? DEFAULT_SIZE[variant];
    const classes = [
      "fata-icon-button",
      `fata-icon-button--${variant}`,
      `fata-icon-button--${resolvedSize}`,
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} type={type} className={classes} {...props}>
        {icon}
      </button>
    );
  },
);
