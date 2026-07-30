import { apiFetch } from "@/lib/client-api";
import type {
  DashboardInsights,
  TaskStatus,
  Wedding,
  WeddingTask,
} from "@/lib/types";
import { getApiUrl } from "@/lib/api-url";

export function getMyWedding() {
  return apiFetch<Wedding | null>("/api/weddings/me");
}

export function upsertWedding(input: {
  date: string;
  city: string;
  guests: number;
  budget: number;
  partnerOneName?: string;
  partnerTwoName?: string;
  couplePhotoUrl?: string | null;
  cityUndecided?: boolean;
  guestsUndecided?: boolean;
}) {
  return apiFetch<Wedding>("/api/weddings/me", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function getDashboardInsights() {
  return apiFetch<DashboardInsights | null>("/api/weddings/me/insights", {
    silent: true,
  });
}

export function createPartnerInvite() {
  return apiFetch<{ token: string; expiresAt: string; path: string }>(
    "/api/weddings/me/partner-invite",
    { method: "POST" },
  );
}

export async function getPartnerInvitePreview(token: string) {
  const res = await fetch(
    `${getApiUrl()}/api/weddings/partner-invite/${token}`,
  );
  if (!res.ok) throw new Error("Запрошення недійсне");
  return res.json() as Promise<{
    token: string;
    expiresAt: string;
    city: string;
    date: string;
    coupleName: string;
  }>;
}

export function acceptPartnerInvite(token: string) {
  return apiFetch<Wedding>(`/api/weddings/partner-invite/${token}/accept`, {
    method: "POST",
  });
}

export function createTask(input: {
  title: string;
  categorySlug?: string;
  dueDate?: string | null;
}) {
  return apiFetch<WeddingTask>("/api/weddings/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTask(
  id: string,
  input: Partial<{ status: TaskStatus; dueDate: string | null; title: string }>,
) {
  return apiFetch<WeddingTask>(`/api/weddings/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTask(id: string) {
  return apiFetch<{ ok: boolean }>(`/api/weddings/tasks/${id}`, {
    method: "DELETE",
  });
}
