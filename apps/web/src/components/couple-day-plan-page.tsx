"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageLoader } from "@/components/ui-loader";
import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/require-auth";
import { getMyWedding, upsertWedding } from "@/lib/dashboard-api";
import { toast } from "@/lib/toast";

type EventIcon =
  | "sun"
  | "coffee"
  | "beauty"
  | "dress"
  | "food"
  | "camera"
  | "car"
  | "rings"
  | "party"
  | "music"
  | "cake"
  | "heart"
  | "clock";

type DayEvent = {
  id: string;
  title: string;
  durationMin: number;
  icon: EventIcon;
  /** хвилини від опівночі — якщо null, рахуємо від попереднього */
  startMin: number | null;
};

type PlanState = {
  version: 1;
  use24h: boolean;
  events: DayEvent[];
};

const ICONS: Array<{ id: EventIcon; label: string; glyph: string }> = [
  { id: "sun", label: "Ранок", glyph: "☀" },
  { id: "coffee", label: "Сніданок", glyph: "☕" },
  { id: "beauty", label: "Beauty", glyph: "💄" },
  { id: "dress", label: "Одяг", glyph: "👗" },
  { id: "food", label: "Їжа", glyph: "🍽" },
  { id: "camera", label: "Фото", glyph: "📷" },
  { id: "car", label: "Трансфер", glyph: "🚗" },
  { id: "rings", label: "Церемонія", glyph: "💍" },
  { id: "party", label: "Банкет", glyph: "🥂" },
  { id: "music", label: "Музика", glyph: "🎵" },
  { id: "cake", label: "Торт", glyph: "🎂" },
  { id: "heart", label: "Момент", glyph: "♡" },
  { id: "clock", label: "Інше", glyph: "⏱" },
];

function uid() {
  return `ev-${Math.random().toString(36).slice(2, 9)}`;
}

function defaultEvents(): DayEvent[] {
  return [
    { id: uid(), title: "Пробудження та душ", durationMin: 40, icon: "sun", startMin: 8 * 60 },
    { id: uid(), title: "Сніданок", durationMin: 30, icon: "coffee", startMin: null },
    { id: uid(), title: "Зачіска та макіяж", durationMin: 120, icon: "beauty", startMin: null },
    { id: uid(), title: "Усі вдягаються", durationMin: 30, icon: "dress", startMin: null },
    { id: uid(), title: "Обід або перекус", durationMin: 30, icon: "food", startMin: null },
    { id: uid(), title: "Перша зйомка / love story", durationMin: 60, icon: "camera", startMin: null },
    { id: uid(), title: "Трансфер до церемонії", durationMin: 40, icon: "car", startMin: null },
    { id: uid(), title: "Церемонія", durationMin: 45, icon: "rings", startMin: null },
    { id: uid(), title: "Вітальна година / welcome", durationMin: 60, icon: "party", startMin: null },
    { id: uid(), title: "Банкет і тости", durationMin: 180, icon: "food", startMin: null },
    { id: uid(), title: "Перший танець", durationMin: 15, icon: "music", startMin: null },
    { id: uid(), title: "Торт", durationMin: 20, icon: "cake", startMin: null },
    { id: uid(), title: "Танці до фіналу", durationMin: 120, icon: "party", startMin: null },
  ];
}

function storageKey(weddingId: string) {
  return `nitka-day-plan:v1:${weddingId}`;
}

