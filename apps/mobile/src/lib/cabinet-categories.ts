/** Shared cabinet categories for Budget + Tasks (mirror of apps/web/src/lib/cabinet-categories.ts). */

export const CABINET_CATEGORIES = [
  { value: "vendors", label: "Підрядники" },
  { value: "attire", label: "Образи" },
  { value: "decor", label: "Декор" },
  { value: "banquet", label: "Банкет" },
  { value: "print", label: "Поліграфія" },
  { value: "other", label: "Інше" },
] as const;

export type CabinetCategoryId = (typeof CABINET_CATEGORIES)[number]["value"];

/** Map fine-grained API / plan slugs → cabinet UI category. */
const SLUG_TO_CABINET_CATEGORY: Record<string, CabinetCategoryId> = {
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
};

export function resolveCabinetCategory(
  slug: string | null | undefined,
): CabinetCategoryId {
  return SLUG_TO_CABINET_CATEGORY[slug ?? ""] ?? "other";
}
