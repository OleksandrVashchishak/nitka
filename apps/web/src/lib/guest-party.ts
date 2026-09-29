import type { RsvpStatus } from "@/lib/guests-api";

export type ChildNeed = "kids_table" | "high_chair" | "with_parents";

export type InviteMethod =
  | "phone"
  | "telegram"
  | "messenger"
  | "viber"
  | "email"
  | "meet"
  | "other";

export type GuestCompanion = {
  name: string;
  isChild: boolean;
  childNeed: ChildNeed | null;
  rsvpStatus: RsvpStatus;
};

export type GuestPartyDraft = {
  name: string;
  isChild: boolean;
  childNeed: ChildNeed | null;
  rsvpStatus: RsvpStatus;
  companions: GuestCompanion[];
  invited: boolean;
  method: InviteMethod;
};

const COMPANIONS_RE = /\bcompanions:(\S+)/;
const NEED_RE = /\bneed:(\w+)/;
const INVITE_RE = /\binvite:(\w+)/;

const CHILD_NEEDS: ChildNeed[] = [
  "kids_table",
  "high_chair",
  "with_parents",
];

const INVITE_METHODS: InviteMethod[] = [
  "phone",
  "telegram",
  "messenger",
  "viber",
  "email",
  "meet",
  "other",
];

const RSVP_STATUSES: RsvpStatus[] = ["PENDING", "YES", "NO", "MAYBE"];

function isChildNeed(value: unknown): value is ChildNeed {
  return typeof value === "string" && CHILD_NEEDS.includes(value as ChildNeed);
}

function isRsvp(value: unknown): value is RsvpStatus {
  return typeof value === "string" && RSVP_STATUSES.includes(value as RsvpStatus);
}

function isInviteMethod(value: unknown): value is InviteMethod {
  return (
    typeof value === "string" && INVITE_METHODS.includes(value as InviteMethod)
  );
}

export function parseChildNeed(notes: string | null | undefined): ChildNeed | null {
  const match = notes?.match(NEED_RE);
  return isChildNeed(match?.[1]) ? match[1] : null;
}

export function parseInviteMethod(
  notes: string | null | undefined,
): InviteMethod {
  const match = notes?.match(INVITE_RE);
  return isInviteMethod(match?.[1]) ? match[1] : "phone";
}

export function isChildGuest(notes: string | null | undefined) {
  return (notes ?? "").includes("[child]");
}

export function isInvitedGuest(guest: {
  notes: string | null;
  phone: string | null;
  email: string | null;
  respondedAt: string | null;
}) {
  if ((guest.notes ?? "").includes("[invited]")) return true;
  return Boolean(guest.phone || guest.email || guest.respondedAt);
}

export function parseCompanions(
  notes: string | null | undefined,
  fallback?: {
    plusOne?: boolean;
    plusOneName?: string | null;
    plusOneAttending?: boolean | null;
    rsvpStatus?: RsvpStatus;
  },
): GuestCompanion[] {
  const match = notes?.match(COMPANIONS_RE);
  if (match?.[1]) {
    try {
      const raw = JSON.parse(decodeURIComponent(match[1])) as unknown;
      if (Array.isArray(raw)) {
        return raw
          .map((item): GuestCompanion | null => {
            if (!item || typeof item !== "object") return null;
            const row = item as Record<string, unknown>;
            const name = typeof row.name === "string" ? row.name : "";
            const isChild = Boolean(row.isChild);
            const childNeed = isChildNeed(row.childNeed) ? row.childNeed : null;
            const rsvpStatus = isRsvp(row.rsvpStatus)
              ? row.rsvpStatus
              : "PENDING";
            return { name, isChild, childNeed: isChild ? childNeed : null, rsvpStatus };
          })
          .filter((row): row is GuestCompanion => row !== null);
      }
    } catch {
      /* fall through to legacy plus-one */
    }
  }

  if (fallback?.plusOne && fallback.plusOneName?.trim()) {
    const attending = fallback.plusOneAttending;
    const rsvpStatus: RsvpStatus =
      attending === true
        ? "YES"
        : attending === false
          ? "NO"
          : fallback.rsvpStatus ?? "PENDING";
    return [
      {
        name: fallback.plusOneName.trim(),
        isChild: false,
        childNeed: null,
        rsvpStatus,
      },
    ];
  }

  return [];
}

export function buildGuestNotes(input: {
  child: boolean;
  childNeed?: ChildNeed | null;
  invited: boolean;
  method: InviteMethod;
  companions: GuestCompanion[];
  extra?: string | null;
}) {
  const parts: string[] = [];
  if (input.child) parts.push("[child]");
  if (input.invited) parts.push("[invited]");
  parts.push(`invite:${input.method}`);
  if (input.child && input.childNeed) {
    parts.push(`need:${input.childNeed}`);
  }

  const companions = input.companions
    .map((c) => ({
      name: c.name.trim(),
      isChild: c.isChild,
      childNeed: c.isChild ? c.childNeed : null,
      rsvpStatus: c.rsvpStatus,
    }))
    .filter((c) => c.name.length > 0 || c.isChild || c.rsvpStatus !== "PENDING");

  if (companions.length > 0) {
    parts.push(`companions:${encodeURIComponent(JSON.stringify(companions))}`);
  }

  const extra = input.extra
    ?.replace(/\[child\]|\[invited\]|invite:\w+|need:\w+|companions:\S+/g, "")
    .trim();
  if (extra) parts.push(extra);

  return parts.join(" ").trim() || null;
}

export function companionsToLegacyFields(companions: GuestCompanion[]) {
  const named = companions.filter((c) => c.name.trim().length > 0);
  const plusOne = named.length > 0;
  const plusOneName = plusOne
    ? named.map((c) => c.name.trim()).join(", ")
    : null;
  let plusOneAttending: boolean | null = null;
  if (plusOne) {
    if (named.some((c) => c.rsvpStatus === "YES")) plusOneAttending = true;
    else if (named.every((c) => c.rsvpStatus === "NO")) plusOneAttending = false;
  }
  return { plusOne, plusOneName, plusOneAttending };
}

/** How many extra seats to count for headcount (YES companions). */
export function countAttendingCompanions(
  notes: string | null | undefined,
  fallback?: {
    plusOne?: boolean;
    plusOneName?: string | null;
    plusOneAttending?: boolean | null;
  },
) {
  const companions = parseCompanions(notes, fallback);
  if (companions.length > 0) {
    return companions.filter((c) => c.rsvpStatus === "YES").length;
  }
  if (fallback?.plusOne && fallback.plusOneAttending === true) return 1;
  return 0;
}

export function listPartyPeople(guest: {
  name: string;
  notes: string | null;
  rsvpStatus: RsvpStatus;
  plusOne?: boolean;
  plusOneName?: string | null;
  plusOneAttending?: boolean | null;
}) {
  const primaryChild = isChildGuest(guest.notes);
  const primaryNeed = parseChildNeed(guest.notes);
  const companions = parseCompanions(guest.notes, guest);

  return {
    primary: {
      name: guest.name,
      isChild: primaryChild,
      childNeed: primaryChild ? primaryNeed : null,
      rsvpStatus: guest.rsvpStatus,
    },
    companions,
  };
}
