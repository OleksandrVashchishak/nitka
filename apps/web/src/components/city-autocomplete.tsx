"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { filterUaCities } from "@/lib/ua-cities";

type Props = {
  value: string;
  onChange: (city: string) => void;
  /** Викликається коли місто обрали зі списку (не на кожну літеру). */
  onSelect?: (city: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  /** Для фільтрів: порожнє значення = всі міста */
  allowEmpty?: boolean;
};

const DEFAULT_CLASS =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-sage disabled:bg-mist disabled:opacity-60";

export function CityAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Почни вводити місто…",
  required = false,
  disabled = false,
  className = DEFAULT_CLASS,
  id,
  name,
  allowEmpty = false,
}: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const suggestions = filterUaCities(value, 10);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    setHighlight(0);
  }, [value, open]);

  function pick(city: string) {
    onChange(city);
    onSelect?.(city);
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((index) =>
        suggestions.length ? (index + 1) % suggestions.length : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((index) =>
        suggestions.length
          ? (index - 1 + suggestions.length) % suggestions.length
          : 0,
      );
    } else if (event.key === "Enter") {
      if (suggestions[highlight]) {
        event.preventDefault();
        pick(suggestions[highlight]);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        id={id}
        name={name}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        required={required && !allowEmpty}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        className={className}
        onFocus={() => {
          if (!disabled) setOpen(true);
        }}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
      />

      {open && !disabled && suggestions.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-line bg-white py-1 shadow-lg"
        >
          {allowEmpty && !value.trim() ? (
            <li>
              <button
                type="button"
                role="option"
                className="block w-full px-4 py-2.5 text-left text-sm text-ink-soft hover:bg-mist"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick("")}
              >
                Усі міста
              </button>
            </li>
          ) : null}
          {suggestions.map((city, index) => (
            <li key={city}>
              <button
                type="button"
                role="option"
                aria-selected={index === highlight}
                className={`block w-full px-4 py-2.5 text-left text-sm ${
                  index === highlight
                    ? "bg-sage/15 text-ink"
                    : "text-ink hover:bg-mist"
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setHighlight(index)}
                onClick={() => pick(city)}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
