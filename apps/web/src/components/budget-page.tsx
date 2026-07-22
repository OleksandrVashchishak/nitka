"use client";

import { PageLoader } from "@/components/ui-loader";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  BUDGET_CATEGORIES,
  categoryLabel,
  createBudgetItem,
  deleteBudgetItem,
  getBudget,
  updateBudgetItem,
  updateBudgetPlan,
  type BudgetItem,
  type BudgetResponse,
} from "@/lib/budget-api";
import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/require-auth";

function formatMoney(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}

const emptyItem = {
  category: "other",
  title: "",
  estimated: 0,
  actual: 0,
  paid: false,
  notes: "",
};

function BudgetInner() {
  const [data, setData] = useState<BudgetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needWedding, setNeedWedding] = useState(false);
  const [plan, setPlan] = useState(300000);
  const [savingPlan, setSavingPlan] = useState(false);
  const [form, setForm] = useState(emptyItem);
  const [editForm, setEditForm] = useState(emptyItem);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingItem, setSavingItem] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    setNeedWedding(false);
    try {
      const res = await getBudget();
      setData(res);
      setPlan(res.wedding.budget);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Помилка";
      if (message.toLowerCase().includes("весілля")) {
        setNeedWedding(true);
      }
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSavePlan(e: FormEvent) {
    e.preventDefault();
    setSavingPlan(true);
    setError(null);
    try {
      const res = await updateBudgetPlan(plan);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не збережено план");
    } finally {
      setSavingPlan(false);
    }
  }

  function startEdit(item: BudgetItem) {
    setEditingId(item.id);
    setEditForm({
      category: item.category,
      title: item.title,
      estimated: item.estimated,
      actual: item.actual,
      paid: item.paid,
      notes: item.notes ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyItem);
  }

  async function onAddItem(e: FormEvent) {
    e.preventDefault();
    setSavingItem(true);
    setError(null);
    try {
      const res = await createBudgetItem({
        category: form.category,
        title: form.title,
        estimated: form.estimated,
        actual: form.actual,
        paid: form.paid,
        notes: form.notes || undefined,
      });
      setData(res);
      setForm(emptyItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не збережено статтю");
    } finally {
      setSavingItem(false);
    }
  }

  async function onSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setSavingEdit(true);
    setError(null);
    try {
      const res = await updateBudgetItem(editingId, {
        category: editForm.category,
        title: editForm.title,
        estimated: editForm.estimated,
        actual: editForm.actual,
        paid: editForm.paid,
        notes: editForm.notes || undefined,
      });
      setData(res);
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено статтю");
    } finally {
      setSavingEdit(false);
    }
  }

  async function onDelete(id: string) {
    setError(null);
    try {
      const res = await deleteBudgetItem(id);
      setData(res);
      if (editingId === id) cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не видалено");
    }
  }

  async function onTogglePaid(item: BudgetItem) {
    try {
      const res = await updateBudgetItem(item.id, { paid: !item.paid });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  if (loading) {
    return <PageLoader label="Завантажуємо бюджет…" />;
  }

  if (needWedding) {
    return (
      <>
        <DashboardNav variant="COUPLE" />
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
          Бюджет
        </h1>
        <div className="mt-6 rounded-2xl border border-line bg-mist px-6 py-10">
          <p className="text-ink-soft">
            Спочатку створи весілля з загальним бюджетом у кабінеті.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep"
          >
            До кабінету
          </Link>
        </div>
      </>
    );
  }

  const summary = data?.summary;

  return (
    <>
      <DashboardNav variant="COUPLE" />
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
        Бюджет
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Заплановано vs витрачено по категоріях. Базовий розклад створюється
        автоматично від загального бюджету весілля.
      </p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {summary ? (
        <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-sage-deep text-white">
          <div className="p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.14em] text-white/65">
              Загальний план
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-4xl md:text-5xl">
              {formatMoney(summary.totalBudget)} грн
            </p>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${summary.progress}%` }}
              />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-white/10 px-4 py-3">
                <p className="text-xs text-white/65">Розписано</p>
                <p className="mt-1 text-lg">{formatMoney(summary.estimated)} грн</p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3">
                <p className="text-xs text-white/65">Витрачено</p>
                <p className="mt-1 text-lg">{formatMoney(summary.actual)} грн</p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3">
                <p className="text-xs text-white/65">Сплачено</p>
                <p className="mt-1 text-lg">{formatMoney(summary.paid)} грн</p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3">
                <p className="text-xs text-white/65">Залишок</p>
                <p className="mt-1 text-lg">
                  {formatMoney(summary.remaining)} грн
                </p>
              </div>
            </div>
            {summary.estimatedDiff !== 0 ? (
              <p className="mt-4 text-sm text-white/75">
                {summary.estimatedDiff > 0
                  ? `Ще не розписано ${formatMoney(summary.estimatedDiff)} грн у статтях.`
                  : `Статті перевищують план на ${formatMoney(Math.abs(summary.estimatedDiff))} грн.`}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <form
        onSubmit={onSavePlan}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-white p-5"
      >
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-sm text-ink-soft">
            Оновити загальний бюджет
          </label>
          <input
            type="number"
            min={0}
            required
            value={plan}
            onChange={(e) => setPlan(Number(e.target.value))}
            className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
        </div>
        <button
          type="submit"
          disabled={savingPlan}
          className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
        >
          {savingPlan ? "Зберігаємо..." : "Зберегти план"}
        </button>
      </form>

      <form
        onSubmit={onAddItem}
        className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-5 md:p-6"
      >
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
          Додати статтю
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">Категорія</span>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            >
              {BUDGET_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">Назва</span>
            <input
              required
              minLength={2}
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Напр. Фотограф"
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">
              Заплановано, грн
            </span>
            <input
              type="number"
              min={0}
              required
              value={form.estimated}
              onChange={(e) =>
                setForm((f) => ({ ...f, estimated: Number(e.target.value) }))
              }
              placeholder="Скільки плануєш витратити"
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">
              Витрачено, грн
            </span>
            <input
              type="number"
              min={0}
              required
              value={form.actual}
              onChange={(e) =>
                setForm((f) => ({ ...f, actual: Number(e.target.value) }))
              }
              placeholder="Скільки вже витрачено"
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          </label>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">Нотатки</span>
            <input
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="Підрядник, коментар…"
              className="w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
          </label>
          <label className="mt-auto flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.paid}
              onChange={(e) =>
                setForm((f) => ({ ...f, paid: e.target.checked }))
              }
              className="size-4 accent-[var(--sage)]"
            />
            Сплачено
          </label>
        </div>
        <button
          type="submit"
          disabled={savingItem}
          className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
        >
          {savingItem ? "Зберігаємо..." : "Додати статтю"}
        </button>
      </form>

      <div className="mt-8 space-y-6">
        {data?.categories.map((group) => (
          <section
            key={group.category}
            className="rounded-2xl border border-line bg-mist p-5 md:p-6"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
                {categoryLabel(group.category)}
              </h2>
              <p className="text-sm text-ink-soft">
                заплановано {formatMoney(group.estimated)} · витрачено{" "}
                {formatMoney(group.actual)} грн
              </p>
            </div>
            <ul className="mt-4 space-y-3">
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-line bg-white p-4"
                >
                  {editingId === item.id ? (
                    <form onSubmit={onSaveEdit} className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-1 block text-xs text-ink-soft">
                            Категорія
                          </span>
                          <select
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                category: e.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-sage"
                          >
                            {BUDGET_CATEGORIES.map((c) => (
                              <option key={c.value} value={c.value}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-xs text-ink-soft">
                            Назва
                          </span>
                          <input
                            required
                            minLength={2}
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Назва"
                            className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-sage"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-xs text-ink-soft">
                            Заплановано, грн
                          </span>
                          <input
                            type="number"
                            min={0}
                            required
                            value={editForm.estimated}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                estimated: Number(e.target.value),
                              }))
                            }
                            className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-sage"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-xs text-ink-soft">
                            Витрачено, грн
                          </span>
                          <input
                            type="number"
                            min={0}
                            required
                            value={editForm.actual}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                actual: Number(e.target.value),
                              }))
                            }
                            className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-sage"
                          />
                        </label>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                        <label className="block">
                          <span className="mb-1 block text-xs text-ink-soft">
                            Нотатки
                          </span>
                          <input
                            value={editForm.notes}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                notes: e.target.value,
                              }))
                            }
                            placeholder="Підрядник, коментар…"
                            className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-sage"
                          />
                        </label>
                        <label className="mt-auto flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-sm text-ink">
                          <input
                            type="checkbox"
                            checked={editForm.paid}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                paid: e.target.checked,
                              }))
                            }
                            className="size-4 accent-[var(--sage)]"
                          />
                          Сплачено
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="submit"
                          disabled={savingEdit}
                          className="rounded-full bg-sage px-4 py-2 text-xs font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
                        >
                          {savingEdit ? "Зберігаємо..." : "Зберегти"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-full border border-line px-4 py-2 text-xs text-ink-soft hover:border-sage/40"
                        >
                          Скасувати
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">{item.title}</p>
                        <p className="mt-1 text-sm text-ink-soft">
                          Заплановано {formatMoney(item.estimated)} · витрачено{" "}
                          {formatMoney(item.actual)} грн
                          {item.paid ? " · сплачено" : ""}
                        </p>
                        {item.notes ? (
                          <p className="mt-1 text-sm text-ink-soft">
                            {item.notes}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void onTogglePaid(item)}
                          className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-sage/40"
                        >
                          {item.paid ? "Не сплачено" : "Позначити сплачено"}
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="rounded-full border border-line px-3 py-1.5 text-xs text-ink hover:border-sage/40"
                        >
                          Змінити
                        </button>
                        <button
                          type="button"
                          onClick={() => void onDelete(item.id)}
                          className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-red-300"
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

export function BudgetPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <BudgetInner />
        </div>
      </section>
    </RequireAuth>
  );
}
