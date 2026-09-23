"use client";

import type { ButtonHTMLAttributes } from "react";

export type CheckboxProps = {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onChange" | "children" | "aria-checked" | "role"
>;

function checkboxClassName(checked: boolean, className?: string) {
  return ["fata-checkbox", checked ? "is-checked" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
}

function CheckMark() {
  return (
    <svg
      className="fata-checkbox__mark"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        className="fata-checkbox__path"
        d="M2.4 6.2 4.9 8.7 9.6 3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Task-style checkbox — rounded square, lime when checked. No label. */
export function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  className,
  "aria-label": ariaLabel,
  ...rest
}: CheckboxProps) {
  const classes = checkboxClassName(checked, className);

  if (!onCheckedChange) {
    return (
      <span className={classes} aria-hidden>
        <CheckMark />
      </span>
    );
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      className={classes}
      {...rest}
      onClick={(event) => {
        rest.onClick?.(event);
        if (!event.defaultPrevented) onCheckedChange(!checked);
      }}
    >
      <CheckMark />
    </button>
  );
}
