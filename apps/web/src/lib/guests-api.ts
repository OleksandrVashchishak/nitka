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
  tableLabel: string | null;
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
  };
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
  tableLabel?: string;
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

const API_BASE =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

export async function getPublicInvite(token: string): Promise<PublicInvite> {
  const res = await fetch(`${API_BASE}/api/rsvp/${token}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Запрошення не знайдено");
  }
  return res.json();
}

export async function submitPublicRsvp(
  token: string,
  input: {
    rsvpStatus: RsvpStatus;
    plusOneAttending?: boolean;
    plusOneName?: string;
    allergies?: string;
    email?: string;
    phone?: string;
    notes?: string;
  },
) {
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
  const res = await fetch(`${api}/api/rsvp/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      typeof body?.message === "string"
        ? body.message
        : Array.isArray(body?.message)
          ? body.message.join(", ")
          : "Не вдалось надіслати RSVP",
    );
  }
  return res.json();
}
