import { apiFetch } from "@/lib/client-api";
import {
  normalizeSeatingFormat,
  type SeatingGuestsDraft,
  type SeatingTablesDraft,
} from "@/components/seating-wizard";

export type SeatingDraftPayload = {
  tables: SeatingTablesDraft;
  guests: SeatingGuestsDraft;
};

function normalizeDraft(draft: SeatingDraftPayload): SeatingDraftPayload {
  return {
    tables: {
      ...draft.tables,
      format: normalizeSeatingFormat(draft.tables.format),
    },
    guests: {
      ...draft.guests,
      detachedKeys: draft.guests.detachedKeys ?? [],
    },
  };
}

export type SeatingPlanTable = {
  id: string;
  kind: string;
  shape?: "round" | "long";
  label: string;
  x: number;
  y: number;
  rotation?: number;
  seats: { id: string; guestKey: string | null }[];
};

export type SeatingPlanPayload = {
  tables: SeatingPlanTable[];
  savedAt?: number;
};

export type SeatingMineResponse = {
  weddingId: string;
  draft: SeatingDraftPayload | null;
  plan: SeatingPlanPayload | null;
};

const LS_DRAFT = (weddingId: string) =>
  `fata-seating-draft:v1:${weddingId}`;
const LS_PLAN = (weddingId: string) => `fata-seating-plan:v1:${weddingId}`;

function readLocalDraft(weddingId: string): SeatingDraftPayload | null {
  try {
    const raw = localStorage.getItem(LS_DRAFT(weddingId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SeatingDraftPayload;
    if (!parsed?.tables || !parsed?.guests) return null;
    return normalizeDraft(parsed);
  } catch {
    return null;
  }
}

function readLocalPlan(weddingId: string): SeatingPlanPayload | null {
  try {
    const raw = localStorage.getItem(LS_PLAN(weddingId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SeatingPlanPayload;
    if (!parsed?.tables?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

function clearLocalSeating(weddingId: string) {
  try {
    localStorage.removeItem(LS_DRAFT(weddingId));
    localStorage.removeItem(LS_PLAN(weddingId));
  } catch {
    /* ignore */
  }
}

export async function getSeating(): Promise<SeatingMineResponse> {
  return apiFetch<SeatingMineResponse>("/api/seating", { silent: true });
}

export async function saveSeatingDraft(draft: SeatingDraftPayload) {
  return apiFetch<{ weddingId: string; draft: SeatingDraftPayload }>(
    "/api/seating/draft",
    {
      method: "PUT",
      body: JSON.stringify(draft),
      silent: true,
    },
  );
}

export async function saveSeatingPlan(plan: SeatingPlanPayload) {
  return apiFetch<{ weddingId: string; plan: SeatingPlanPayload }>(
    "/api/seating/plan",
    {
      method: "PUT",
      body: JSON.stringify(plan),
      silent: true,
    },
  );
}

export async function clearSeatingPlan() {
  return apiFetch<{ weddingId: string; plan: null }>("/api/seating/plan", {
    method: "DELETE",
    silent: true,
  });
}

/**
 * Load seating from API. If DB empty but browser has old localStorage —
 * migrate once into DB and clear LS.
 */
export async function loadSeatingWithMigration(weddingId: string): Promise<{
  draft: SeatingDraftPayload | null;
  plan: SeatingPlanPayload | null;
}> {
  const remote = await getSeating();
  let draft = remote.draft;
  let plan = remote.plan;

  const localDraft = readLocalDraft(weddingId);
  const localPlan = readLocalPlan(weddingId);

  if (!draft && localDraft) {
    try {
      await saveSeatingDraft(localDraft);
      draft = localDraft;
    } catch {
      draft = localDraft;
    }
  }

  if (!plan && localPlan) {
    try {
      await saveSeatingPlan(localPlan);
      plan = localPlan;
    } catch {
      plan = localPlan;
    }
  }

  if (draft || plan) {
    clearLocalSeating(weddingId);
  }

  return {
    draft: draft ? normalizeDraft(draft) : null,
    plan,
  };
}
