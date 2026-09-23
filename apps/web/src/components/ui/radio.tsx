"use client";

import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type RadioProps = {
  checked: boolean;
  className?: string;
};

export type RadioGroupProps = {
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, "role" | "children">;

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

function radioGroupClassName(className?: string) {
  return ["fata-radio-group", className ?? ""].filter(Boolean).join(" ");
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

/** Vertical stack of radio options — 16px gap. */
export function RadioGroup({
  className,
  children,
  ...rest
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={radioGroupClassName(className)}
      {...rest}
    >
      {children}
    </div>
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
