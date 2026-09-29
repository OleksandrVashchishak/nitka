import type {
  WebsiteContent,
  WebsiteQaItem,
  WebsiteSections,
} from "@/lib/website-api";

const DEFAULT_SECTIONS: WebsiteSections = {
  story: true,
  schedule: true,
  dressCode: true,
  gallery: false,
  qa: false,
  travel: false,
  registry: false,
  rsvp: true,
};

/** Old shipped defaults → current template labels. */
const TITLE_ALIASES: Record<string, string> = {
  Registry: "Побажання щодо подарунків",
  "Що дарувати": "Побажання щодо подарунків",
  "Як дістатися": "Контакти організаторів",
  "Будеш з нами?": "Підтвердіть свою присутність",
  "Коли треба дати відповідь": "Підтвердіть свою присутність",
  "Програма дня": "Деталі нашого свята",
  "День нашого весілля": "Деталі нашого свята",
  "Чи можна з дітьми?": "Квіти",
};

function canonicalTitle(value: unknown, fallback: string) {
  const raw = String(value ?? "").trim();
  if (!raw) return fallback;
  return TITLE_ALIASES[raw] ?? raw;
}

function canonicalQaItems(items: unknown): WebsiteQaItem[] {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    const row = (item ?? {}) as Partial<WebsiteQaItem>;
    return {
      question: canonicalTitle(row.question, "Квіти"),
      answer: String(row.answer ?? ""),
    };
  });
}

/** Normalize older API payloads so the editor never crashes on missing fields. */
export function normalizeWebsiteContent(
  raw: Partial<WebsiteContent> | null | undefined,
  fallback?: Partial<WebsiteContent> | null,
): WebsiteContent {
  const base = { ...(fallback ?? {}), ...(raw ?? {}) } as Partial<WebsiteContent>;
  const sections = {
    ...DEFAULT_SECTIONS,
    ...(fallback?.sections ?? {}),
    ...(raw?.sections ?? {}),
  };

  const galleryTitleRaw = String(base.galleryTitle ?? "");
  const galleryTitle = galleryTitleRaw === "Фото" ? "" : galleryTitleRaw;

  return {
    headline: String(base.headline ?? ""),
    subheadline: String(base.subheadline ?? ""),
    dateLabel: String(base.dateLabel ?? ""),
    cityLabel: String(base.cityLabel ?? ""),
    dateFormat: base.dateFormat === "en" ? "en" : "uk",
    accentColor: String(base.accentColor ?? ""),
    heroImageUrl: String(base.heroImageUrl ?? ""),
    coupleImageUrl: String(base.coupleImageUrl ?? ""),
    storyTitle: String(base.storyTitle ?? "Наша історія"),
    storyBody: String(base.storyBody ?? ""),
    storyImageUrl: String(base.storyImageUrl ?? ""),
    scheduleTitle: canonicalTitle(base.scheduleTitle, "Деталі нашого свята"),
    scheduleItems: Array.isArray(base.scheduleItems) ? base.scheduleItems : [],
    dressCodeTitle: canonicalTitle(base.dressCodeTitle, "Дрес-код"),
    dressCodeBody: String(base.dressCodeBody ?? ""),
    galleryTitle,
    galleryImages: Array.isArray(base.galleryImages) ? base.galleryImages : [],
    qaTitle: String(base.qaTitle ?? "Q + A"),
    qaItems: canonicalQaItems(base.qaItems),
    travelTitle: canonicalTitle(base.travelTitle, "Контакти організаторів"),
    travelBody: String(base.travelBody ?? ""),
    travelItems: Array.isArray(base.travelItems) ? base.travelItems : [],
    registryTitle: canonicalTitle(base.registryTitle, "Побажання щодо подарунків"),
    registryBody: String(base.registryBody ?? ""),
    registryItems: Array.isArray(base.registryItems) ? base.registryItems : [],
    rsvpTitle: canonicalTitle(base.rsvpTitle, "Підтвердіть свою присутність"),
    rsvpBody: String(base.rsvpBody ?? ""),
    rsvpUrl: String(base.rsvpUrl ?? ""),
    footerNote: String(base.footerNote ?? ""),
    sections,
    introEnabled: Boolean(base.introEnabled),
    introTitle: String(base.introTitle ?? "Відкрити запрошення"),
    musicUrl: String(base.musicUrl ?? ""),
    timerEnabled: base.timerEnabled !== false,
    shareDescription: String(base.shareDescription ?? ""),
    groomBio: String(base.groomBio ?? ""),
    proposalBody: String(base.proposalBody ?? ""),
  };
}
