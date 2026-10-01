"use client";

import type { ReactNode } from "react";

export type FieldProps = {
  label?: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
};

/** Label + control slot for composite cabinet fields (date chrome, custom groups). */
export function Field({
  label,
  hint,
  htmlFor,
  className,
  children,
}: FieldProps) {
  const rootClass = ["fata-field", className].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      {label != null ? (
        htmlFor ? (
          <label className="fata-field__label" htmlFor={htmlFor}>
            {label}
          </label>
        ) : (
          <span className="fata-field__label">{label}</span>
        )
      ) : null}
      {children}
      {hint != null ? <span className="fata-field__hint">{hint}</span> : null}
    </div>
  );
}
