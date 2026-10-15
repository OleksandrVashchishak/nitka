import { apiFetch } from "@/lib/client-api";

export type DayPlanEvent = {
  id: string;
  title: string;
  time: string; // HH:mm
  durationMin: number;
};

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

/** "08:45" → хвилини від півночі. Невалідне → 0. */
export function parseDayPlanTime(time: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return 0;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (!Number.isFinite(h) || !Number.isFinite(m) || m < 0 || m > 59) return 0;
  return ((Math.max(0, h) * 60 + m) % (24 * 60) + 24 * 60) % (24 * 60);
}

export function formatDayPlanTime(totalMinutes: number): string {
  const normalized =
    ((Math.round(totalMinutes) % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Ланцюжок без дірок: перша подія стартує в `startTime`,
 * наступні — одразу після кінця попередньої.
 */
export function rechainDayPlanTimes(
  events: DayPlanEvent[],
  startTime: string,
): DayPlanEvent[] {
  let cursor = parseDayPlanTime(startTime);
  return events.map((event) => {
    const time = formatDayPlanTime(cursor);
    cursor += Math.max(0, event.durationMin);
    return { ...event, time };
  });
}

/**
 * Переставити подію і перерахувати часи від старту розкладу
 * (час першої події до перестановки лишається якорем дня).
 */
export function reorderDayPlanEvents(
  events: DayPlanEvent[],
  fromIndex: number,
  toIndex: number,
): DayPlanEvent[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= events.length ||
    toIndex >= events.length
  ) {
    return events;
  }
  const next = [...events];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  const anchor = events[0]?.time ?? "08:00";
  return rechainDayPlanTimes(next, anchor);
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

/** Sync read from localStorage (legacy / offline fallback). Does not seed. */
export function loadDayPlan(weddingId: string): DayPlanEvent[] {
  return readLocalDayPlan(weddingId) ?? [];
}

/** Стартовий шаблон розкладу — лише після явного «Додати план». */
export function cloneDefaultDayPlan(): DayPlanEvent[] {
  return DEFAULT_DAY_PLAN.map((e) => ({ ...e }));
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
 * If both empty — return [] (empty state until user adds a plan).
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
  if (!local?.length) {
    return [];
  }

  try {
    await persistDayPlan(local);
    clearLocalDayPlan(weddingId);
  } catch {
    saveDayPlan(weddingId, local);
  }

  return sortDayPlanEvents(local);
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
