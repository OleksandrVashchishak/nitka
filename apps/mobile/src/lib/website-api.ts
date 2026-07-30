import { apiFetch } from "@/lib/client-api";

export type WeddingWebsite = {
  id: string;
  slug: string;
  templateId: string;
  published: boolean;
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
  templates: Array<{ id: string; name: string; description: string }>;
};

export function getMyWebsite() {
  return apiFetch<WebsiteMineResponse>("/api/website/me");
}

export function upsertMyWebsite(input: {
  slug?: string;
  templateId?: string;
  published?: boolean;
}) {
  return apiFetch<WeddingWebsite>("/api/website/me", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function websitePublicUrl(slugOrPath: string) {
  const base = (process.env.EXPO_PUBLIC_WEB_URL || "https://nitka.ua").replace(
    /\/$/,
    "",
  );
  if (slugOrPath.startsWith("/")) return `${base}${slugOrPath}`;
  if (slugOrPath.startsWith("http")) return slugOrPath;
  return `${base}/w/${slugOrPath}`;
}

export function websiteEditorUrl() {
  const base = (process.env.EXPO_PUBLIC_WEB_URL || "https://nitka.ua").replace(
    /\/$/,
    "",
  );
  return `${base}/website`;
}
