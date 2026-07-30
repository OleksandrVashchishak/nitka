import type {
  WebsiteContent,
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
    scheduleTitle: String(base.scheduleTitle ?? "Програма дня"),
    scheduleItems: Array.isArray(base.scheduleItems) ? base.scheduleItems : [],
    dressCodeTitle: String(base.dressCodeTitle ?? "Дрес-код"),
    dressCodeBody: String(base.dressCodeBody ?? ""),
    galleryTitle: String(base.galleryTitle ?? "Фото"),
    galleryImages: Array.isArray(base.galleryImages) ? base.galleryImages : [],
    qaTitle: String(base.qaTitle ?? "Q + A"),
    qaItems: Array.isArray(base.qaItems) ? base.qaItems : [],
    travelTitle: String(base.travelTitle ?? "Як дістатися"),
    travelBody: String(base.travelBody ?? ""),
    travelItems: Array.isArray(base.travelItems) ? base.travelItems : [],
    registryTitle: String(base.registryTitle ?? "Registry"),
    registryBody: String(base.registryBody ?? ""),
    registryItems: Array.isArray(base.registryItems) ? base.registryItems : [],
    rsvpTitle: String(base.rsvpTitle ?? "Будеш з нами?"),
    rsvpBody: String(base.rsvpBody ?? ""),
    rsvpUrl: String(base.rsvpUrl ?? ""),
    footerNote: String(base.footerNote ?? ""),
    sections,
    introEnabled: Boolean(base.introEnabled),
    introTitle: String(base.introTitle ?? "Відкрити запрошення"),
    musicUrl: String(base.musicUrl ?? ""),
  };
}
