"use client";

import {
  forwardRef,
  useId,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import type { TextInputShape, TextInputSize } from "@/components/ui/text-input";

export type SelectTone = "default" | "ghost";

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "className" | "size"
> & {
  label?: ReactNode;
  size?: TextInputSize;
  shape?: TextInputShape;
  /** Transparent control for embedding in chips / custom chrome. */
  tone?: SelectTone;
  startAdornment?: ReactNode;
  className?: string;
  selectClassName?: string;
  children: ReactNode;
};

function SelectChevron({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="8"
      viewBox="0 0 14 8"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M1 1L7 7L13 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      size = "l",
      shape = "rect",
      tone = "default",
      startAdornment,
      className,
      selectClassName,
      id,
      children,
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const selectId = id ?? autoId;
    const controlClass = [
      "fata-select__control",
      `fata-select__control--${size}`,
      shape === "pill" ? "fata-select__control--pill" : "",
      tone === "ghost" ? "fata-select__control--ghost" : "",
      startAdornment ? "fata-select__control--with-start" : "",
      selectClassName ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label
        className={[
          "fata-select",
          tone === "ghost" ? "fata-select--ghost" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        htmlFor={selectId}
      >
        {label != null ? (
          <span className="fata-select__label">{label}</span>
        ) : null}
        <span className="fata-select__control-wrap">
          {startAdornment ? (
            <span className="fata-select__start">{startAdornment}</span>
          ) : null}
          <select
            ref={ref}
            id={selectId}
            className={controlClass}
            {...props}
          >
            {children}
          </select>
          <span className="fata-select__chevron" aria-hidden>
            <SelectChevron />
          </span>
        </span>
      </label>
    );
  },
);
