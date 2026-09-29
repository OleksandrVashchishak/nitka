/** Helpers for multi-+1 guests stored in Guest.notes */

const COMPANIONS_RE = /\bcompanions:(\S+)/;

type CompanionRsvp = { rsvpStatus?: string };

function parseCompanionRows(
  notes: string | null | undefined,
): CompanionRsvp[] {
  const match = notes?.match(COMPANIONS_RE);
  if (!match?.[1]) return [];
  try {
    const raw = JSON.parse(decodeURIComponent(match[1])) as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (item): item is CompanionRsvp =>
        !!item && typeof item === 'object',
    );
  } catch {
    return [];
  }
}

export function countYesCompanions(
  notes: string | null | undefined,
  fallback?: {
    plusOne?: boolean;
    plusOneAttending?: boolean | null;
  },
): number {
  const rows = parseCompanionRows(notes);
  if (rows.length > 0) {
    return rows.filter((row) => row.rsvpStatus === 'YES').length;
  }
  if (fallback?.plusOne && fallback.plusOneAttending === true) return 1;
  return 0;
}

export function listCompanionNames(
  notes: string | null | undefined,
  fallbackName?: string | null,
): Array<{ name: string; isChild: boolean; rsvpStatus: string }> {
  const match = notes?.match(COMPANIONS_RE);
  if (match?.[1]) {
    try {
      const raw = JSON.parse(decodeURIComponent(match[1])) as unknown;
      if (Array.isArray(raw)) {
        return raw
          .map((item) => {
            if (!item || typeof item !== 'object') return null;
            const row = item as Record<string, unknown>;
            const name = typeof row.name === 'string' ? row.name.trim() : '';
            if (!name) return null;
            return {
              name,
              isChild: Boolean(row.isChild),
              rsvpStatus:
                typeof row.rsvpStatus === 'string' ? row.rsvpStatus : 'PENDING',
            };
          })
          .filter(
            (
              row,
            ): row is {
              name: string;
              isChild: boolean;
              rsvpStatus: string;
            } => row !== null,
          );
      }
    } catch {
      /* legacy */
    }
  }
  if (fallbackName?.trim()) {
    return [
      {
        name: fallbackName.trim(),
        isChild: false,
        rsvpStatus: 'PENDING',
      },
    ];
  }
  return [];
}
