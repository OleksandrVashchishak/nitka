import { apiFetch } from "@/lib/client-api";
import type { Category, Vendor } from "@/lib/types";

export type AdminStats = {
  users: number;
  couples: number;
  vendors: number;
  pendingVendors: number;
  requests: number;
  reviews: number;
};

export function getAdminStats() {
  return apiFetch<AdminStats>("/api/admin/stats");
}

export function getAdminVendors(params?: { status?: string; q?: string }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.q) qs.set("q", params.q);
  return apiFetch<Array<Vendor & { status: string; user?: { email: string } }>>(
    `/api/admin/vendors${qs.toString() ? `?${qs}` : ""}`,
  );
}

export function patchVendorStatus(
  id: string,
  input: { status: string; moderationNote?: string },
) {
  return apiFetch(`/api/admin/vendors/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function patchVendorFeatured(id: string, featured: boolean) {
  return apiFetch(`/api/admin/vendors/${id}/featured`, {
    method: "PATCH",
    body: JSON.stringify({ featured }),
  });
}

export function getAdminUsers(params?: { role?: string; q?: string }) {
  const qs = new URLSearchParams();
  if (params?.role) qs.set("role", params.role);
  if (params?.q) qs.set("q", params.q);
  return apiFetch<
    Array<{
      id: string;
      email: string;
      name: string;
      role: string;
      blocked?: boolean;
    }>
  >(`/api/admin/users${qs.toString() ? `?${qs}` : ""}`);
}

export function patchAdminUser(
  id: string,
  input: Partial<{ blocked: boolean; role: string; name: string; email: string }>,
) {
  return apiFetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function getAdminRequests(params?: { status?: string; q?: string }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.q) qs.set("q", params.q);
  return apiFetch(`/api/admin/requests${qs.toString() ? `?${qs}` : ""}`);
}

export function getAdminCategories() {
  return apiFetch<Category[]>("/api/admin/categories");
}

export function createAdminCategory(input: {
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
}) {
  return apiFetch<Category>("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateAdminCategory(
  id: string,
  input: Partial<{
    name: string;
    slug: string;
    description: string;
    sortOrder: number;
  }>,
) {
  return apiFetch<Category>(`/api/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteAdminCategory(id: string) {
  return apiFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
}

export function getAdminReviews() {
  return apiFetch<
    Array<{
      id: string;
      rating: number;
      text: string;
      user: { name: string };
      vendor: { name: string };
    }>
  >("/api/admin/reviews");
}

export function deleteAdminReview(id: string) {
  return apiFetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
}
