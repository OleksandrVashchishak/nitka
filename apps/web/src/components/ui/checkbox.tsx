"use client";

import type { ButtonHTMLAttributes } from "react";

export type CheckboxProps = {
  checked: boolean;
  /** Partial selection — dash instead of check (e.g. parent group). */
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onChange" | "children" | "aria-checked" | "role"
>;

function checkboxClassName(
  checked: boolean,
  indeterminate: boolean,
  className?: string,
) {
  return [
    "fata-checkbox",
    indeterminate ? "is-indeterminate" : checked ? "is-checked" : "",
    className ?? "",
  ]
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

function DashMark() {
  return (
    <svg
      className="fata-checkbox__mark fata-checkbox__mark--dash"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path
        className="fata-checkbox__path fata-checkbox__path--dash"
        d="M2.5 6h7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Task-style checkbox — rounded square, lime when checked. No label. */
export function Checkbox({
  checked,
  indeterminate = false,
  onCheckedChange,
  disabled,
  className,
  "aria-label": ariaLabel,
  ...rest
}: CheckboxProps) {
  const classes = checkboxClassName(checked, indeterminate, className);
  const mark = indeterminate ? <DashMark /> : <CheckMark />;

  if (!onCheckedChange) {
    return (
      <span className={classes} aria-hidden>
        {mark}
      </span>
    );
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel}
      disabled={disabled}
      className={classes}
      {...rest}
      onClick={(event) => {
        rest.onClick?.(event);
        if (!event.defaultPrevented) onCheckedChange(!checked);
      }}
    >
      {mark}
    </button>
  );
}
