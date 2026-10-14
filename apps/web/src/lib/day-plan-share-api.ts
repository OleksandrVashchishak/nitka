import { apiFetch } from "@/lib/client-api";
import type { DayPlanEvent } from "@/lib/day-plan";

export type DayPlanShareAccess = "VIEW" | "EDIT";

export const DAY_PLAN_ACCESS_OPTIONS: {
  value: DayPlanShareAccess;
  label: string;
}[] = [
  { value: "VIEW", label: "Може переглядати" },
  { value: "EDIT", label: "Може редагувати" },
];

export const DAY_PLAN_REVOKE_VALUE = "__revoke__";

export type DayPlanSharePerson = {
  id: string;
  kind: "member" | "grant";
  name: string;
  email?: string;
  access: DayPlanShareAccess;
  locked: boolean;
  accepted?: boolean;
};

export type DayPlanShareState = {
  token: string;
  path: string;
  people: DayPlanSharePerson[];
  invitePath?: string;
};

export type DayPlanPublicPayload = {
  token: string;
  weddingId: string;
  date: string;
  partnerOneName: string;
  partnerTwoName: string;
  events: DayPlanEvent[];
};

export type DayPlanInvitePreview = {
  inviteToken: string;
  email: string;
  name: string;
  access: DayPlanShareAccess;
  accepted: boolean;
  shareToken: string;
  date: string;
  coupleName: string;
};

export type DayPlanSharedAccess = {
  access: DayPlanShareAccess | null;
  canEdit: boolean;
};

export function dayPlanSharedUrl(token: string) {
  if (typeof window === "undefined") return `/day-plan/shared/${token}`;
  return `${window.location.origin}/day-plan/shared/${encodeURIComponent(token)}`;
}

export async function fetchDayPlanShare() {
  return apiFetch<DayPlanShareState>("/api/day-plan/share");
}

export async function inviteDayPlanShare(input: {
  email: string;
  access: DayPlanShareAccess;
}) {
  return apiFetch<DayPlanShareState>("/api/day-plan/share/invite", {
    method: "POST",
    body: JSON.stringify(input),
    silent: true,
  });
}

export async function updateDayPlanShareGrant(
  grantId: string,
  access: DayPlanShareAccess,
) {
  return apiFetch<DayPlanShareState>(`/api/day-plan/share/grants/${grantId}`, {
    method: "PATCH",
    body: JSON.stringify({ access }),
    silent: true,
  });
}

export async function revokeDayPlanShareGrant(grantId: string) {
  return apiFetch<DayPlanShareState>(`/api/day-plan/share/grants/${grantId}`, {
    method: "DELETE",
    silent: true,
  });
}

export async function fetchDayPlanPublic(token: string) {
  return apiFetch<DayPlanPublicPayload>(
    `/api/day-plan/public/${encodeURIComponent(token)}`,
    { silent: true },
  );
}

export async function fetchDayPlanSharedAccess(token: string) {
  return apiFetch<DayPlanSharedAccess>(
    `/api/day-plan/shared/${encodeURIComponent(token)}/access`,
    { silent: true },
  );
}

export async function persistDayPlanByShareToken(
  token: string,
  events: DayPlanEvent[],
) {
  return apiFetch<{ weddingId: string; events: DayPlanEvent[] }>(
    `/api/day-plan/shared/${encodeURIComponent(token)}`,
    {
      method: "PUT",
      body: JSON.stringify({ events }),
      silent: true,
    },
  );
}

export async function fetchDayPlanInvitePreview(inviteToken: string) {
  return apiFetch<DayPlanInvitePreview>(
    `/api/day-plan/invite/${encodeURIComponent(inviteToken)}`,
    { silent: true },
  );
}

export async function acceptDayPlanInvite(inviteToken: string) {
  return apiFetch<{
    shareToken: string;
    access: DayPlanShareAccess;
    path: string;
  }>(`/api/day-plan/invite/${encodeURIComponent(inviteToken)}/accept`, {
    method: "POST",
    silent: true,
  });
}
