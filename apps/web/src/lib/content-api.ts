import type { Category } from "@/lib/api";

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

const isDev = process.env.NODE_ENV !== "production";

function fetchCache(revalidate: number): RequestInit {
  if (isDev) return { cache: "no-store" };
  return { next: { revalidate } };
}

export type ContentKind = "ARTICLE" | "GUIDE" | "LANDING";
export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type EditorJsBody = {
  time?: number;
  blocks?: Array<{
    id?: string;
    type: string;
    data: Record<string, unknown>;
  }>;
  version?: string;
};

export type ContentTopic = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string | null;
  coverUrl?: string | null;
  sortOrder: number;
  _count?: { posts: number };
};

export type ContentPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl?: string | null;
  kind: ContentKind;
  status: ContentStatus;
  body: EditorJsBody;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl?: string | null;
  city?: string | null;
  vendorCategorySlug?: string | null;
  featured: boolean;
  topicId: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  topic: ContentTopic;
  author?: { id: string; name: string } | null;
};

export type ContentListResponse = {
  items: ContentPost[];
  total: number;
  page: number;
  limit: number;
};

export async function getContentTopics(): Promise<ContentTopic[]> {
  const res = await fetch(
    `${API_URL}/api/content/topics`,
    fetchCache(60),
  );
  if (!res.ok) return [];
  return res.json();
}

export async function getContentTopic(
  slug: string,
): Promise<ContentTopic | null> {
  const res = await fetch(
    `${API_URL}/api/content/topics/${encodeURIComponent(slug)}`,
    fetchCache(60),
  );
  if (!res.ok) return null;
  return res.json();
}

export async function getContentPosts(params?: {
  topic?: string;
  kind?: ContentKind;
  featured?: boolean;
  page?: number;
  limit?: number;
}): Promise<ContentListResponse> {
  const query = new URLSearchParams();
  if (params?.topic) query.set("topic", params.topic);
  if (params?.kind) query.set("kind", params.kind);
  if (params?.featured) query.set("featured", "1");
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  const res = await fetch(
    `${API_URL}/api/content${qs ? `?${qs}` : ""}`,
    fetchCache(30),
  );
  if (!res.ok) {
    return { items: [], total: 0, page: 1, limit: 12 };
  }
  return res.json();
}

export async function getContentPost(
  slug: string,
): Promise<ContentPost | null> {
  const res = await fetch(
    `${API_URL}/api/content/${encodeURIComponent(slug)}`,
    fetchCache(30),
  );
  if (!res.ok) return null;
  return res.json();
}

export function contentHref(post: { slug: string }) {
  return `/content/${post.slug}`;
}

export function contentTopicHref(topic: { slug: string }) {
  return `/content/topic/${topic.slug}`;
}

export function contentKindLabel(kind: ContentKind) {
  switch (kind) {
    case "GUIDE":
      return "Гайд";
    case "LANDING":
      return "Підбірка";
    default:
      return "Стаття";
  }
}

/** Re-export for admin landing picker typing */
export type { Category };
