"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { IconClose } from "@/components/icon-close";

import "@/styles/cabinet/search.scss";

/** Лупа 16×16 з макета (icon/search.svg). */
export function IconSearch({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M14.0001 14.0001L11.1068 11.1068M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

type ButtonProps = {
  onClick: () => void;
  label?: string;
  className?: string;
};

/** Кругла кнопка-лупа 36×36 (хедер на мобільному, згорнутий пошук на десктопі). */
export function CabinetSearchButton({
  onClick,
  label = "Пошук",
  className,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={["cabinet-search-button", className].filter(Boolean).join(" ")}
      aria-label={label}
      onClick={onClick}
    >
      <IconSearch />
    </button>
  );
}

type FieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Показувати ✕ в полі, коли є текст */
  clearable?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
};

function CabinetSearchField({
  value,
  onChange,
  placeholder,
  clearable = true,
  onKeyDown,
  className,
}: FieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={["cabinet-search-field", className].filter(Boolean).join(" ")}>
      <span className="cabinet-search-field__icon">
        <IconSearch />
      </span>
      <input
        ref={inputRef}
        type="search"
        className="cabinet-search-field__input"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        autoFocus
        autoComplete="off"
        enterKeyHint="search"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {clearable && value ? (
        <button
          type="button"
          className="cabinet-search-field__clear"
          aria-label="Очистити пошук"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
        >
          <IconClose size={16} />
        </button>
      ) : null}
    </div>
  );
}

export type CabinetSearchProps = {
  value: string;
  onChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** «Пошук гостей / завдань / витрат» */
  placeholder: string;
  className?: string;
};

/**
 * Десктоп: лупа 36×36 → поле 237px.
 * ✕ — очищує, фокус лишається; Esc — очищує і згортає;
 * клік поза полем — згортає лише порожнє поле.
 */
export function CabinetSearch({
  value,
  onChange,
  open,
  onOpenChange,
  placeholder,
  className,
}: CabinetSearchProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      if (!valueRef.current) onOpenChange(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, onOpenChange]);

  const rootClass = ["cabinet-search", open ? "is-open" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={rootClass}>
      {open ? (
        <CabinetSearchField
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onChange("");
              onOpenChange(false);
            }
          }}
        />
      ) : (
        <CabinetSearchButton
          label={placeholder}
          onClick={() => onOpenChange(true)}
        />
      )}
    </div>
  );
}

export type CabinetSearchScreenProps = {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  /** ✕ праворуч від поля / Esc — закриває пошук */
  onClose: () => void;
  placeholder: string;
  /** Результати; поки поле порожнє — не рендеряться */
  children?: ReactNode;
};

/** Мобільний: окремий екран пошуку поверх сторінки. */
export function CabinetSearchScreen({
  open,
  value,
  onChange,
  onClose,
  placeholder,
  children,
}: CabinetSearchScreenProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="cabinet-search-screen" role="dialog" aria-label={placeholder}>
      <div className="cabinet-search-screen__bar">
        <CabinetSearchField
          className="cabinet-search-field--screen"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          clearable={false}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
        />
        <button
          type="button"
          className="cabinet-search-screen__close"
          aria-label="Закрити пошук"
          onClick={onClose}
        >
          <IconClose size={18} />
        </button>
      </div>
      {value.trim() ? (
        <div className="cabinet-search-screen__body">{children}</div>
      ) : null}
    </div>
  );
}

type EmptyProps = {
  query: string;
  onClear: () => void;
  /** Активні фільтри — підказуємо, що їх теж можна скинути */
  filtersActive?: boolean;
  /**
   * `panel` — картка в списку (десктоп);
   * `screen` — текст по центру на мобільному екрані пошуку.
   */
  variant?: "panel" | "screen";
  /** Для `screen`: «гостей» / «завдань» / «витрат» */
  itemsLabel?: string;
};

/** Порожній стан «Нічого не знайдено» з текстом запиту. */
export function CabinetSearchEmpty({
  query,
  onClear,
  filtersActive = false,
  variant = "panel",
  itemsLabel = "результатів",
}: EmptyProps) {
  const q = query.trim();

  if (variant === "screen") {
    return (
      <div className="cabinet-search-empty cabinet-search-empty--screen">
        <p className="cabinet-search-empty__title">Нічого не знайдено</p>
        <p className="cabinet-search-empty__hint">
          За запитом «{q}» немає {itemsLabel}.
          <br />
          Перевірте написання.
        </p>
      </div>
    );
  }

  return (
    <div className="cabinet-search-empty">
      <p className="cabinet-search-empty__title">
        Нічого не знайдено за запитом «{q}»
      </p>
      <p className="cabinet-search-empty__hint">
        {filtersActive
          ? "Перевірте написання або скиньте фільтри ліворуч"
          : "Перевірте написання"}
      </p>
      <button type="button" className="cabinet-search-empty__link" onClick={onClear}>
        Очистити пошук
      </button>
    </div>
  );
}
