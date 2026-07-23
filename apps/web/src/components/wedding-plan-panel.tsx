"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { CityAutocomplete } from "@/components/city-autocomplete";
import type { TaskStatus, Wedding, WeddingTask } from "@/lib/dashboard-api";
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
  onUpdateTask: (
    taskId: string,
    input: { status?: TaskStatus; dueDate?: string | null; title?: string },
  ) => Promise<void>;
  onCreateTask: (input: {
    title: string;
    categorySlug?: string;
    dueDate?: string;
  }) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
};

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

const STATUS_OPTIONS: Array<{ value: TaskStatus; label: string }> = [
  { value: "TODO", label: "Зробити" },
  { value: "IN_PROGRESS", label: "В процесі" },
  { value: "DONE", label: "Готово" },
];

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
  return tasks.find((t) => !t.isCustom && t.categorySlug === key);
}

function isDone(status?: TaskStatus) {
  return status === "DONE";
}

function dueDateValue(task?: WeddingTask | null) {
  return task?.dueDate ? task.dueDate.slice(0, 10) : "";
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
  onUpdateTask,
  onCreateTask,
  onDeleteTask,
}: Props) {
  const tasks = wedding?.tasks ?? [];
  const [phase, setPhase] = useState(1);
  const [activeKey, setActiveKey] = useState("date");
  const [customTitle, setCustomTitle] = useState("");
  const [customDue, setCustomDue] = useState("");
  const [adding, setAdding] = useState(false);

  const done = tasks.filter((t) => t.status === "DONE").length;
  const total = Math.max(tasks.length, PLAN_ITEMS.length);

  const phaseItems = useMemo(
    () => PLAN_ITEMS.filter((item) => item.phase === phase),
    [phase],
  );

  const customInPhase = useMemo(
    () =>
      tasks.filter(
        (t) =>
          t.isCustom &&
          (!t.categorySlug ||
            phaseItems.some((item) => item.key === t.categorySlug) ||
            t.categorySlug === `phase-${phase}`),
      ),
    [tasks, phaseItems, phase],
  );

  const activeMeta =
    PLAN_ITEMS.find((i) => i.key === activeKey) ?? PLAN_ITEMS[0];
  const activeTask = taskForKey(tasks, activeMeta.key);
  const activeCustom = tasks.find((t) => t.isCustom && t.id === activeKey);

  useEffect(() => {
    if (
      !phaseItems.some((i) => i.key === activeKey) &&
      !customInPhase.some((t) => t.id === activeKey) &&
      phaseItems[0]
    ) {
      setActiveKey(phaseItems[0].key);
    }
  }, [phase, phaseItems, activeKey, customInPhase]);

  const selected = useMemo(() => new Date(`${date}T12:00:00`), [date]);
  const year = selected.getFullYear();
  const month = selected.getMonth();
  const cells = useMemo(() => monthMatrix(year, month), [year, month]);
  const monthLabel = new Intl.DateTimeFormat("uk-UA", {
    month: "long",
    year: "numeric",
  }).format(selected);

  async function submitCustom(e: FormEvent) {
    e.preventDefault();
    if (!customTitle.trim() || !wedding) return;
    setAdding(true);
    try {
      await onCreateTask({
        title: customTitle.trim(),
        categorySlug: `phase-${phase}`,
        dueDate: customDue || undefined,
      });
      setCustomTitle("");
      setCustomDue("");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr] xl:grid-cols-[340px_1fr]">
      <aside className="rounded-2xl border border-line bg-mist/80 p-4 md:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
              План по місяцях
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Цілі до вашого дня + свої задачі
            </p>
          </div>
          <p className="rounded-full bg-white px-3 py-1 text-sm font-medium text-sage-deep">
            {done}/{total}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {PLAN_PHASES.map((p) => {
            const phaseDone = PLAN_ITEMS.filter(
              (i) =>
                i.phase === p.id &&
                isDone(taskForKey(tasks, i.key)?.status),
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
                  const firstItem = PLAN_ITEMS.find(
                    (item) => item.phase === p.id,
                  );
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
            const completed = isDone(task?.status);
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
                        : task?.status === "IN_PROGRESS"
                          ? "flex size-5 shrink-0 items-center justify-center rounded-full border border-sage bg-sage/15 text-[9px] text-sage-deep"
                          : "size-5 shrink-0 rounded-full border border-line bg-paper"
                    }
                    aria-hidden
                  >
                    {completed ? "✓" : task?.status === "IN_PROGRESS" ? "…" : ""}
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

          {customInPhase.map((task) => {
            const selectedItem = activeKey === task.id;
            const completed = isDone(task.status);
            return (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => setActiveKey(task.id)}
                  className={
                    selectedItem
                      ? "flex w-full items-center gap-3 rounded-xl border border-sage/40 bg-white px-3 py-3 text-left shadow-sm"
                      : "flex w-full items-center gap-3 rounded-xl border border-dashed border-line bg-white/70 px-3 py-3 text-left hover:border-sage/40"
                  }
                >
                  <span
                    className={
                      completed
                        ? "flex size-5 shrink-0 items-center justify-center rounded-full bg-sage text-[10px] text-white"
                        : "size-5 shrink-0 rounded-full border border-line bg-paper"
                    }
                  >
                    {completed ? "✓" : ""}
                  </span>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-sm">
                    ✎
                  </span>
                  <span
                    className={
                      completed
                        ? "min-w-0 flex-1 text-sm text-ink-soft line-through"
                        : "min-w-0 flex-1 text-sm font-medium text-ink"
                    }
                  >
                    {task.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {wedding ? (
          <form onSubmit={submitCustom} className="mt-4 space-y-2 border-t border-line pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
              Своя задача
            </p>
            <input
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Наприклад: бронювати трансфер"
              className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-sage"
              required
              minLength={2}
            />
            <input
              type="date"
              value={customDue}
              onChange={(e) => setCustomDue(e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-sage"
            />
            <button
              type="submit"
              disabled={adding || !customTitle.trim()}
              className="w-full rounded-full bg-ink px-3 py-2.5 text-sm font-semibold text-white hover:bg-ink/90 disabled:opacity-60"
            >
              {adding ? "Додаємо…" : "Додати задачу"}
            </button>
          </form>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-line bg-white px-3 py-3 text-xs text-ink-soft">
            Збережи дату справа — і чеклист заживе повністю.
          </p>
        )}
      </aside>

      <section className="space-y-5">
        {activeCustom ? (
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="bg-sage/10 px-5 py-6 md:px-8 md:py-8">
              <p className="text-sm uppercase tracking-[0.14em] text-sage-deep">
                Ваша задача · етап {phase}
              </p>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-ink md:text-4xl">
                {activeCustom.title}
              </h3>
              <TaskControls
                task={activeCustom}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            </div>
          </div>
        ) : (
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
                <TaskControls task={activeTask} onUpdateTask={onUpdateTask} />
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
                        Відкрити інструмент NITKA
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
        )}

        {activeMeta.key === "date" && !activeCustom ? (
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

function TaskControls({
  task,
  onUpdateTask,
  onDeleteTask,
}: {
  task: WeddingTask;
  onUpdateTask: Props["onUpdateTask"];
  onDeleteTask?: Props["onDeleteTask"];
}) {
  return (
    <div className="mt-5 flex flex-wrap items-end gap-3">
      <div>
        <p className="mb-1.5 text-xs font-medium text-ink-soft">Статус</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => {
            const active = task.status === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  void onUpdateTask(task.id, { status: option.value })
                }
                className={
                  active
                    ? "rounded-full bg-sage px-3 py-1.5 text-xs font-semibold text-white"
                    : "rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-sage/40"
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-ink-soft">
          Дедлайн
        </span>
        <input
          type="date"
          value={dueDateValue(task)}
          onChange={(e) =>
            void onUpdateTask(task.id, {
              dueDate: e.target.value || null,
            })
          }
          className="rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-sage"
        />
      </label>
      {task.isCustom && onDeleteTask ? (
        <button
          type="button"
          onClick={() => void onDeleteTask(task.id)}
          className="rounded-full border border-line px-3 py-2 text-xs font-medium text-ink-soft hover:border-red-300 hover:text-red-700"
        >
          Видалити
        </button>
      ) : null}
    </div>
  );
}
