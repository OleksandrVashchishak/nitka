import { apiFetch } from "@/lib/client-api";
import { getApiUrl } from "@/lib/api-url";
import type {
  Guest,
  GuestListResponse,
  GuestSide,
  RsvpStatus,
} from "@/lib/types";
import type { InvitationContent } from "@/lib/invitations-api";

export type GuestInput = {
  name: string;
  email?: string;
  phone?: string;
  side?: GuestSide;
  rsvpStatus?: RsvpStatus;
  plusOne?: boolean;
  plusOneName?: string;
  plusOneAttending?: boolean | null;
  allergies?: string;
  tableLabel?: string | null;
  notes?: string;
};

export type PublicInvite = {
  token: string;
  name: string;
  email: string | null;
  phone: string | null;
  rsvpStatus: RsvpStatus;
  plusOne: boolean;
  plusOneName: string | null;
  plusOneAttending: boolean | null;
  allergies: string | null;
  notes: string | null;
  wedding: {
    date: string;
    city: string;
    coupleName: string;
    websiteUrl?: string | null;
  };
  invitation?: {
    templateId: string;
    content: InvitationContent;
  };
};

export function getGuestList() {
  return apiFetch<GuestListResponse>("/api/guests");
}

export function createGuest(input: GuestInput) {
  return apiFetch<Guest>("/api/guests", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateGuest(id: string, input: Partial<GuestInput>) {
  return apiFetch<Guest>(`/api/guests/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteGuest(id: string) {
  return apiFetch<{ ok: boolean }>(`/api/guests/${id}`, {
    method: "DELETE",
  });
}

export function importGuests(
  guests: Array<{
    name: string;
    email?: string;
    phone?: string;
    side?: GuestSide;
    plusOne?: boolean;
    notes?: string;
  }>,
) {
  return apiFetch<{ imported: number; guests: Guest[] }>("/api/guests/import", {
    method: "POST",
    body: JSON.stringify({ guests }),
  });
}

export async function getPublicInvite(token: string): Promise<PublicInvite> {
  const res = await fetch(`${getApiUrl()}/api/rsvp/${token}`);
  if (!res.ok) throw new Error("Запрошення не знайдено");
  return res.json();
}

export async function submitPublicRsvp(
  token: string,
  input: {
    rsvpStatus: RsvpStatus;
    plusOneAttending?: boolean | null;
    plusOneName?: string;
    allergies?: string;
    notes?: string;
    email?: string;
    phone?: string;
  },
) {
  const res = await fetch(`${getApiUrl()}/api/rsvp/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      typeof body?.message === "string" ? body.message : "Не вдалося зберегти",
    );
  }
  return res.json() as Promise<PublicInvite>;
}
