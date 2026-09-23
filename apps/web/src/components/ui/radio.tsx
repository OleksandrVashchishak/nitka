"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type RadioProps = {
  checked: boolean;
  className?: string;
};

export type RadioOptionProps = {
  selected: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onChange" | "children" | "aria-checked" | "role" | "disabled"
>;

function radioClassName(checked: boolean, className?: string) {
  return ["fata-radio", checked ? "is-checked" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
}

function radioOptionClassName(selected: boolean, className?: string) {
  return [
    "fata-radio-option",
    selected ? "is-selected" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Selected mark matches Frame (3).svg — wine disc + lime dot. */
export function Radio({ checked, className }: RadioProps) {
  return (
    <span className={radioClassName(checked, className)} aria-hidden>
      <span className="fata-radio__dot" />
    </span>
  );
}

/** Pill radio row: mark + label. */
export function RadioOption({
  selected,
  onSelect,
  disabled,
  className,
  children,
  "aria-label": ariaLabel,
  ...rest
}: RadioOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel}
      disabled={disabled}
      className={radioOptionClassName(selected, className)}
      {...rest}
      onClick={(event) => {
        rest.onClick?.(event);
        if (!event.defaultPrevented) onSelect?.();
      }}
    >
      <Radio checked={selected} />
      <span className="fata-radio-option__label">{children}</span>
    </button>
  );
}
