import { apiFetch } from "@/lib/client-api";
import type {
  ContentKind,
  ContentPost,
  ContentStatus,
  ContentTopic,
  EditorJsBody,
} from "@/lib/content-api";

export type AdminContentPost = ContentPost;
export type AdminContentTopic = ContentTopic;

export function getAdminContentTopics() {
  return apiFetch<AdminContentTopic[]>("/api/admin/content/topics");
}

export function createAdminContentTopic(data: {
  name: string;
  slug?: string;
  description?: string;
  sortOrder?: number;
}) {
  return apiFetch<AdminContentTopic>("/api/admin/content/topics", {
    method: "POST",
    body: JSON.stringify(data),
    successToast: "Топік створено",
  });
}

export function updateAdminContentTopic(
  id: string,
  data: {
    name: string;
    slug?: string;
    description?: string;
    sortOrder?: number;
  },
) {
  return apiFetch<AdminContentTopic>(`/api/admin/content/topics/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    successToast: "Топік оновлено",
  });
}

export function deleteAdminContentTopic(id: string) {
  return apiFetch<{ ok: boolean }>(`/api/admin/content/topics/${id}`, {
    method: "DELETE",
    successToast: "Топік видалено",
  });
}

export function getAdminContentPosts(params?: {
  status?: ContentStatus;
  topic?: string;
  q?: string;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.topic) query.set("topic", params.topic);
  if (params?.q) query.set("q", params.q);
  const qs = query.toString();
  return apiFetch<AdminContentPost[]>(
    `/api/admin/content/posts${qs ? `?${qs}` : ""}`,
  );
}

export function getAdminContentPost(id: string) {
  return apiFetch<AdminContentPost>(`/api/admin/content/posts/${id}`);
}

export type UpsertAdminContentPost = {
  title: string;
  slug?: string;
  excerpt?: string;
  coverUrl?: string | null;
  kind?: ContentKind;
  status?: ContentStatus;
  body?: EditorJsBody;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string | null;
  city?: string | null;
  vendorCategorySlug?: string | null;
  featured?: boolean;
  topicId: string;
};

export function createAdminContentPost(data: UpsertAdminContentPost) {
  return apiFetch<AdminContentPost>("/api/admin/content/posts", {
    method: "POST",
    body: JSON.stringify(data),
    successToast: "Матеріал створено",
  });
}

export function updateAdminContentPost(
  id: string,
  data: UpsertAdminContentPost,
) {
  return apiFetch<AdminContentPost>(`/api/admin/content/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    successToast: "Збережено",
  });
}

export function updateAdminContentStatus(id: string, status: ContentStatus) {
  return apiFetch<AdminContentPost>(`/api/admin/content/posts/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    successToast:
      status === "PUBLISHED"
        ? "Опубліковано"
        : status === "ARCHIVED"
          ? "В архіві"
          : "Чернетка",
  });
}

export function deleteAdminContentPost(id: string) {
  return apiFetch<{ ok: boolean }>(`/api/admin/content/posts/${id}`, {
    method: "DELETE",
    successToast: "Видалено",
  });
}
