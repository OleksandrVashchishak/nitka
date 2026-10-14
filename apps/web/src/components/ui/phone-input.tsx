"use client";

import {
  forwardRef,
  useId,
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  applyUaPhoneInput,
  formatUaPhoneMask,
} from "@/lib/phone-mask";
import {
  textInputControlClassName,
  type TextInputShape,
  type TextInputSize,
} from "@/components/ui/text-input";

export type PhoneInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "size" | "type" | "value" | "onChange" | "inputMode"
> & {
  label?: ReactNode;
  /** Controlled value — raw / E.164 / masked. */
  value?: string;
  /**
   * `e.target.value` — compact `+380…`.
   * Field shows `+38 (0XX) XXX-XX-XX`.
   */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  size?: TextInputSize;
  shape?: TextInputShape;
  hint?: ReactNode;
  className?: string;
  inputClassName?: string;
};

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInput(
    {
      label,
      value = "",
      onChange,
      size = "l",
      shape = "rect",
      hint,
      className,
      inputClassName,
      id,
      placeholder = "+38 (0__) ___-__-__",
      autoComplete = "tel",
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const innerRef = useRef<HTMLInputElement | null>(null);
    const caretRef = useRef<number | null>(null);
    const display = formatUaPhoneMask(value);

    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    useLayoutEffect(() => {
      const node = innerRef.current;
      const pos = caretRef.current;
      if (!node || pos == null) return;
      try {
        node.setSelectionRange(pos, pos);
      } catch {
        /* ignore */
      }
      caretRef.current = null;
    }, [display]);

    const controlClass = textInputControlClassName({
      size,
      shape,
      className: inputClassName,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const el = e.currentTarget;
      const next = applyUaPhoneInput({
        prevValue: value,
        inputValue: el.value,
        caret: el.selectionStart ?? el.value.length,
      });
      caretRef.current = next.caret;

      onChange?.({
        ...e,
        target: { value: next.value } as HTMLInputElement,
        currentTarget: { value: next.value } as HTMLInputElement,
      });
    };

    return (
      <label
        className={["fata-text-input", className].filter(Boolean).join(" ")}
        htmlFor={inputId}
      >
        {label != null ? (
          <span className="fata-text-input__label">{label}</span>
        ) : null}
        <input
          {...props}
          ref={setRefs}
          id={inputId}
          type="tel"
          inputMode="tel"
          autoComplete={autoComplete}
          className={controlClass}
          value={display}
          placeholder={placeholder}
          onChange={handleChange}
        />
        {hint != null ? (
          <span className="fata-text-input__hint">{hint}</span>
        ) : null}
      </label>
    );
  },
);
