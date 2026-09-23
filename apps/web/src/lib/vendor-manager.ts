/** Категорії для менеджера підрядників пари */
export type VendorManagerCategory = {
  slug: string;
  name: string;
};

export const VENDOR_MANAGER_CATEGORIES: VendorManagerCategory[] = [
  { slug: "venue", name: "Весільна локація / ресторан" },
  { slug: "host", name: "Ведучий" },
  { slug: "photo", name: "Фотограф" },
  { slug: "video", name: "Відеограф" },
  { slug: "band", name: "Музиканти / живий гурт" },
  { slug: "dj", name: "DJ" },
  { slug: "planner", name: "Весільний організатор" },
  { slug: "decor", name: "Декоратор" },
  { slug: "florist", name: "Флорист" },
  { slug: "hair", name: "Стиліст зачіски" },
  { slug: "makeup", name: "Візажист" },
  { slug: "attire", name: "Весільний салон / ательє" },
  { slug: "catering", name: "Кейтеринг" },
  { slug: "ceremony-venue", name: "Локація для церемонії" },
  { slug: "officiant", name: "Церемоніймейстер виїзної церемонії" },
  { slug: "transport", name: "Транспорт / водій" },
  { slug: "choreographer", name: "Хореограф для постановки першого танцю" },
  { slug: "cake", name: "Весільний торт" },
  { slug: "pastry", name: "Пекар для пляцків" },
  { slug: "candybar", name: "Кенді-бар / десертний стіл" },
  { slug: "hotel", name: "Проживання для гостей" },
  { slug: "other", name: "Інше" },
];

export function vendorManagerCategoryLabel(slug: string) {
  return (
    VENDOR_MANAGER_CATEGORIES.find((c) => c.slug === slug)?.name ??
    LEGACY_CATEGORY_LABELS[slug] ??
    slug
  );
}

const LEGACY_CATEGORY_LABELS: Record<string, string> = {
  music: "Музика / DJ",
  beauty: "Beauty",
  rings: "Обручки",
  invitations: "Запрошення",
  gifts: "Подарунки гостям",
  lights: "Світло / сцена",
};

/** Resolve category for list rows — include legacy slugs still present in data */
export function resolveVendorCategoryEntry(slug: string): VendorManagerCategory {
  const known = VENDOR_MANAGER_CATEGORIES.find((c) => c.slug === slug);
  if (known) return known;
  return {
    slug,
    name: vendorManagerCategoryLabel(slug),
  };
}

export type VendorContactMethod =
  | "phone"
  | "telegram"
  | "instagram"
  | "messenger"
  | "viber"
  | "email"
  | "meet"
  | "other";

export const VENDOR_CONTACT_METHODS: Array<{
  id: VendorContactMethod;
  label: string;
}> = [
  { id: "phone", label: "Телефоном" },
  { id: "telegram", label: "Telegram" },
  { id: "instagram", label: "Instagram" },
  { id: "messenger", label: "Messenger" },
  { id: "viber", label: "Viber" },
  { id: "email", label: "Email" },
  { id: "meet", label: "При зустрічі" },
  { id: "other", label: "Інше" },
];

export type VendorCurrency = "UAH" | "USD" | "EUR";

export const VENDOR_CURRENCIES: Array<{ id: VendorCurrency; label: string; symbol: string }> = [
  { id: "UAH", label: "Гривні", symbol: "₴" },
  { id: "USD", label: "Долари", symbol: "$" },
  { id: "EUR", label: "Євро", symbol: "€" },
];

export type VendorMeta = {
  contactMethod?: VendorContactMethod;
  deposit?: number | null;
  depositCurrency?: VendorCurrency;
  balance?: number | null;
  balanceCurrency?: VendorCurrency;
  customLabel?: string | null;
};

const META_PREFIX = "fata-vendor-meta:";

export function parseVendorMeta(notes: string | null | undefined): VendorMeta {
  if (!notes?.startsWith(META_PREFIX)) return {};
  try {
    return JSON.parse(notes.slice(META_PREFIX.length)) as VendorMeta;
  } catch {
    return {};
  }
}

export function serializeVendorMeta(meta: VendorMeta): string | null {
  const payload: VendorMeta = {
    contactMethod: meta.contactMethod,
    deposit: meta.deposit ?? null,
    depositCurrency: meta.depositCurrency ?? "UAH",
    balance: meta.balance ?? null,
    balanceCurrency: meta.balanceCurrency ?? "UAH",
    customLabel: meta.customLabel?.trim() || null,
  };
  return `${META_PREFIX}${JSON.stringify(payload)}`;
}

export function formatVendorMoney(
  value: number | null | undefined,
  currency: VendorCurrency = "UAH",
) {
  if (value == null || Number.isNaN(value)) return "—";
  const symbol =
    VENDOR_CURRENCIES.find((c) => c.id === currency)?.symbol ?? "₴";
  const formatted = new Intl.NumberFormat("uk-UA").format(value);
  return currency === "UAH" ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
}

/** Legacy browser key — cleared after plan moved to wedding.vendor_plan. */
export const VENDOR_PLAN_KEY = "fata-vendor-plan-v1";

export function clearLegacyVendorPlan() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(VENDOR_PLAN_KEY);
  } catch {
    /* ignore */
  }
}
