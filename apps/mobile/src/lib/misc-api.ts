import { apiFetch } from "@/lib/client-api";
import { getApiUrl } from "@/lib/api-url";
import type { ContentPost, ContentTopic, NotificationsSummary } from "@/lib/types";

export function getNotificationsSummary() {
  return apiFetch<NotificationsSummary | null>("/api/notifications/summary", {
    silent: true,
  });
}

export async function getContentTopics(): Promise<ContentTopic[]> {
  const res = await fetch(`${getApiUrl()}/api/content/topics`);
  if (!res.ok) throw new Error("Не вдалося завантажити теми");
  return res.json();
}

export async function getContentPosts(params?: {
  topic?: string;
  featured?: string;
  limit?: number;
}): Promise<{ items: ContentPost[]; total: number }> {
  const qs = new URLSearchParams();
  if (params?.topic) qs.set("topic", params.topic);
  if (params?.featured) qs.set("featured", params.featured);
  if (params?.limit) qs.set("limit", String(params.limit));
  const res = await fetch(
    `${getApiUrl()}/api/content${qs.toString() ? `?${qs}` : ""}`,
  );
  if (!res.ok) throw new Error("Не вдалося завантажити статті");
  return res.json();
}

export async function getContentPost(slug: string) {
  const res = await fetch(`${getApiUrl()}/api/content/${slug}`);
  if (!res.ok) throw new Error("Статтю не знайдено");
  return res.json() as Promise<
    ContentPost & { body?: unknown; excerpt: string }
  >;
}
