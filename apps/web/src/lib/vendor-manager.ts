/** Категорії для менеджера підрядників пари */
export type VendorManagerCategory = {
  slug: string;
  name: string;
  icon: string;
  /** Якщо є в каталозі NITKA — лінк «з сервісу» (пізніше) */
  catalogSlug?: string;
};

export const VENDOR_MANAGER_CATEGORIES: VendorManagerCategory[] = [
  { slug: "venue", name: "Локація", icon: "🏛", catalogSlug: "venue" },
  { slug: "catering", name: "Кейтеринг", icon: "🍽" },
  { slug: "photo", name: "Фото", icon: "📷", catalogSlug: "photo" },
  { slug: "video", name: "Відео", icon: "🎥" },
  { slug: "music", name: "Музика / DJ", icon: "🎵", catalogSlug: "music" },
  { slug: "host", name: "Ведучий", icon: "🎙" },
  { slug: "decor", name: "Декор і квіти", icon: "🌷", catalogSlug: "decor" },
  { slug: "beauty", name: "Beauty", icon: "💄", catalogSlug: "beauty" },
  { slug: "cake", name: "Торт", icon: "🎂" },
  { slug: "transport", name: "Транспорт", icon: "🚗" },
  { slug: "attire", name: "Одяг пари", icon: "👗" },
  { slug: "rings", name: "Обручки", icon: "💍" },
  { slug: "invitations", name: "Запрошення", icon: "✉" },
  { slug: "gifts", name: "Подарунки гостям", icon: "🎁" },
  { slug: "officiant", name: "Церемоніймейстер", icon: "📜" },
  { slug: "planner", name: "Організатор", icon: "📋" },
  { slug: "lights", name: "Світло / сцена", icon: "💡" },
  { slug: "hotel", name: "Проживання", icon: "🛏" },
  { slug: "other", name: "Інше", icon: "✦" },
];

export function vendorManagerCategoryLabel(slug: string) {
  return (
    VENDOR_MANAGER_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug
  );
}
