import { apiFetch } from "@/lib/client-api";

export type AdminContentTopic = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder?: number;
};

export type AdminContentPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  status: string;
  kind?: string;
  coverUrl?: string | null;
  topicId?: string | null;
};

export function adminListTopics() {
  return apiFetch<AdminContentTopic[]>("/api/admin/content/topics");
}

export function adminCreateTopic(input: {
  name: string;
  slug?: string;
  description?: string;
}) {
  return apiFetch<AdminContentTopic>("/api/admin/content/topics", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function adminDeleteTopic(id: string) {
  return apiFetch(`/api/admin/content/topics/${id}`, { method: "DELETE" });
}

export function adminListPosts(params?: { status?: string; q?: string }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.q) qs.set("q", params.q);
  return apiFetch<AdminContentPost[]>(
    `/api/admin/content/posts${qs.toString() ? `?${qs}` : ""}`,
  );
}

export function adminCreatePost(input: {
  title: string;
  excerpt?: string;
  topicId?: string;
  status?: string;
  kind?: string;
  body?: Record<string, unknown>;
}) {
  return apiFetch<AdminContentPost>("/api/admin/content/posts", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      body: input.body ?? { blocks: [] },
    }),
  });
}

export function adminUpdatePostStatus(id: string, status: string) {
  return apiFetch(`/api/admin/content/posts/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function adminDeletePost(id: string) {
  return apiFetch(`/api/admin/content/posts/${id}`, { method: "DELETE" });
}
