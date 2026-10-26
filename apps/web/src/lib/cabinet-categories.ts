/** Shared cabinet categories for Budget + Tasks. */

export const CABINET_CATEGORY_IDS = [
  "vendors",
  "attire",
  "decor",
  "banquet",
  "print",
  "other",
] as const;

export type CabinetCategoryId = (typeof CABINET_CATEGORY_IDS)[number];

export const CABINET_CATEGORIES: Array<{
  id: CabinetCategoryId;
  label: string;
}> = [
  { id: "vendors", label: "Підрядники" },
  { id: "attire", label: "Образи" },
  { id: "decor", label: "Декор" },
  { id: "banquet", label: "Банкет" },
  { id: "print", label: "Поліграфія" },
  { id: "other", label: "Інше" },
];

/** Map fine-grained API / plan slugs → cabinet UI category. */
export const SLUG_TO_CABINET_CATEGORY: Record<string, CabinetCategoryId> = {
  venue: "vendors",
  photo: "vendors",
  video: "vendors",
  music: "vendors",
  host: "vendors",
  beauty: "vendors",
  transport: "vendors",
  vendors: "vendors",
  officiant: "vendors",
  planner: "vendors",
  favorites: "vendors",
  requests: "vendors",
  attire: "attire",
  rings: "attire",
  decor: "decor",
  catering: "banquet",
  cake: "banquet",
  banquet: "banquet",
  docs: "print",
  gifts: "print",
  print: "print",
  invitations: "print",
  "invite-guests": "print",
  website: "print",
  other: "other",
  honeymoon: "other",
  reserve: "other",
  budget: "other",
  "starter-budget": "other",
  "starter-plan": "other",
  "starter-guests": "other",
  guests: "other",
  rsvp: "other",
  seating: "other",
  vibe: "other",
};

export type CabinetCategoryTone = "lilac" | "blue" | "orange" | "gray";

export function cabinetCategoryLabel(id: CabinetCategoryId) {
  return CABINET_CATEGORIES.find((c) => c.id === id)?.label ?? "Інше";
}

export function cabinetCategoryTone(id: CabinetCategoryId): CabinetCategoryTone {
  switch (id) {
    case "vendors":
      return "lilac";
    case "attire":
      return "blue";
    case "decor":
    case "print":
      return "orange";
    case "banquet":
    case "other":
    default:
      return "gray";
  }
}

export function cabinetCategoryMeta(id: CabinetCategoryId) {
  return {
    label: cabinetCategoryLabel(id),
    tone: cabinetCategoryTone(id),
  };
}

/** Resolve a task/budget slug (+ optional title hints) to a cabinet category. */
export function resolveCabinetCategory(
  slug: string | null | undefined,
  title = "",
): CabinetCategoryId {
  const [base, override] = (slug ?? "").split("@");
  if (override && (CABINET_CATEGORY_IDS as readonly string[]).includes(override)) {
    return override as CabinetCategoryId;
  }
  const key = base;
  const mapped = SLUG_TO_CABINET_CATEGORY[key];
  if (mapped) return mapped;

  const lower = title.toLowerCase();
  if (lower.includes("вбран") || lower.includes("образ") || lower.includes("сукн")) {
    return "attire";
  }
  if (lower.includes("декор") || lower.includes("квіт")) {
    return "decor";
  }
  if (
    lower.includes("банкет") ||
    lower.includes("кейт") ||
    lower.includes("меню") ||
    lower.includes("торт")
  ) {
    return "banquet";
  }
  if (
    lower.includes("запрош") ||
    lower.includes("поліграф") ||
    lower.includes("друк")
  ) {
    return "print";
  }
  if (
    lower.includes("фото") ||
    lower.includes("відео") ||
    lower.includes("місц") ||
    lower.includes("ведуч") ||
    lower.includes("підряд") ||
    lower.includes("dj") ||
    lower.includes("музик")
  ) {
    return "vendors";
  }
  return "other";
}

/** Persist UI category as the task/budget categorySlug. */
export function cabinetCategoryToSlug(id: CabinetCategoryId): string {
  return id;
}
