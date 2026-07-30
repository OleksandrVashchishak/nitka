export const MANUAL_VENDOR_CATEGORIES = [
  { slug: "venue", name: "Локація" },
  { slug: "catering", name: "Кейтеринг" },
  { slug: "photo", name: "Фото" },
  { slug: "video", name: "Відео" },
  { slug: "music", name: "Музика / DJ" },
  { slug: "host", name: "Ведучий" },
  { slug: "decor", name: "Декор" },
  { slug: "beauty", name: "Beauty" },
  { slug: "cake", name: "Торт" },
  { slug: "transport", name: "Транспорт" },
  { slug: "other", name: "Інше" },
] as const;

export function manualCategoryLabel(slug: string) {
  return MANUAL_VENDOR_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}
