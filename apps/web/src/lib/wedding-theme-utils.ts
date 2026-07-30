import type { CSSProperties } from "react";
import type { WeddingTheme } from "@/lib/wedding-themes";

export function withAccent(
  theme: WeddingTheme,
  accentColor?: string,
): WeddingTheme {
  const accent = accentColor?.trim();
  if (!accent) return theme;
  return {
    ...theme,
    colors: {
      ...theme.colors,
      accent,
    },
  };
}

export const ACCENT_PRESETS = [
  { id: "default", label: "За темою", value: "" },
  { id: "sage", label: "Sage", value: "#6f8f7c" },
  { id: "blush", label: "Blush", value: "#c98b8b" },
  { id: "gold", label: "Gold", value: "#c9a96e" },
  { id: "navy", label: "Navy", value: "#1b334a" },
] as const;

export function formatWeddingDate(date: string | Date, format: "uk" | "en") {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  if (format === "en") {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
      .format(d)
      .toUpperCase();
  }
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function revealStyle(delayMs = 0): CSSProperties {
  return {
    animation: `weddingFadeUp 700ms ease both`,
    animationDelay: `${delayMs}ms`,
  };
}

/** Дозволяє лише http(s), відносні шляхи й якорі. Блокує javascript:/data: тощо. */
export function safeHref(raw?: string | null, fallback = "#"): string {
  const value = raw?.trim();
  if (!value) return fallback;
  if (value.startsWith("#") || value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") return value;
  } catch {
    /* ignore */
  }
  return fallback;
}

