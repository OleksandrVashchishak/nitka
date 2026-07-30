import { apiFetch } from "@/lib/client-api";

export type WebsiteScheduleItem = {
  time: string;
  title: string;
  detail: string;
};

export type WebsiteQaItem = {
  question: string;
  answer: string;
};

export type WebsiteTravelItem = {
  title: string;
  detail: string;
};

export type WebsiteRegistryItem = {
  title: string;
  url: string;
  detail: string;
};

export type WebsiteSections = {
  story: boolean;
  schedule: boolean;
  dressCode: boolean;
  gallery: boolean;
  qa: boolean;
  travel: boolean;
  registry: boolean;
  rsvp: boolean;
};

export type WebsiteContent = {
  headline: string;
  subheadline: string;
  dateLabel: string;
  cityLabel: string;
  dateFormat: "uk" | "en";
  accentColor: string;
  heroImageUrl: string;
  coupleImageUrl: string;
  storyTitle: string;
  storyBody: string;
  storyImageUrl: string;
  scheduleTitle: string;
  scheduleItems: WebsiteScheduleItem[];
  dressCodeTitle: string;
  dressCodeBody: string;
  galleryTitle: string;
  galleryImages: string[];
  qaTitle: string;
  qaItems: WebsiteQaItem[];
  travelTitle: string;
  travelBody: string;
  travelItems: WebsiteTravelItem[];
  registryTitle: string;
  registryBody: string;
  registryItems: WebsiteRegistryItem[];
  rsvpTitle: string;
  rsvpBody: string;
  rsvpUrl: string;
  footerNote: string;
  sections: WebsiteSections;
  introEnabled: boolean;
  introTitle: string;
  musicUrl: string;
};

export type WebsiteTemplateMeta = {
  id: string;
  name: string;
  description: string;
};

export type WeddingWebsite = {
  id: string;
  slug: string;
  templateId: string;
  published: boolean;
  content: WebsiteContent;
  updatedAt: string;
  publicPath: string;
  wedding: {
    partnerOneName: string;
    partnerTwoName: string;
    date: string;
    city: string;
  };
};

export type WebsiteMineResponse = {
  site: WeddingWebsite | null;
  suggestedSlug: string;
  defaults: WebsiteContent;
  templates: WebsiteTemplateMeta[];
};

const SERVER_API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

export function getMyWebsite() {
  return apiFetch<WebsiteMineResponse>("/api/website/me");
}

export function upsertMyWebsite(input: {
  slug?: string;
  templateId?: string;
  published?: boolean;
  content?: WebsiteContent;
}) {
  return apiFetch<WeddingWebsite>("/api/website/me", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function getPublicWebsite(slug: string): Promise<WeddingWebsite> {
  const res = await fetch(
    `${SERVER_API_URL}/api/website/public/${encodeURIComponent(slug)}`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    throw new Error("Сайт не знайдено");
  }
  return res.json();
}
