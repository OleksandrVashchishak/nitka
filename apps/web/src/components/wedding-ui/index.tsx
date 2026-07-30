"use client";

import { useEffect, useState } from "react";
import type { WeddingTheme } from "@/lib/wedding-themes";

export function ThemeDivider({
  theme,
  compact,
}: {
  theme: WeddingTheme;
  compact?: boolean;
}) {
  return (
    <div
      className={`mx-auto flex items-center justify-center gap-4 ${compact ? "py-6" : "py-10"}`}
    >
      <span
        className="h-px w-12"
        style={{ background: `${theme.colors.accent}40` }}
      />
      <span className="text-xs" style={{ color: `${theme.colors.accent}60` }}>
        {theme.decorations.dividerSymbol}
      </span>
      <span
        className="h-px w-12"
        style={{ background: `${theme.colors.accent}40` }}
      />
    </div>
  );
}

export function SectionEyebrow({
  theme,
  children,
}: {
  theme: WeddingTheme;
  children: React.ReactNode;
}) {
  return (
    <p
      className="text-[11px] font-medium uppercase tracking-[0.25em]"
      style={{ color: theme.colors.accent }}
    >
      {children}
    </p>
  );
}

export function SectionTitle({
  theme,
  compact,
  children,
  className = "",
}: {
  theme: WeddingTheme;
  compact?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-[family-name:var(--font-display)] ${
        compact ? "text-2xl" : "text-3xl md:text-5xl"
      } ${className}`}
      style={{ color: theme.colors.text }}
    >
      {children}
    </h2>
  );
}

export function SplitMeta({
  theme,
  dateLabel,
  cityLabel,
  compact,
}: {
  theme: WeddingTheme;
  dateLabel: string;
  cityLabel: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`mx-auto flex max-w-2xl flex-col items-center gap-3 px-1 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center sm:gap-6 md:gap-10 ${
        compact ? "mt-8" : "mt-10 md:mt-16"
      }`}
    >
      <p
        className={`min-w-0 break-words text-center font-[family-name:var(--font-display)] uppercase leading-tight tracking-wide sm:text-right ${
          compact ? "text-lg" : "text-lg sm:text-2xl md:text-4xl"
        }`}
        style={{ color: theme.colors.text }}
      >
        {dateLabel}
      </p>
      <span
        className={
          compact
            ? "h-px w-10 shrink-0 sm:h-12 sm:w-px"
            : "h-px w-10 shrink-0 sm:h-20 sm:w-px md:h-28"
        }
        style={{ background: theme.colors.accent }}
      />
      <p
        className={`min-w-0 break-words text-center font-[family-name:var(--font-display)] uppercase leading-tight tracking-wide sm:text-left ${
          compact ? "text-lg" : "text-lg sm:text-2xl md:text-4xl"
        }`}
        style={{ color: theme.colors.text }}
      >
        {cityLabel}
      </p>
    </div>
  );
}

export function RsvpButton({
  theme,
  href = "#rsvp",
  label = "Запрошення",
}: {
  theme: WeddingTheme;
  href?: string;
  label?: string;
}) {
  const isLight = theme.id === "classic-white";
  const external = href.startsWith("http") || href.startsWith("/rsvp/");
  return (
    <a
      href={href || "#rsvp"}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="mx-auto block w-full max-w-xs px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.22em] transition-opacity hover:opacity-80 sm:inline-block sm:w-auto sm:px-10 sm:py-3"
      style={{
        background: theme.colors.accent,
        color: isLight ? "#ffffff" : theme.colors.bg,
      }}
    >
      {label}
    </a>
  );
}

export function WeddingSiteNav({
  theme,
  items,
}: {
  theme: WeddingTheme;
  items: Array<[string, string]>;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative z-20">
      <nav
        className="hidden flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-5 text-[11px] uppercase tracking-[0.18em] sm:flex sm:gap-x-7"
        style={{ color: theme.colors.textDim }}
      >
        {items.map(([href, label], i) => (
          <a
            key={href}
            href={href}
            className="transition-colors"
            style={{
              color: i === 0 ? theme.colors.text : undefined,
              borderBottom:
                i === 0
                  ? `1px solid ${theme.colors.accent}`
                  : "1px solid transparent",
              paddingBottom: 2,
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      <div
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-end px-4 py-3 backdrop-blur-md sm:hidden"
        style={{ background: theme.colors.navBg }}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Закрити меню" : "Відкрити меню"}
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer px-3 py-2 text-xs uppercase tracking-[0.18em]"
          style={{
            color: theme.colors.text,
            border: `1px solid ${theme.colors.line}`,
          }}
        >
          {open ? "Закрити" : "Меню"}
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          style={{ background: theme.colors.bg }}
        >
          <div className="flex h-full flex-col justify-center gap-5 px-8 pb-16 text-[13px] uppercase tracking-[0.18em]">
            {items.map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block py-1"
                style={{ color: theme.colors.text }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function BokehField({ accent = "#d4a76a" }: { accent?: string }) {
  const dots = [
    [8, 6, 3],
    [18, 12, 2],
    [28, 4, 4],
    [38, 16, 2.5],
    [48, 8, 3.5],
    [58, 14, 2],
    [68, 5, 3],
    [78, 11, 4],
    [88, 7, 2.5],
    [12, 22, 2],
    [42, 24, 3],
    [72, 20, 2],
    [92, 18, 3],
    [22, 2, 2.5],
    [55, 3, 2],
  ] as const;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[42%] overflow-hidden"
    >
      {dots.map(([x, y, r], i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: r * 2,
            height: r * 2,
            background: accent,
            opacity: 0.18 + (i % 5) * 0.06,
            boxShadow: `0 0 ${r * 3}px ${accent}55`,
          }}
        />
      ))}
    </div>
  );
}

export function BotanicalCorners({ color = "#c9a96e" }: { color?: string }) {
  const encoded = encodeURIComponent(color);
  const corner = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220' fill='none'%3E%3Cpath d='M12 200C18 120 48 70 110 18C92 72 88 118 96 168C70 150 40 162 12 200Z' stroke='${encoded}' stroke-width='1' opacity='0.55'/%3E%3Cpath d='M28 188C42 140 72 90 108 36C96 80 90 122 94 160C76 150 48 168 28 188Z' stroke='${encoded}' stroke-width='0.8' opacity='0.35'/%3E%3Cpath d='M100 28C108 10 128 14 122 34C116 52 96 48 100 28Z' stroke='${encoded}' stroke-width='0.9' opacity='0.5'/%3E%3Cpath d='M118 22C126 8 142 16 134 30' stroke='${encoded}' stroke-width='0.7' opacity='0.4'/%3E%3C/svg%3E")`;

  return (
    <>
      <div
        className="pointer-events-none absolute left-0 top-0 h-48 w-48 opacity-80 md:h-72 md:w-72"
        style={{
          backgroundImage: corner,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 h-48 w-48 opacity-80 md:h-72 md:w-72"
        style={{
          backgroundImage: corner,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          transform: "scaleX(-1)",
        }}
      />
    </>
  );
}

export function MothMark({ color = "#c9a96e" }: { color?: string }) {
  return (
    <svg
      aria-hidden
      width="56"
      height="40"
      viewBox="0 0 56 40"
      fill="none"
      className="mx-auto mb-6 opacity-80"
    >
      <path
        d="M28 8c2 4 4 10 4 16 0-6 2-12 4-16-2 1-4 2-4 2s-2-1-4-2Z"
        stroke={color}
        strokeWidth="1"
      />
      <path
        d="M28 24c-10-2-18 2-22 8 8-2 16 0 22 4 6-4 14-6 22-4-4-6-12-10-22-8Z"
        stroke={color}
        strokeWidth="1"
      />
      <circle cx="28" cy="22" r="2" stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

export function Reveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  return (
    <div
      className={`wedding-reveal ${className}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
