import { apiFetch } from "@/lib/client-api";

export type DayPlanEvent = {
  id: string;
  title: string;
  time: string; // HH:mm
  durationMin: number;
};

export type DayPlanAccessLevel = "view" | "edit";

export type DayPlanSharePerson = {
  id: string;
  name: string;
  email?: string;
  access: DayPlanAccessLevel;
};

export const DAY_PLAN_ACCESS_OPTIONS: {
  value: DayPlanAccessLevel;
  label: string;
}[] = [
  { value: "view", label: "Може переглядати" },
  { value: "edit", label: "Може редагувати" },
];

export const DAY_PLAN_DURATION_OPTIONS = [
  15, 30, 45, 60, 75, 90, 105, 120, 150, 180, 240, 300, 360,
] as const;

/** Стартовий розклад (як у Figma). Використовується як fallback / seed. */
export const DEFAULT_DAY_PLAN: DayPlanEvent[] = [
  { id: "demo-1", title: "Пробудження і душ", time: "08:00", durationMin: 45 },
  { id: "demo-2", title: "Сніданок", time: "08:45", durationMin: 30 },
  { id: "demo-3", title: "Зачіска", time: "09:15", durationMin: 90 },
  { id: "demo-4", title: "Макіяж", time: "10:45", durationMin: 75 },
  { id: "demo-5", title: "Одягання", time: "12:00", durationMin: 45 },
  { id: "demo-6", title: "Фотосесія", time: "13:00", durationMin: 120 },
  { id: "demo-7", title: "Церемонія", time: "16:00", durationMin: 60 },
  {
    id: "demo-8",
    title: "Святкування на локації",
    time: "17:30",
    durationMin: 360,
  },
];

export function dayPlanStorageKey(weddingId: string) {
  return `fata-day-plan:v1:${weddingId}`;
}

export function formatDurationUk(minutes: number) {
  const m = Math.max(0, Math.round(minutes));
  if (m < 60) return `${m} хв`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (rest === 0) return `${h} год`;
  return `${h} год ${rest} хв`;
}

export function formatDayPlanDate(date: string | null | undefined) {
  if (!date) return "Дата весілля не обрана";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "Дата весілля не обрана";
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function sortDayPlanEvents(events: DayPlanEvent[]) {
  return [...events].sort((a, b) => a.time.localeCompare(b.time));
}

export function formatDayPlanShareText(
  dateLabel: string,
  events: DayPlanEvent[],
) {
  const lines = [
    `План дня — ${dateLabel}`,
    "",
    ...sortDayPlanEvents(events).map(
      (e) => `${e.time} — ${e.title} (${formatDurationUk(e.durationMin)})`,
    ),
  ];
  return lines.join("\n");
}

function isDayPlanEvent(value: unknown): value is DayPlanEvent {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.title === "string" &&
    typeof e.time === "string" &&
    typeof e.durationMin === "number"
  );
}

function normalizeEvents(raw: unknown): DayPlanEvent[] | null {
  if (!Array.isArray(raw)) return null;
  return sortDayPlanEvents(raw.filter(isDayPlanEvent));
}

/** Sync read from localStorage (legacy). Does not seed. */
function readLocalDayPlan(weddingId: string): DayPlanEvent[] | null {
  try {
    const raw = localStorage.getItem(dayPlanStorageKey(weddingId));
    if (!raw) return null;
    return normalizeEvents(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** Sync read from localStorage (legacy / offline fallback). Seeds defaults if empty. */
export function loadDayPlan(weddingId: string): DayPlanEvent[] {
  const local = readLocalDayPlan(weddingId);
  if (local) return local;
  const seed = DEFAULT_DAY_PLAN.map((e) => ({ ...e }));
  saveDayPlan(weddingId, seed);
  return seed;
}

export function saveDayPlan(weddingId: string, events: DayPlanEvent[]) {
  try {
    localStorage.setItem(
      dayPlanStorageKey(weddingId),
      JSON.stringify(sortDayPlanEvents(events)),
    );
  } catch {
    /* ignore */
  }
}

function clearLocalDayPlan(weddingId: string) {
  try {
    localStorage.removeItem(dayPlanStorageKey(weddingId));
  } catch {
    /* ignore */
  }
}

type DayPlanMineResponse = {
  weddingId: string;
  events: DayPlanEvent[] | null;
};

export async function fetchDayPlan(): Promise<DayPlanMineResponse> {
  return apiFetch<DayPlanMineResponse>("/api/day-plan", { silent: true });
}

export async function persistDayPlan(events: DayPlanEvent[]) {
  return apiFetch<DayPlanMineResponse>("/api/day-plan", {
    method: "PUT",
    body: JSON.stringify({ events: sortDayPlanEvents(events) }),
    silent: true,
  });
}

/**
 * Load day plan from API.
 * If DB empty but browser has old localStorage — migrate once.
 * If both empty — seed DEFAULT_DAY_PLAN and persist.
 */
export async function loadDayPlanWithMigration(
  weddingId: string,
): Promise<DayPlanEvent[]> {
  let remoteEvents: DayPlanEvent[] | null = null;

  try {
    const remote = await fetchDayPlan();
    if (remote && "events" in remote) {
      remoteEvents =
        remote.events === null ? null : normalizeEvents(remote.events);
    }
  } catch {
    /* fall through */
  }

  if (remoteEvents !== null) {
    clearLocalDayPlan(weddingId);
    return remoteEvents;
  }

  const local = readLocalDayPlan(weddingId);
  const next = local?.length
    ? local
    : DEFAULT_DAY_PLAN.map((e) => ({ ...e }));

  try {
    await persistDayPlan(next);
    clearLocalDayPlan(weddingId);
  } catch {
    saveDayPlan(weddingId, next);
  }

  return sortDayPlanEvents(next);
}

export async function saveDayPlanRemote(
  weddingId: string,
  events: DayPlanEvent[],
) {
  const sorted = sortDayPlanEvents(events);
  try {
    await persistDayPlan(sorted);
    clearLocalDayPlan(weddingId);
  } catch {
    saveDayPlan(weddingId, sorted);
  }
}

export function dayPlanShareStorageKey(weddingId: string) {
  return `fata-day-plan-share:v1:${weddingId}`;
}

function isAccessLevel(value: unknown): value is DayPlanAccessLevel {
  return value === "view" || value === "edit";
}

export function loadDayPlanShare(
  weddingId: string,
  partners: { name: string; email?: string }[] = [],
): DayPlanSharePerson[] {
  try {
    const raw = localStorage.getItem(dayPlanShareStorageKey(weddingId));
    if (raw) {
      const parsed = JSON.parse(raw) as DayPlanSharePerson[];
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (p) =>
            p &&
            typeof p.id === "string" &&
            typeof p.name === "string" &&
            isAccessLevel(p.access),
        );
      }
    }
  } catch {
    /* ignore */
  }

  return partners
    .map((p) => p.name.trim())
    .filter(Boolean)
    .map((name, index) => ({
      id: `partner-${index}`,
      name,
      access: (index === 0 ? "edit" : "view") as DayPlanAccessLevel,
    }));
}

export function saveDayPlanShare(
  weddingId: string,
  people: DayPlanSharePerson[],
) {
  try {
    localStorage.setItem(
      dayPlanShareStorageKey(weddingId),
      JSON.stringify(people),
    );
  } catch {
    /* ignore */
  }
}

export function dayPlanShareUrl(weddingId: string) {
  if (typeof window === "undefined") return `/day-plan?share=${weddingId}`;
  return `${window.location.origin}/day-plan?share=${encodeURIComponent(weddingId)}`;
}
