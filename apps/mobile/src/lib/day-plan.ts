import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "@/lib/client-api";

export type DayEvent = {
  id: string;
  title: string;
  durationMin: number;
  /** хвилини від опівночі; null = від попередньої */
  startMin: number | null;
  icon?: string;
};

export type DayPlanState = {
  version: 1;
  events: DayEvent[];
  use24h?: boolean;
};

function uid() {
  return `ev-${Math.random().toString(36).slice(2, 9)}`;
}

export function defaultDayEvents(): DayEvent[] {
  return [
    { id: uid(), title: "Пробудження", durationMin: 40, startMin: 8 * 60 },
    { id: uid(), title: "Сніданок", durationMin: 30, startMin: null },
    { id: uid(), title: "Зачіска / макіяж", durationMin: 120, startMin: null },
    { id: uid(), title: "Зйомка", durationMin: 60, startMin: null },
    { id: uid(), title: "Трансфер", durationMin: 40, startMin: null },
    { id: uid(), title: "Церемонія", durationMin: 45, startMin: null },
    { id: uid(), title: "Welcome", durationMin: 60, startMin: null },
    { id: uid(), title: "Банкет", durationMin: 180, startMin: null },
    { id: uid(), title: "Перший танець", durationMin: 15, startMin: null },
    { id: uid(), title: "Торт", durationMin: 20, startMin: null },
    { id: uid(), title: "Танці", durationMin: 120, startMin: null },
  ];
}

function storageKey(weddingId: string) {
  return `nitka-day-plan:v1:${weddingId}`;
}

function normalizePlan(raw: unknown): DayPlanState | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as DayPlanState;
  if (obj.version !== 1 || !Array.isArray(obj.events)) return null;
  return obj;
}

async function readLocal(weddingId: string): Promise<DayPlanState | null> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(weddingId));
    if (!raw) return null;
    return normalizePlan(JSON.parse(raw));
  } catch {
    return null;
  }
}

async function writeLocal(weddingId: string, plan: DayPlanState) {
  await AsyncStorage.setItem(storageKey(weddingId), JSON.stringify(plan));
}

export async function loadDayPlan(
  weddingId: string,
): Promise<{ plan: DayPlanState; source: "server" | "local" | "default" }> {
  const local = await readLocal(weddingId);

  try {
    const res = await apiFetch<{ dayPlan: DayPlanState | null } | null>(
      "/api/weddings/me/day-plan",
      { silent: true },
    );
    if (res) {
      const server = normalizePlan(res.dayPlan);
      if (server) {
        await writeLocal(weddingId, server);
        return { plan: server, source: "server" };
      }
      // сервер порожній — підтягни локальний і засіяй
      if (local && local.events.length) {
        await apiFetch("/api/weddings/me/day-plan", {
          method: "PUT",
          body: JSON.stringify(local),
          silent: true,
        }).catch(() => undefined);
        return { plan: local, source: "local" };
      }
    }
  } catch {
    if (local) return { plan: local, source: "local" };
  }

  if (local) return { plan: local, source: "local" };
  return { plan: { version: 1, events: defaultDayEvents() }, source: "default" };
}

export async function saveDayPlan(weddingId: string, plan: DayPlanState) {
  await writeLocal(weddingId, plan);
  try {
    await apiFetch("/api/weddings/me/day-plan", {
      method: "PUT",
      body: JSON.stringify(plan),
      silent: true,
    });
    return { synced: true as const };
  } catch {
    return { synced: false as const };
  }
}

export function minutesToLabel(totalMin: number) {
  const day = ((totalMin % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(day / 60);
  const m = day % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** "09:30" → хвилини від опівночі; null якщо порожньо/невалідно */
export function labelToMinutes(label: string): number | null {
  const t = label.trim();
  if (!t) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

export function resolveStarts(events: DayEvent[]) {
  let cursor = 8 * 60;
  return events.map((ev) => {
    const start = ev.startMin ?? cursor;
    const end = start + Math.max(5, ev.durationMin);
    cursor = end;
    return { ...ev, start, end };
  });
}
