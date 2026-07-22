"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { CityAutocomplete } from "@/components/city-autocomplete";
import type { Wedding, WeddingTask } from "@/lib/dashboard-api";
import {
  getPhaseWindowLabel,
  PLAN_ITEMS,
  PLAN_PHASES,
} from "@/lib/wedding-plan";

type Props = {
  wedding: Wedding | null;
  date: string;
  city: string;
  guests: number;
  budget: number;
  saving: boolean;
  onDateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onGuestsChange: (value: number) => void;
  onBudgetChange: (value: number) => void;
  onPickDay: (day: number) => void;
  onSave: (e?: FormEvent) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
};

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

function monthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}

function taskForKey(tasks: WeddingTask[], key: string) {
  return tasks.find((t) => t.categorySlug === key);
}

export function WeddingPlanPanel({
  wedding,
  date,
  city,
  guests,
  budget,
  saving,
  onDateChange,
  onCityChange,
  onGuestsChange,
  onBudgetChange,
  onPickDay,
  onSave,
  onToggleTask,
}: Props) {
  const tasks = wedding?.tasks ?? [];
  const [phase, setPhase] = useState(1);
  const [activeKey, setActiveKey] = useState("date");

  const done = tasks.filter((t) => t.completed).length;
  const total = Math.max(tasks.length, PLAN_ITEMS.length);

  const phaseItems = useMemo(
    () => PLAN_ITEMS.filter((item) => item.phase === phase),
    [phase],
  );

  const activeMeta =
    PLAN_ITEMS.find((i) => i.key === activeKey) ?? PLAN_ITEMS[0];
  const activeTask = taskForKey(tasks, activeMeta.key);

  useEffect(() => {
    if (!phaseItems.some((i) => i.key === activeKey) && phaseItems[0]) {
      setActiveKey(phaseItems[0].key);
    }
  }, [phase, phaseItems, activeKey]);

  const selected = useMemo(() => new Date(`${date}T12:00:00`), [date]);
  const year = selected.getFullYear();
  const month = selected.getMonth();
  const cells = useMemo(() => monthMatrix(year, month), [year, month]);
  const monthLabel = new Intl.DateTimeFormat("uk-UA", {
    month: "long",
    year: "numeric",
  }).format(selected);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr] xl:grid-cols-[340px_1fr]">
      {/* Sidebar */}
      <aside className="rounded-2xl border border-line bg-mist/80 p-4 md:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
              План по місяцях
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              22 цілі до вашого дня
            </p>
          </div>
          <p className="rounded-full bg-white px-3 py-1 text-sm font-medium text-sage-deep">
            {done}/{total}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {PLAN_PHASES.map((p) => {
            const phaseDone = PLAN_ITEMS.filter(
              (i) => i.phase === p.id && taskForKey(tasks, i.key)?.completed,
            ).length;
            const phaseTotal = PLAN_ITEMS.filter((i) => i.phase === p.id).length;
            const active = phase === p.id;
            const monthWindow = getPhaseWindowLabel(date, p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPhase(p.id);
                  const firstItem = PLAN_ITEMS.find((item) => item.phase === p.id);
                  if (firstItem) setActiveKey(firstItem.key);
                }}
                className={
                  active
                    ? "flex min-w-0 flex-col items-center rounded-xl bg-sage px-1 py-2.5 text-white"
                    : "flex min-w-0 flex-col items-center rounded-xl border border-line bg-white px-1 py-2.5 text-ink-soft hover:border-sage/40"
                }
              >
                <span className="flex size-6 items-center justify-center rounded-full border border-current text-xs font-semibold">
                  {p.id}
                </span>
                <span className="mt-1.5 text-[10px] font-semibold leading-tight">
                  {monthWindow}
                </span>
                <span className="mt-0.5 truncate text-[9px] leading-tight opacity-75">
                  {p.label}
                </span>
                <span
                  className={
                    active
                      ? "mt-1 text-[9px] text-white/75"
                      : "mt-1 text-[9px]"
                  }
                >
                  {phaseDone}/{phaseTotal}
                </span>
              </button>
            );
          })}
        </div>

        <ul className="mt-5 space-y-2">
          {phaseItems.map((item) => {
            const task = taskForKey(tasks, item.key);
            const selectedItem = activeKey === item.key;
            const completed = Boolean(task?.completed);
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => setActiveKey(item.key)}
                  className={
                    selectedItem
                      ? "flex w-full items-center gap-3 rounded-xl border border-sage/40 bg-white px-3 py-3 text-left shadow-sm"
                      : "flex w-full items-center gap-3 rounded-xl border border-transparent bg-white/70 px-3 py-3 text-left hover:border-line"
                  }
                >
                  <span
                    className={
                      completed
                        ? "flex size-5 shrink-0 items-center justify-center rounded-full bg-sage text-[10px] text-white"
                        : "size-5 shrink-0 rounded-full border border-line bg-paper"
                    }
                    aria-hidden
                  >
                    {completed ? "✓" : ""}
                  </span>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sage/10 text-sm">
                    {item.icon}
                  </span>
                  <span
                    className={
                      completed
                        ? "min-w-0 flex-1 text-sm text-ink-soft line-through"
                        : "min-w-0 flex-1 text-sm font-medium text-ink"
                    }
                  >
                    {item.title}
                  </span>
                  <span className="text-ink-soft">›</span>
                </button>
              </li>
            );
          })}
        </ul>

        {!wedding ? (
          <p className="mt-4 rounded-xl border border-dashed border-line bg-white px-3 py-3 text-xs text-ink-soft">
            Збережи дату справа — і чеклист заживе повністю.
          </p>
        ) : null}
      </aside>

      {/* Detail */}
      <section className="space-y-5">
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="bg-sage/10 px-5 py-6 md:px-8 md:py-8">
            <p className="text-sm uppercase tracking-[0.14em] text-sage-deep">
              Етап {activeMeta.phase} ·{" "}
              {getPhaseWindowLabel(date, activeMeta.phase)} до весілля
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink md:text-4xl">
              {activeMeta.title}
            </h3>
            {activeTask ? (
              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={activeTask.completed}
                  onChange={(e) =>
                    void onToggleTask(activeTask.id, e.target.checked)
                  }
                  className="size-4 accent-[var(--sage)]"
                />
                Позначити ціль виконаною
              </label>
            ) : null}
          </div>

          <div className="grid gap-6 px-5 py-6 md:grid-cols-[1.1fr_0.9fr] md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Що зробити
              </p>
              <ul className="mt-3 space-y-2">
                {activeMeta.thingsToDo.map((thing) => (
                  <li key={thing} className="flex gap-2 text-sm text-ink">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sage" />
                    {thing}
                  </li>
                ))}
              </ul>

              {activeMeta.href ? (
                <Link
                  href={activeMeta.href}
                  className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-line bg-mist px-5 py-4 transition hover:border-sage/40"
                >
                  <div>
                    <p className="font-medium text-ink">
                      {activeMeta.ctaLabel} →
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">
                      Перейти в сервіс NITKA
                    </p>
                  </div>
                  <span className="flex size-11 items-center justify-center rounded-xl bg-sage/15 text-lg">
                    {activeMeta.icon}
                  </span>
                </Link>
              ) : null}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Ідеї та поради
              </p>
              <div className="mt-3 space-y-3">
                {activeMeta.advice.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-2xl border border-line bg-paper px-4 py-4"
                  >
                    <h4 className="font-medium text-ink">{card.title}</h4>
                    <p className="mt-1 text-sm text-ink-soft">{card.blurb}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        {activeMeta.key === "date" ? (
          <div className="rounded-2xl border border-line bg-white p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="font-[family-name:var(--font-display)] text-2xl capitalize text-ink">
                {monthLabel}
              </h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const prev = new Date(year, month - 1, 1);
                    onDateChange(
                      `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}-01`,
                    );
                  }}
                  className="rounded-full border border-line px-3 py-1 text-sm text-ink-soft hover:border-sage/40"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = new Date(year, month + 1, 1);
                    onDateChange(
                      `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-01`,
                    );
                  }}
                  className="rounded-full border border-line px-3 py-1 text-sm text-ink-soft hover:border-sage/40"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink-soft">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, idx) => {
                if (!day) return <div key={`e-${idx}`} className="aspect-square" />;
                const isSelected = day === selected.getDate();
                return (
                  <button
                    key={`${year}-${month}-${day}`}
                    type="button"
                    onClick={() => onPickDay(day)}
                    className={
                      isSelected
                        ? "aspect-square rounded-xl bg-sage text-sm font-semibold text-white"
                        : "aspect-square rounded-xl text-sm text-ink transition hover:bg-mist"
                    }
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <form onSubmit={onSave} className="mt-5 space-y-3 border-t border-line pt-5">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <CityAutocomplete
                  required
                  value={city}
                  onChange={onCityChange}
                  placeholder="Місто"
                  className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
                />
                <input
                  type="number"
                  min={1}
                  required
                  value={guests}
                  onChange={(e) => onGuestsChange(Number(e.target.value))}
                  placeholder="Гостей"
                  className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
                />
                <input
                  type="number"
                  min={0}
                  required
                  value={budget}
                  onChange={(e) => onBudgetChange(Number(e.target.value))}
                  placeholder="Бюджет"
                  className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
                />
              </div>
              <p className="text-xs text-ink-soft">
                Зараз: {guests} гостей · бюджет {formatMoney(budget)} грн
              </p>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-sage px-4 py-3 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
              >
                {saving
                  ? "Зберігаємо..."
                  : wedding
                    ? "Оновити весілля"
                    : "Зберегти дату і відкрити план"}
              </button>
            </form>
          </div>
        ) : null}
      </section>
    </div>
  );
}
