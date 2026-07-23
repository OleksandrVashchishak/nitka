/** Публічний origin сайту для Metadata / sitemap / canonical. */
export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.NODE_ENV === "production"
      ? "https://nitka-web.onrender.com"
      : "http://localhost:3000");

  return raw.replace(/\/$/, "");
}

export const SITE_NAME = "NITKA";

export const SITE_DESCRIPTION =
  "Знайдіть ідеальних весільних підрядників: фото, локації, музику, декор і beauty.";

/** Metadata для кабінетів / адмінки — не індексувати. */
export const noIndexRobots = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
} as const;

/** Короткий опис для meta description / OG. */
export function truncateMeta(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

/** Абсолютний URL для OG / canonical assets. */
export function absoluteUrl(pathOrUrl?: string | null) {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = getSiteUrl();
  return `${base}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
