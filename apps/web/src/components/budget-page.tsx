"use client";

import { PageLoader } from "@/components/ui-loader";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
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

function paidAmount(item: BudgetItem) {
  return item.paid ? item.actual : 0;
}

function BudgetInner() {
  const [data, setData] = useState<BudgetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needWedding, setNeedWedding] = useState(false);
  const [plan, setPlan] = useState(300000);
  const [savingPlan, setSavingPlan] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mode, setMode] = useState<"budget" | "payments">("budget");
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newEstimated, setNewEstimated] = useState(0);
  const [savingItem, setSavingItem] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({
    title: "",
    estimated: 0,
    actual: 0,
  });
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategorySlug, setNewCategorySlug] = useState("other");

  async function load() {
    setLoading(true);
    setError(null);
    setNeedWedding(false);
    try {
      const res = await getBudget();
      setData(res);
      setPlan(res.wedding.budget);
      setSelectedCategory((prev) => {
        if (prev && res.categories.some((c) => c.category === prev)) return prev;
        return res.categories[0]?.category ?? null;
      });
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

  const categories = useMemo(() => {
    if (!data) return [];
    return data.categories.map((group) => ({
      ...group,
      paid: group.items.reduce((sum, item) => sum + paidAmount(item), 0),
      label: categoryLabel(group.category),
    }));
  }, [data]);

  const active = categories.find((c) => c.category === selectedCategory) ?? null;
  const activeItems = useMemo(() => {
    if (!active) return [];
    if (mode === "payments") return active.items.filter((item) => item.paid);
    return active.items;
  }, [active, mode]);

  const unusedCategories = BUDGET_CATEGORIES.filter(
    (c) => !categories.some((g) => g.category === c.value),
  );

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

  async function onAddExpense(e: FormEvent) {
    e.preventDefault();
    if (!selectedCategory || !newTitle.trim()) return;
    setSavingItem(true);
    setError(null);
    try {
      const res = await createBudgetItem({
        category: selectedCategory,
        title: newTitle.trim(),
        estimated: newEstimated,
        actual: 0,
        paid: false,
      });
      setData(res);
      setNewTitle("");
      setNewEstimated(0);
      setAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не додано витрату");
    } finally {
      setSavingItem(false);
    }
  }

  async function onCreateCategory(e: FormEvent) {
    e.preventDefault();
    setSavingItem(true);
    setError(null);
    try {
      const res = await createBudgetItem({
        category: newCategorySlug,
        title: categoryLabel(newCategorySlug),
        estimated: 0,
        actual: 0,
        paid: false,
      });
      setData(res);
      setSelectedCategory(newCategorySlug);
      setShowNewCategory(false);
      setAdding(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не створено категорію");
    } finally {
      setSavingItem(false);
    }
  }

  function startEdit(item: BudgetItem) {
    setEditingId(item.id);
    setEditDraft({
      title: item.title,
      estimated: item.estimated,
      actual: item.actual,
    });
    setMenuOpenId(null);
  }

  async function saveEdit(itemId: string) {
    setError(null);
    try {
      const res = await updateBudgetItem(itemId, {
        title: editDraft.title.trim(),
        estimated: editDraft.estimated,
        actual: editDraft.actual,
      });
      setData(res);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  async function onTogglePaid(item: BudgetItem) {
    setMenuOpenId(null);
    try {
      const res = await updateBudgetItem(item.id, { paid: !item.paid });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  async function onDelete(id: string) {
    const item = data?.items.find((row) => row.id === id);
    if (!confirm(`Видалити «${item?.title ?? "витрату"}»?`)) return;
    setMenuOpenId(null);
    setError(null);
    try {
      const res = await deleteBudgetItem(id);
      setData(res);
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не видалено");
    }
  }

  async function onRemoveCategory() {
    if (!active) return;
    if (
      !confirm(
        `Видалити категорію «${active.label}» і всі ${active.items.length} витрати?`,
      )
    ) {
      return;
    }
    setError(null);
    try {
      let res: BudgetResponse | null = null;
      for (const item of active.items) {
        res = await deleteBudgetItem(item.id);
      }
      if (res) {
        setData(res);
        setSelectedCategory(res.categories[0]?.category ?? null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не видалено категорію");
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
        <div className="mt-6 border border-line bg-mist px-6 py-10">
          <p className="text-ink-soft">
            Спочатку створи весілля з загальним бюджетом у кабінеті.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep"
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

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            Бюджет
          </h1>
          <p className="mt-2 max-w-xl text-ink-soft">
            Категорії зліва, витрати справа — як у нормальному кошторисі, без
            каші.
          </p>
        </div>
        {summary ? (
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
              Загальний план
            </p>
            <p className="font-[family-name:var(--font-display)] text-3xl text-ink">
              {formatMoney(summary.totalBudget)} грн
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              витрачено {formatMoney(summary.actual)} · залишок{" "}
              {formatMoney(summary.remaining)}
            </p>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={onSavePlan}
        className="mt-6 flex flex-wrap items-end gap-3 border border-line bg-white p-4"
      >
        <label className="min-w-[200px] flex-1">
          <span className="mb-1 block text-sm text-ink-soft">
            Загальний бюджет, грн
          </span>
          <input
            type="number"
            min={0}
            required
            value={plan}
            onChange={(e) => setPlan(Number(e.target.value))}
            className="w-full border border-line px-4 py-2.5 outline-none focus:border-sage"
          />
        </label>
        <button
          type="submit"
          disabled={savingPlan}
          className="bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
        >
          {savingPlan ? "Зберігаємо…" : "Оновити план"}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div className="inline-flex border border-line bg-white p-1">
          <button
            type="button"
            onClick={() => setMode("budget")}
            className={`px-4 py-2 text-sm font-medium transition ${
              mode === "budget"
                ? "bg-sage text-white"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            Бюджет
          </button>
          <button
            type="button"
            onClick={() => setMode("payments")}
            className={`px-4 py-2 text-sm font-medium transition ${
              mode === "payments"
                ? "bg-sage text-white"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            Платежі
          </button>
        </div>
        {summary ? (
          <div className="h-2 w-full max-w-xs overflow-hidden bg-mist sm:w-48">
            <div
              className="h-full bg-sage transition-all"
              style={{ width: `${summary.progress}%` }}
            />
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-0 border border-line bg-white lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-line lg:border-b-0 lg:border-r">
          <div className="border-b border-line p-3">
            {showNewCategory ? (
              <form onSubmit={onCreateCategory} className="space-y-2">
                <select
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-sage"
                >
                  {(unusedCategories.length
                    ? unusedCategories
                    : BUDGET_CATEGORIES
                  ).map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={savingItem}
                    className="flex-1 bg-sage px-3 py-2 text-xs font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
                  >
                    Додати
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(false)}
                    className="px-3 py-2 text-xs text-ink-soft"
                  >
                    Скасувати
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="flex w-full items-center gap-2 px-2 py-2 text-left text-sm font-medium text-sage hover:bg-mist"
              >
                <span className="text-lg leading-none">+</span>
                Нова категорія
              </button>
            )}
          </div>

          <nav className="max-h-[70vh] overflow-y-auto">
            {categories.map((group) => {
              const selected = group.category === selectedCategory;
              const amount =
                mode === "payments" ? group.paid : group.estimated;
              return (
                <button
                  key={group.category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(group.category);
                    setAdding(false);
                    setEditingId(null);
                    setMenuOpenId(null);
                  }}
                  className={`flex w-full items-center justify-between gap-3 border-b border-line px-4 py-3 text-left transition ${
                    selected
                      ? "bg-mist"
                      : "bg-white hover:bg-paper"
                  }`}
                >
                  <span
                    className={`text-sm ${selected ? "font-semibold text-ink" : "text-ink-soft"}`}
                  >
                    {group.label}
                  </span>
                  <span className="shrink-0 text-sm tabular-nums text-ink">
                    {formatMoney(amount)} ₴
                  </span>
                </button>
              );
            })}
            {categories.length === 0 ? (
              <p className="px-4 py-8 text-sm text-ink-soft">
                Поки немає категорій. Додай першу.
              </p>
            ) : null}
          </nav>
        </aside>

        <section className="min-h-[420px] p-4 md:p-6">
          {!active ? (
            <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-ink-soft">
              Обери категорію зліва
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-3xl text-ink">
                    {active.label}
                  </h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    Заплановано: {formatMoney(active.estimated)} ₴ · Фінально:{" "}
                    {formatMoney(active.actual)} ₴ · Сплачено:{" "}
                    {formatMoney(active.paid)} ₴
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void onRemoveCategory()}
                  className="text-sm text-ink-soft underline-offset-2 hover:text-ink hover:underline"
                >
                  Видалити
                </button>
              </div>

              <div className="mt-4 h-2 overflow-hidden bg-mist">
                <div
                  className="h-full bg-sage transition-all"
                  style={{
                    width: `${
                      active.estimated > 0
                        ? Math.min(
                            100,
                            Math.round((active.actual / active.estimated) * 100),
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs uppercase tracking-[0.12em] text-ink-soft">
                      <th className="pb-3 pr-3 font-medium">Витрата</th>
                      <th className="pb-3 pr-3 font-medium">Заплановано</th>
                      <th className="pb-3 pr-3 font-medium">Фінально</th>
                      <th className="pb-3 pr-3 font-medium">Сплачено</th>
                      <th className="pb-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {activeItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-sm text-ink-soft"
                        >
                          {mode === "payments"
                            ? "У цій категорії ще немає сплачених витрат."
                            : "Поки порожньо — додай першу витрату."}
                        </td>
                      </tr>
                    ) : null}
                    {activeItems.map((item) => {
                      const isEditing = editingId === item.id;
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-line/70 align-middle"
                        >
                          <td className="py-3 pr-3">
                            {isEditing ? (
                              <input
                                value={editDraft.title}
                                onChange={(e) =>
                                  setEditDraft((d) => ({
                                    ...d,
                                    title: e.target.value,
                                  }))
                                }
                                className="w-full border border-line px-2 py-1.5 outline-none focus:border-sage"
                              />
                            ) : (
                              <span className="text-ink">{item.title}</span>
                            )}
                          </td>
                          <td className="py-3 pr-3 tabular-nums">
                            {isEditing ? (
                              <input
                                type="number"
                                min={0}
                                value={editDraft.estimated}
                                onChange={(e) =>
                                  setEditDraft((d) => ({
                                    ...d,
                                    estimated: Number(e.target.value),
                                  }))
                                }
                                className="w-28 border border-line px-2 py-1.5 outline-none focus:border-sage"
                              />
                            ) : (
                              `${formatMoney(item.estimated)} ₴`
                            )}
                          </td>
                          <td className="py-3 pr-3 tabular-nums">
                            {isEditing ? (
                              <input
                                type="number"
                                min={0}
                                value={editDraft.actual}
                                onChange={(e) =>
                                  setEditDraft((d) => ({
                                    ...d,
                                    actual: Number(e.target.value),
                                  }))
                                }
                                className="w-28 border border-line px-2 py-1.5 outline-none focus:border-sage"
                              />
                            ) : (
                              `${formatMoney(item.actual)} ₴`
                            )}
                          </td>
                          <td className="py-3 pr-3">
                            <button
                              type="button"
                              onClick={() => void onTogglePaid(item)}
                              className={`tabular-nums ${
                                item.paid
                                  ? "font-medium text-sage"
                                  : "text-ink-soft"
                              }`}
                              title={
                                item.paid
                                  ? "Натисни, щоб зняти оплату"
                                  : "Позначити сплаченим"
                              }
                            >
                              {formatMoney(paidAmount(item))} ₴
                            </button>
                          </td>
                          <td className="relative py-3 text-right">
                            {isEditing ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => void saveEdit(item.id)}
                                  className="text-xs font-semibold text-sage"
                                >
                                  Зберегти
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="text-xs text-ink-soft"
                                >
                                  Скасувати
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setMenuOpenId((id) =>
                                      id === item.id ? null : item.id,
                                    )
                                  }
                                  className="px-2 py-1 text-ink-soft hover:text-ink"
                                  aria-label="Дії"
                                >
                                  ···
                                </button>
                                {menuOpenId === item.id ? (
                                  <div className="absolute right-0 z-10 mt-1 min-w-[140px] border border-line bg-white py-1 shadow-sm">
                                    <button
                                      type="button"
                                      onClick={() => startEdit(item)}
                                      className="block w-full px-3 py-2 text-left text-sm hover:bg-mist"
                                    >
                                      Редагувати
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => void onTogglePaid(item)}
                                      className="block w-full px-3 py-2 text-left text-sm hover:bg-mist"
                                    >
                                      {item.paid
                                        ? "Не сплачено"
                                        : "Сплачено"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => void onDelete(item.id)}
                                      className="block w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-mist"
                                    >
                                      Видалити
                                    </button>
                                  </div>
                                ) : null}
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="text-sm font-semibold text-ink">
                      <td className="pt-4 pr-3">Разом</td>
                      <td className="pt-4 pr-3 tabular-nums">
                        {formatMoney(active.estimated)} ₴
                      </td>
                      <td className="pt-4 pr-3 tabular-nums">
                        {formatMoney(active.actual)} ₴
                      </td>
                      <td className="pt-4 pr-3 tabular-nums">
                        {formatMoney(active.paid)} ₴
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>

              {adding ? (
                <form
                  onSubmit={onAddExpense}
                  className="mt-4 grid gap-3 border border-line bg-mist p-4 sm:grid-cols-[1fr_140px_auto]"
                >
                  <input
                    required
                    minLength={2}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Назва витрати"
                    className="border border-line bg-white px-3 py-2 outline-none focus:border-sage"
                    autoFocus
                  />
                  <input
                    type="number"
                    min={0}
                    value={newEstimated}
                    onChange={(e) => setNewEstimated(Number(e.target.value))}
                    placeholder="Сума"
                    className="border border-line bg-white px-3 py-2 outline-none focus:border-sage"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={savingItem}
                      className="bg-sage px-4 py-2 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
                    >
                      Додати
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdding(false)}
                      className="px-3 py-2 text-sm text-ink-soft"
                    >
                      Скасувати
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-sage hover:text-sage-deep"
                >
                  <span className="text-lg leading-none">+</span>
                  Додати витрату
                </button>
              )}
            </>
          )}
        </section>
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
