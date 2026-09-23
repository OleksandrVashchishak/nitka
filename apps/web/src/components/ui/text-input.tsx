"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

export type TextInputSize = "xs" | "s" | "m" | "l" | "xl";
export type TextInputShape = "rect" | "pill";

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "size"
> & {
  label?: ReactNode;
  size?: TextInputSize;
  shape?: TextInputShape;
  endAdornment?: ReactNode;
  hint?: ReactNode;
  className?: string;
  inputClassName?: string;
};

export function textInputControlClassName({
  size = "l",
  shape = "rect",
  withEnd = false,
  className,
}: {
  size?: TextInputSize;
  shape?: TextInputShape;
  withEnd?: boolean;
  className?: string;
} = {}) {
  return [
    "fata-text-input__control",
    `fata-text-input__control--${size}`,
    shape === "pill" ? "fata-text-input__control--pill" : "",
    withEnd ? "fata-text-input__control--with-end" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      label,
      size = "l",
      shape = "rect",
      endAdornment,
      hint,
      className,
      inputClassName,
      id,
      type = "text",
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const controlClass = textInputControlClassName({
      size,
      shape,
      withEnd: Boolean(endAdornment),
      className: inputClassName,
    });

    const control = (
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={controlClass}
        {...props}
      />
    );

    return (
      <label
        className={["fata-text-input", className].filter(Boolean).join(" ")}
        htmlFor={inputId}
      >
        {label != null ? (
          <span className="fata-text-input__label">{label}</span>
        ) : null}
        {endAdornment ? (
          <span className="fata-text-input__control-wrap">
            {control}
            <span className="fata-text-input__end">{endAdornment}</span>
          </span>
        ) : (
          control
        )}
        {hint != null ? (
          <span className="fata-text-input__hint">{hint}</span>
        ) : null}
      </label>
    );
  },
);
