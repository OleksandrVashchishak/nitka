const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

const isDev = process.env.NODE_ENV !== "production";

/** Short timeout so SSG/build doesn't hang when the API is asleep (Render free). */
const FETCH_TIMEOUT_MS = 8_000;

function fetchCache(revalidate: number): RequestInit {
  const signal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  if (isDev) return { cache: "no-store", signal };
  return { next: { revalidate }, signal };
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
  try {
    const res = await fetch(
      `${API_URL}/api/content/topics`,
      fetchCache(60),
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getContentTopic(
  slug: string,
): Promise<ContentTopic | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/content/topics/${encodeURIComponent(slug)}`,
      fetchCache(60),
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getContentPosts(params?: {
  topic?: string;
  kind?: ContentKind;
  featured?: boolean;
  q?: string;
  city?: string;
  page?: number;
  limit?: number;
}): Promise<ContentListResponse> {
  const query = new URLSearchParams();
  if (params?.topic) query.set("topic", params.topic);
  if (params?.kind) query.set("kind", params.kind);
  if (params?.featured) query.set("featured", "1");
  if (params?.q) query.set("q", params.q);
  if (params?.city) query.set("city", params.city);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  try {
    const res = await fetch(
      `${API_URL}/api/content${qs ? `?${qs}` : ""}`,
      fetchCache(30),
    );
    if (!res.ok) {
      return { items: [], total: 0, page: 1, limit: 12 };
    }
    return res.json();
  } catch {
    return { items: [], total: 0, page: 1, limit: 12 };
  }
}

export async function getContentPost(
  slug: string,
): Promise<ContentPost | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/content/${encodeURIComponent(slug)}`,
      fetchCache(30),
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getContentCities(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/api/content/cities`, fetchCache(60));
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export function contentHref(post: { slug: string }) {
  return `/blog/${post.slug}`;
}

export function contentTopicHref(topic: { slug: string }) {
  return `/blog/${topic.slug}`;
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
