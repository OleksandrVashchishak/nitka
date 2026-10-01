"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { IconCalendar } from "@/components/icon-calendar";

export type DateInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "size" | "type"
> & {
  label?: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
};

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  function DateInput(
    {
      label,
      hint,
      placeholder = "Оберіть дату",
      className,
      inputClassName,
      id,
      value,
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const hasValue = Boolean(value != null && String(value).length > 0);
    const wrapClass = [
      "fata-date-input__control",
      hasValue ? "has-value" : "",
      inputClassName ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    const control = (
      <div className={wrapClass}>
        <input
          ref={ref}
          id={inputId}
          type="date"
          value={value}
          {...props}
        />
        {!hasValue ? (
          <span className="fata-date-input__placeholder" aria-hidden>
            {placeholder}
          </span>
        ) : null}
        <IconCalendar size={18} className="fata-date-input__icon" />
      </div>
    );

    return (
      <div className={["fata-date-input", className].filter(Boolean).join(" ")}>
        {label != null ? (
          <label className="fata-date-input__label" htmlFor={inputId}>
            {label}
          </label>
        ) : null}
        {control}
        {hint != null ? (
          <span className="fata-date-input__hint">{hint}</span>
        ) : null}
      </div>
    );
  },
);
