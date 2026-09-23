import { apiFetch } from "@/lib/client-api";
import type {
  Guest,
  GuestListResponse,
  GuestSide,
  RsvpStatus,
} from "@/lib/types";

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
