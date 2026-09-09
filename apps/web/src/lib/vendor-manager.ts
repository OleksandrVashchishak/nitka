/** Категорії для менеджера підрядників пари */
export type VendorManagerCategory = {
  slug: string;
  name: string;
  /** Якщо є в каталозі fata.studio — лінк «з сервісу» (пізніше) */
  catalogSlug?: string;
};

export const VENDOR_MANAGER_CATEGORIES: VendorManagerCategory[] = [
  { slug: "venue", name: "Весільна локація / ресторан", catalogSlug: "venue" },
  { slug: "host", name: "Ведучий" },
  { slug: "photo", name: "Фотограф", catalogSlug: "photo" },
  { slug: "video", name: "Відеограф" },
  { slug: "band", name: "Музиканти / живий гурт", catalogSlug: "music" },
  { slug: "dj", name: "DJ", catalogSlug: "music" },
  { slug: "planner", name: "Весільний організатор" },
  { slug: "decor", name: "Декоратор", catalogSlug: "decor" },
  { slug: "florist", name: "Флорист", catalogSlug: "decor" },
  { slug: "hair", name: "Стиліст зачіски", catalogSlug: "beauty" },
  { slug: "makeup", name: "Візажист", catalogSlug: "beauty" },
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

export const VENDOR_PLAN_KEY = "fata-vendor-plan-v1";

export function loadVendorPlan(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VENDOR_PLAN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function saveVendorPlan(slugs: string[]) {
  localStorage.setItem(VENDOR_PLAN_KEY, JSON.stringify(slugs));
}
