"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageLoader } from "@/components/ui-loader";
import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/require-auth";
import {
  createTask,
  deleteTask,
  getMyWedding,
  updateTask,
  type TaskStatus,
  type Wedding,
  type WeddingTask,
} from "@/lib/dashboard-api";
import {
  formatDayMonthUk,
  formatMonthYearUk,
  hrefForPlanKey,
  monthKeyFromIso,
  planCategoryLabel,
  suggestedDueDateForPlanItem,
} from "@/lib/wedding-plan";
import { toast } from "@/lib/toast";

type StatusFilter = "open" | "done" | "all";
type MonthFilter = "all" | "after" | string;

type ChecklistRow = WeddingTask & {
  effectiveDue: string | null;
  monthKey: string | null;
};

function effectiveDueFor(
  task: WeddingTask,
  weddingDate: string,
): string | null {
  if (task.dueDate) return task.dueDate.slice(0, 10);
  return suggestedDueDateForPlanItem(
    weddingDate,
    task.categorySlug,
    task.sortOrder,
  );
}

function ChecklistInner() {
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("open");
  const [monthFilter, setMonthFilter] = useState<MonthFilter>("all");
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setWedding(await getMyWedding());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка завантаження");
      setWedding(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const weddingDate = wedding?.date?.slice(0, 10) ?? "";

  const rows: ChecklistRow[] = useMemo(() => {
    if (!wedding) return [];
    return [...wedding.tasks]
      .map((task) => {
        const effectiveDue = effectiveDueFor(task, wedding.date);
        return {
          ...task,
          effectiveDue,
          monthKey: effectiveDue ? monthKeyFromIso(effectiveDue) : null,
        };
      })
      .sort((a, b) => {
        const aDone = a.status === "DONE" ? 1 : 0;
        const bDone = b.status === "DONE" ? 1 : 0;
        if (aDone !== bDone) return aDone - bDone;
        const aDue = a.effectiveDue ?? "9999-99-99";
        const bDue = b.effectiveDue ?? "9999-99-99";
        if (aDue !== bDue) return aDue.localeCompare(bDue);
        return a.sortOrder - b.sortOrder;
      });
  }, [wedding]);

  const weddingMonth = weddingDate ? monthKeyFromIso(weddingDate) : null;

  const monthBuckets = useMemo(() => {
    const map = new Map<string, number>();
    let after = 0;
    for (const row of rows) {
      if (statusFilter === "open" && row.status === "DONE") continue;
      if (statusFilter === "done" && row.status !== "DONE") continue;
      if (!row.monthKey || !row.effectiveDue) {
        after += 1;
        continue;
      }
      if (weddingDate && row.effectiveDue > weddingDate) {
        after += 1;
        continue;
      }
      map.set(row.monthKey, (map.get(row.monthKey) ?? 0) + 1);
    }
    const months = [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, count]) => ({ key, count }));
    return { months, after };
  }, [rows, statusFilter, weddingDate]);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (statusFilter === "open" && row.status === "DONE") return false;
      if (statusFilter === "done" && row.status !== "DONE") return false;

      if (monthFilter === "all") return true;
      if (monthFilter === "after") {
        if (!row.effectiveDue) return true;
        return Boolean(weddingDate && row.effectiveDue > weddingDate);
      }
      return row.monthKey === monthFilter;
    });
  }, [rows, statusFilter, monthFilter, weddingDate]);

  const grouped = useMemo(() => {
    const groups = new Map<string, ChecklistRow[]>();
    for (const row of filtered) {
      let key = "Без дати";
      if (row.effectiveDue && weddingDate && row.effectiveDue > weddingDate) {
        key = "Після весілля";
      } else if (row.monthKey) {
        key = formatMonthYearUk(row.monthKey);
      }
      const list = groups.get(key) ?? [];
      list.push(row);
      groups.set(key, list);
    }
    return [...groups.entries()];
  }, [filtered, weddingDate]);

  const doneCount = rows.filter((r) => r.status === "DONE").length;
  const totalCount = rows.length;
  const openCount = totalCount - doneCount;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  function patchLocal(taskId: string, patch: Partial<WeddingTask>) {
    setWedding((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.map((t) =>
              t.id === taskId ? { ...t, ...patch } : t,
            ),
          }
        : prev,
    );
  }

  async function onToggle(task: ChecklistRow) {
    const next: TaskStatus = task.status === "DONE" ? "TODO" : "DONE";
    patchLocal(task.id, { status: next });
    try {
      await updateTask(task.id, { status: next });
    } catch (err) {
      patchLocal(task.id, { status: task.status });
      toast.error(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  async function onSetDue(task: ChecklistRow, value: string) {
    const dueDate = value || null;
    patchLocal(task.id, { dueDate });
    try {
      await updateTask(task.id, { dueDate });
    } catch (err) {
      patchLocal(task.id, { dueDate: task.dueDate });
      toast.error(err instanceof Error ? err.message : "Дату не збережено");
    }
  }

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title || !wedding) return;
    setAdding(true);
    try {
      const due =
        monthFilter !== "all" && monthFilter !== "after"
          ? `${monthFilter}-15`
          : weddingDate
            ? suggestedDueDateForPlanItem(wedding.date, "phase-1", totalCount)
            : undefined;
      const created = await createTask({
        title,
        dueDate: due || undefined,
        categorySlug: "phase-1",
      });
      setWedding((prev) =>
        prev ? { ...prev, tasks: [...prev.tasks, created] } : prev,
      );
      setNewTitle("");
      toast.success("Додано", title);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не додано");
    } finally {
      setAdding(false);
    }
  }

  async function onDelete(task: ChecklistRow) {
    if (!task.isCustom) return;
    if (!confirm(`Видалити задачу «${task.title}»?`)) return;
    try {
      await deleteTask(task.id);
      setWedding((prev) =>
        prev
          ? { ...prev, tasks: prev.tasks.filter((t) => t.id !== task.id) }
          : prev,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не видалено");
    }
  }

  if (loading) {
    return <PageLoader label="Завантажуємо чекліст…" />;
  }

  if (!wedding) {
    return (
      <>
        <DashboardNav variant="COUPLE" />
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
          Чекліст
        </h1>
        <div className="mt-6 rounded-2xl border border-line bg-mist px-6 py-10">
          <p className="text-ink-soft">
            Спочатку збережи дату й місто весілля в огляді — тоді зʼявиться
            чекліст по місяцях.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep"
          >
            До огляду
          </Link>
        </div>
        {error ? (
          <p className="mt-4 text-sm text-red-700">{error}</p>
        ) : null}
      </>
    );
  }

  return (
    <>
      <DashboardNav variant="COUPLE" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            Чекліст
          </h1>
          <p className="mt-2 text-ink-soft">
            Виконано{" "}
            <span className="font-semibold text-ink">
              {doneCount} з {totalCount}
            </span>{" "}
            задач
          </p>
        </div>
        <div className="min-w-[200px] flex-1 sm:max-w-xs">
          <div className="h-2 overflow-hidden rounded-full bg-mist">
            <div
              className="h-full rounded-full bg-sage transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs text-ink-soft">{progress}%</p>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="space-y-8 lg:sticky lg:top-6 lg:self-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Статус
            </p>
            <div className="mt-3 space-y-1">
              {(
                [
                  { id: "open" as const, label: "Зробити", count: openCount },
                  { id: "done" as const, label: "Готово", count: doneCount },
                  { id: "all" as const, label: "Усі", count: totalCount },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatusFilter(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                    statusFilter === item.id
                      ? "bg-sage/15 font-semibold text-sage-deep"
                      : "text-ink-soft hover:bg-mist hover:text-ink"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="tabular-nums">{item.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
              За датою
            </p>
            <div className="relative mt-3 space-y-0 pl-3">
              <div
                className="absolute bottom-3 left-[18px] top-3 w-px bg-line"
                aria-hidden
              />
              <button
                type="button"
                onClick={() => setMonthFilter("all")}
                className={`relative flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm transition ${
                  monthFilter === "all"
                    ? "font-semibold text-sage-deep"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <span
                  className={`relative z-10 size-2.5 shrink-0 rounded-full ${
                    monthFilter === "all" ? "bg-sage" : "bg-line"
                  }`}
                />
                <span className="flex-1">Усі місяці</span>
              </button>
              {monthBuckets.months.map((month) => (
                <button
                  key={month.key}
                  type="button"
                  onClick={() => setMonthFilter(month.key)}
                  className={`relative flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm transition ${
                    monthFilter === month.key
                      ? "font-semibold text-sage-deep"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <span
                    className={`relative z-10 size-2.5 shrink-0 rounded-full ${
                      monthFilter === month.key
                        ? "bg-sage"
                        : month.key === weddingMonth
                          ? "bg-sage/50"
                          : "bg-line"
                    }`}
                  />
                  <span className="flex-1">{formatMonthYearUk(month.key)}</span>
                  <span className="tabular-nums text-xs">{month.count}</span>
                </button>
              ))}
              {monthBuckets.after > 0 ? (
                <button
                  type="button"
                  onClick={() => setMonthFilter("after")}
                  className={`relative flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm transition ${
                    monthFilter === "after"
                      ? "font-semibold text-sage-deep"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <span
                    className={`relative z-10 size-2.5 shrink-0 rounded-full ${
                      monthFilter === "after" ? "bg-sage" : "bg-line"
                    }`}
                  />
                  <span className="flex-1">Після весілля</span>
                  <span className="tabular-nums text-xs">
                    {monthBuckets.after}
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <form
            onSubmit={onAdd}
            className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3"
          >
            <span className="flex size-8 items-center justify-center rounded-full border border-dashed border-sage/50 text-lg text-sage-deep">
              +
            </span>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Додати нову задачу"
              className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-soft"
            />
            <button
              type="submit"
              disabled={adding || !newTitle.trim()}
              className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-50"
            >
              {adding ? "…" : "Додати"}
            </button>
          </form>

          {grouped.length === 0 ? (
            <p className="mt-10 text-center text-ink-soft">
              Немає задач у цьому фільтрі.
            </p>
          ) : (
            <div className="mt-8 space-y-10">
              {grouped.map(([label, tasks]) => (
                <section key={label}>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">
                    {label}
                  </h2>
                  <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
                    {tasks.map((task) => {
                      const done = task.status === "DONE";
                      const href = hrefForPlanKey(task.categorySlug ?? "");
                      return (
                        <li
                          key={task.id}
                          className="flex flex-wrap items-start gap-3 px-4 py-4 md:flex-nowrap md:items-center md:gap-4 md:px-5"
                        >
                          <button
                            type="button"
                            onClick={() => void onToggle(task)}
                            aria-label={done ? "Повернути в роботу" : "Готово"}
                            className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                              done
                                ? "border-sage bg-sage text-white"
                                : "border-line hover:border-sage"
                            }`}
                          >
                            {done ? (
                              <svg
                                viewBox="0 0 16 16"
                                className="size-3.5"
                                aria-hidden
                              >
                                <path
                                  fill="currentColor"
                                  d="M6.2 11.4 2.8 8l1.1-1.1 2.3 2.3 5-5L12.3 5z"
                                />
                              </svg>
                            ) : null}
                          </button>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`font-medium text-ink ${
                                done ? "text-ink-soft line-through" : ""
                              }`}
                            >
                              {task.title}
                            </p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                              {task.effectiveDue ? (
                                <span>{formatDayMonthUk(task.effectiveDue)}</span>
                              ) : (
                                <span>Без дати</span>
                              )}
                              <input
                                type="date"
                                value={task.dueDate?.slice(0, 10) ?? task.effectiveDue ?? ""}
                                onChange={(e) =>
                                  void onSetDue(task, e.target.value)
                                }
                                title="Змінити дату"
                                className="max-w-[9.5rem] rounded-md border border-line bg-mist/50 px-1.5 py-0.5 text-[11px] outline-none focus:border-sage"
                              />
                              <span className="rounded-full bg-mist px-2.5 py-0.5 text-[11px] font-medium text-ink-soft">
                                {planCategoryLabel(task.categorySlug)}
                              </span>
                              {task.status === "IN_PROGRESS" ? (
                                <span className="rounded-full bg-sage/15 px-2.5 py-0.5 text-[11px] font-medium text-sage-deep">
                                  В процесі
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
                            {href ? (
                              <Link
                                href={href}
                                className="text-sm font-medium text-sage-deep hover:underline"
                              >
                                Відкрити
                              </Link>
                            ) : null}
                            {task.isCustom ? (
                              <button
                                type="button"
                                onClick={() => void onDelete(task)}
                                className="text-sm text-ink-soft hover:text-red-700"
                              >
                                Видалити
                              </button>
                            ) : null}
                            {!done ? (
                              <button
                                type="button"
                                onClick={() => {
                                  void (async () => {
                                    try {
                                      const updated = await updateTask(task.id, {
                                        status: "IN_PROGRESS",
                                      });
                                      patchLocal(task.id, updated);
                                    } catch (err) {
                                      toast.error(
                                        err instanceof Error
                                          ? err.message
                                          : "Не оновлено",
                                      );
                                    }
                                  })();
                                }}
                                className="text-sm text-ink-soft hover:text-ink"
                              >
                                В процесі
                              </button>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function CoupleChecklistPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <ChecklistInner />
        </div>
      </section>
    </RequireAuth>
  );
}