function loadPlan(weddingId: string): PlanState | null {
  try {
    const raw = localStorage.getItem(storageKey(weddingId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlanState;
    if (parsed.version !== 1 || !Array.isArray(parsed.events)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function savePlan(weddingId: string, plan: PlanState) {
  localStorage.setItem(storageKey(weddingId), JSON.stringify(plan));
}

function clampDuration(value: number) {
  if (!Number.isFinite(value) || value < 5) return 5;
  if (value > 12 * 60) return 12 * 60;
  return Math.round(value);
}

function minutesToLabel(totalMin: number, use24h: boolean) {
  const day = ((totalMin % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(day / 60);
  const m = day % 60;
  if (use24h) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function labelToMinutes(value: string): number | null {
  const trimmed = value.trim();
  const m24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (m24) {
    const h = Number(m24[1]);
    const m = Number(m24[2]);
    if (h > 23 || m > 59) return null;
    return h * 60 + m;
  }
  const m12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m12) {
    let h = Number(m12[1]);
    const m = Number(m12[2]);
    const ampm = m12[3].toUpperCase();
    if (h < 1 || h > 12 || m > 59) return null;
    if (ampm === "AM") {
      if (h === 12) h = 0;
    } else if (h !== 12) {
      h += 12;
    }
    return h * 60 + m;
  }
  return null;
}

function withComputedStarts(events: DayEvent[]) {
  let cursor = 8 * 60;
  return events.map((event, index) => {
    const start =
      event.startMin != null
        ? event.startMin
        : index === 0
          ? cursor
          : cursor;
    const duration = clampDuration(event.durationMin);
    cursor = start + duration;
    return { ...event, durationMin: duration, computedStart: start };
  });
}

function iconGlyph(icon: EventIcon) {
  return ICONS.find((i) => i.id === icon)?.glyph ?? "⏱";
}

function DayPlanInner() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [weddingDate, setWeddingDate] = useState<string>("");
  const [needWedding, setNeedWedding] = useState(false);
  const [use24h, setUse24h] = useState(true);
  const [events, setEvents] = useState<DayEvent[]>(defaultEvents);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingDate, setSavingDate] = useState(false);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const wedding = await getMyWedding();
        if (!wedding) {
          setNeedWedding(true);
          return;
        }
        setWeddingId(wedding.id);
        setWeddingDate(wedding.date.slice(0, 10));
        const saved = loadPlan(wedding.id);
        if (saved) {
          setUse24h(saved.use24h);
          setEvents(saved.events.length ? saved.events : defaultEvents());
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Помилка";
        if (message.toLowerCase().includes("весілля")) {
          setNeedWedding(true);
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!weddingId) return;
    savePlan(weddingId, { version: 1, use24h, events });
  }, [weddingId, use24h, events]);

  const timeline = useMemo(
    () => withComputedStarts(events),
    [events],
  );

  function updateEvent(id: string, patch: Partial<DayEvent>) {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...patch } : event)),
    );
  }

  function addEvent() {
    const last = timeline[timeline.length - 1];
    const nextStart = last
      ? last.computedStart + last.durationMin
      : 10 * 60;
    const event: DayEvent = {
      id: uid(),
      title: "Нова подія",
      durationMin: 30,
      icon: "clock",
      startMin: nextStart,
    };
    setEvents((prev) => [...prev, event]);
    setEditingId(event.id);
  }

  function removeEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function moveEvent(id: string, dir: -1 | 1) {
    setEvents((prev) => {
      const index = prev.findIndex((e) => e.id === id);
      if (index < 0) return prev;
      const next = index + dir;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(next, 0, item);
      return copy;
    });
  }

  function resetPlan() {
    if (!confirm("Скинути весь план подій до шаблону?")) return;
    setEvents(defaultEvents());
    setEditingId(null);
    toast.success("Скинуто", "Повернули стартовий таймлайн");
  }

  async function onSaveDate(e: FormEvent) {
    e.preventDefault();
    if (!weddingDate) return;
    setSavingDate(true);
    try {
      const wedding = await getMyWedding();
      if (!wedding) throw new Error("Спочатку створи весілля");
      await upsertWedding({
        date: weddingDate,
        city: wedding.city,
        guests: wedding.guests,
        budget: wedding.budget,
      });
      toast.success("Дату збережено");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не збережено");
    } finally {
      setSavingDate(false);
    }
  }

  if (loading) {
    return <PageLoader label="Завантажуємо план подій…" />;
  }

  if (needWedding) {
    return (
      <>
        <DashboardNav variant="COUPLE" />
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
          План подій
        </h1>
        <div className="mt-6 rounded-2xl border border-line bg-mist px-6 py-10">
          <p className="text-ink-soft">
            Спочатку збережи дату весілля в огляді — тоді відкриється таймлайн
            дня.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep"
          >
            До огляду
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNav variant="COUPLE" />

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
          План подій
        </h1>
        <p className="mt-3 text-ink-soft">
          Склади розклад весільного дня: час, тривалість і назви блоків. Можна
          редагувати й додавати нові.
        </p>
      </div>

      <form
        onSubmit={onSaveDate}
        className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-sm text-ink-soft"
      >
        <span>Дата весілля:</span>
        <input
          type="date"
          required
          value={weddingDate}
          onChange={(e) => setWeddingDate(e.target.value)}
          className="rounded-lg border border-line bg-white px-3 py-1.5 text-ink outline-none focus:border-sage"
        />
        <button
          type="submit"
          disabled={savingDate}
          className="rounded-full border border-sage/40 px-3 py-1.5 text-sage-deep hover:bg-sage/10 disabled:opacity-60"
        >
          {savingDate ? "…" : "Зберегти"}
        </button>
      </form>

      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-ink">
          <span
            className={`relative h-6 w-11 rounded-full transition ${
              use24h ? "bg-sage" : "bg-line"
            }`}
          >
            <input
              type="checkbox"
              className="peer sr-only"
              checked={use24h}
              onChange={(e) => setUse24h(e.target.checked)}
            />
            <span
              className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition ${
                use24h ? "translate-x-5" : ""
              }`}
            />
          </span>
          24-годинний формат часу
        </label>
        <button
          type="button"
          onClick={resetPlan}
          className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          Скинути весь план подій
        </button>
      </div>

      {error ? (
        <p className="mx-auto mt-4 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mx-auto mt-10 max-w-3xl">
        <div className="flex items-center gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
            Весільний день
          </h2>
          <div className="h-px flex-1 bg-line" />
        </div>

        <ol className="relative mt-8 space-y-0">
          <div
            className="absolute bottom-6 left-[7.25rem] top-6 w-px border-l border-dashed border-ink/25 md:left-[8.5rem]"
            aria-hidden
          />

          {timeline.map((event, index) => {
            const editing = editingId === event.id;
            const timeLabel = minutesToLabel(event.computedStart, use24h);
            return (
              <li key={event.id} className="relative grid grid-cols-[6.5rem_1.5rem_minmax(0,1fr)] gap-2 py-4 md:grid-cols-[8rem_2rem_minmax(0,1fr)] md:gap-3">
                <div className="text-right">
                  <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-mist text-lg md:size-11">
                    {iconGlyph(event.icon)}
                  </div>
                  {editing ? (
                    <input
                      value={
                        event.startMin != null
                          ? minutesToLabel(event.startMin, use24h)
                          : timeLabel
                      }
                      onChange={(e) => {
                        const mins = labelToMinutes(e.target.value);
                        if (mins == null) return;
                        updateEvent(event.id, { startMin: mins });
                      }}
                      className="w-full rounded-lg border border-line bg-white px-2 py-1 text-center text-sm font-semibold outline-none focus:border-sage"
                      placeholder={use24h ? "14:00" : "2:00 PM"}
                    />
                  ) : (
                    <p className="text-lg font-semibold tabular-nums text-ink md:text-xl">
                      {timeLabel}
                    </p>
                  )}
                  {editing ? (
                    <label className="mt-1 block text-[11px] text-ink-soft">
                      хв
                      <input
                        type="number"
                        min={5}
                        max={720}
                        step={5}
                        value={event.durationMin}
                        onChange={(e) =>
                          updateEvent(event.id, {
                            durationMin: clampDuration(Number(e.target.value)),
                          })
                        }
                        className="mt-0.5 w-full rounded-lg border border-line bg-white px-2 py-1 text-center outline-none focus:border-sage"
                      />
                    </label>
                  ) : (
                    <p className="mt-1 text-xs text-ink-soft">
                      Тривалість {event.durationMin} хв
                    </p>
                  )}
                </div>

                <div className="relative flex justify-center pt-3">
                  <span className="relative z-10 size-3 rounded-full border-2 border-sage bg-white" />
                </div>

                <div className="min-w-0 border-b border-line pb-4">
                  {editing ? (
                    <div className="space-y-3">
                      <input
                        value={event.title}
                        onChange={(e) =>
                          updateEvent(event.id, { title: e.target.value })
                        }
                        className="w-full rounded-xl border border-line bg-white px-3 py-2 text-base outline-none focus:border-sage"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {ICONS.map((icon) => (
                          <button
                            key={icon.id}
                            type="button"
                            title={icon.label}
                            onClick={() =>
                              updateEvent(event.id, { icon: icon.id })
                            }
                            className={`size-9 rounded-lg text-base ${
                              event.icon === icon.id
                                ? "bg-sage/15 ring-1 ring-sage/40"
                                : "bg-mist hover:bg-white"
                            }`}
                          >
                            {icon.glyph}
                          </button>
                        ))}
                      </div>
                      <label className="flex items-center gap-2 text-xs text-ink-soft">
                        <input
                          type="checkbox"
                          checked={event.startMin == null && index > 0}
                          onChange={(e) =>
                            updateEvent(event.id, {
                              startMin: e.target.checked
                                ? null
                                : event.computedStart,
                            })
                          }
                          disabled={index === 0}
                          className="accent-[var(--sage)]"
                        />
                        Час автоматично після попередньої події
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white hover:bg-sage-deep"
                        >
                          Готово
                        </button>
                        <button
                          type="button"
                          onClick={() => moveEvent(event.id, -1)}
                          className="rounded-full border border-line px-3 py-2 text-sm text-ink-soft"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveEvent(event.id, 1)}
                          className="rounded-full border border-line px-3 py-2 text-sm text-ink-soft"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeEvent(event.id)}
                          className="rounded-full border border-line px-3 py-2 text-sm text-red-700"
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingId(event.id)}
                      className="group w-full text-left"
                    >
                      <p className="text-lg text-ink transition group-hover:text-sage-deep md:text-xl">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs text-ink-soft opacity-0 transition group-hover:opacity-100">
                        Натисни, щоб редагувати
                      </p>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={addEvent}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-sage/50 bg-sage/5 px-4 py-4 text-sm font-semibold text-sage-deep hover:bg-sage/10"
        >
          <span className="text-lg leading-none">+</span>
          Додати подію
        </button>
      </div>
    </>
  );
}

export function CoupleDayPlanPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-5xl">
          <DayPlanInner />
        </div>
      </section>
    </RequireAuth>
  );
}
