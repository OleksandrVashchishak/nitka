"use client";

import {
  forwardRef,
  useId,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

export type TextareaSize = "s" | "m" | "l";

export type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className" | "children"
> & {
  label?: ReactNode;
  hint?: ReactNode;
  size?: TextareaSize;
  className?: string;
  inputClassName?: string;
  /** Skip fata control chrome — use with editor BEM via `inputClassName` */
  plain?: boolean;
};

export function textareaControlClassName({
  size = "m",
  plain = false,
  className,
}: {
  size?: TextareaSize;
  plain?: boolean;
  className?: string;
} = {}) {
  if (plain) return className ?? "";
  return [
    "fata-textarea__control",
    `fata-textarea__control--${size}`,
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      hint,
      size = "m",
      className,
      inputClassName,
      plain = false,
      id,
      rows = 3,
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const controlClass = textareaControlClassName({
      size,
      plain,
      className: inputClassName,
    });

    const control = (
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={controlClass}
        {...props}
      />
    );

    if (plain && label == null && hint == null) {
      return control;
    }

    return (
      <label
        className={["fata-textarea", className].filter(Boolean).join(" ")}
        htmlFor={inputId}
      >
        {label != null ? (
          <span className="fata-textarea__label">{label}</span>
        ) : null}
        {control}
        {hint != null ? (
          <span className="fata-textarea__hint">{hint}</span>
        ) : null}
      </label>
    );
  },
);
