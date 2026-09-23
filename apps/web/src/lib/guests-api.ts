import { apiFetch } from "@/lib/client-api";

export type RsvpStatus = "PENDING" | "YES" | "NO" | "MAYBE";
export type GuestSide = "BRIDE" | "GROOM" | "BOTH" | "OTHER";

export type Guest = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  side: GuestSide;
  rsvpStatus: RsvpStatus;
  plusOne: boolean;
  plusOneName: string | null;
  plusOneAttending: boolean | null;
  allergies: string | null;
  notes: string | null;
  inviteToken: string;
  respondedAt: string | null;
  createdAt: string;
};

export type GuestListResponse = {
  wedding: {
    id: string;
    date: string;
    city: string;
    plannedGuests: number;
  };
  stats: {
    total: number;
    yes: number;
    no: number;
    maybe: number;
    pending: number;
    headcount: number;
  };
  guests: Guest[];
};

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
  notes?: string;
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
