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

export function createReview(input: {
  vendorId: string;
  rating: number;
  text: string;
}) {
  return apiFetch("/api/reviews", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getMyReview(vendorId: string) {
  return apiFetch<{ id: string; rating: number; text: string } | null>(
    `/api/reviews/mine/${vendorId}`,
    { silent: true },
  );
}

export function updateReview(
  id: string,
  input: { rating?: number; text?: string },
) {
  return apiFetch(`/api/reviews/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteReview(id: string) {
  return apiFetch<{ ok: boolean }>(`/api/reviews/${id}`, {
    method: "DELETE",
  });
}
