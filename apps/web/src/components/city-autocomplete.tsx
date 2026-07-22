"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { filterUaCities } from "@/lib/ua-cities";

type Props = {
  value: string;
  onChange: (city: string) => void;
  onSelect?: (city: string) => void;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  allowEmpty?: boolean;
};

const DEFAULT_CLASS =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-sage disabled:bg-mist disabled:opacity-60";

const PANEL_BG = "#ffffff";
const HOVER_BG = "#e8ebe8";
const BORDER = "#d5dbd6";

type Coords = { top: number; left: number; width: number };

export function CityAutocomplete({
  value,
  onChange,
  onSelect,
  onOpenChange,
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
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [coords, setCoords] = useState<Coords | null>(null);
  const suggestions = filterUaCities(value ?? "", 10);

  function openListFromEl(el: HTMLElement | null) {
    if (disabled || !el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 180),
    });
    setOpen(true);
    onOpenChange?.(true);
  }

  function closeList() {
    setOpen(false);
    onOpenChange?.(false);
  }

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      closeList();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onReposition = () => {
      const el = rootRef.current?.querySelector("input");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 180),
      });
    };
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [open]);

  useEffect(() => {
    setHighlight(0);
  }, [value, open]);

  function pick(city: string) {
    onChange(city);
    onSelect?.(city);
    closeList();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      openListFromEl(event.currentTarget);
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
      closeList();
    }
  }

  const optionStyle = (active: boolean): CSSProperties => ({
    display: "block",
    width: "100%",
    padding: "10px 16px",
    textAlign: "left",
    fontSize: 14,
    lineHeight: 1.4,
    border: 0,
    cursor: "pointer",
    color: "#1a1f1c",
    backgroundColor: active ? HOVER_BG : PANEL_BG,
  });

  const show =
    typeof document !== "undefined" &&
    open &&
    !disabled &&
    suggestions.length > 0 &&
    coords !== null;

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
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
        value={value ?? ""}
        placeholder={placeholder}
        className={className}
        onFocus={(event) => openListFromEl(event.currentTarget)}
        onClick={(event) => openListFromEl(event.currentTarget)}
        onChange={(event) => {
          onChange(event.target.value);
          openListFromEl(event.currentTarget);
        }}
        onKeyDown={onKeyDown}
      />

      {show
        ? createPortal(
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                width: coords.width,
                zIndex: 2147483646,
                maxHeight: 240,
                overflow: "auto",
                margin: 0,
                padding: "4px 0",
                listStyle: "none",
                borderRadius: 12,
                border: `1px solid ${BORDER}`,
                backgroundColor: PANEL_BG,
                boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
              }}
            >
              {allowEmpty && !(value ?? "").trim() ? (
                <li>
                  <button
                    type="button"
                    role="option"
                    style={{ ...optionStyle(false), color: "#5c665f" }}
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
                    style={optionStyle(index === highlight)}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setHighlight(index)}
                    onClick={() => pick(city)}
                  >
                    {city}
                  </button>
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}
