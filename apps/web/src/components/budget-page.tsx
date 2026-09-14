"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageLoader } from "@/components/ui-loader";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import { RequireAuth } from "@/components/require-auth";
import {
  createBudgetItem,
  deleteBudgetItem,
  getBudget,
  updateBudgetItem,
  type BudgetItem,
  type BudgetResponse,
} from "@/lib/budget-api";
import {
  getMyWedding,
  getVendorPipeline,
  type ExternalVendor,
} from "@/lib/dashboard-api";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";
import "../app/couple-cabinet.css";

type StatusFilter = "all" | "paid" | "unpaid";
type CategoryFilter =
  | "all"
  | "vendors"
  | "attire"
  | "decor"
  | "banquet"
  | "print"
  | "other";
type PayerFilter =
  | "all"
  | "couple"
  | "owner"
  | "partner"
  | "parents_owner"
  | "parents_partner"
  | "unknown"
  | "other";
type MenuPayer = "owner" | "partner" | "couple" | "unknown" | "other";
type SortMode = "recent" | "amount" | "alpha";
type Currency = "UAH" | "USD";

type BudgetRow = BudgetItem & {
  uiCategory: Exclude<CategoryFilter, "all">;
  payer: Exclude<PayerFilter, "all">;
  amount: number;
};

const PAGE_SIZE = 12;
const USD_RATE = 41;

const UI_CATEGORIES: Array<{ id: Exclude<CategoryFilter, "all">; label: string }> =
  [
    { id: "vendors", label: "Підрядники" },
    { id: "attire", label: "Образи" },
    { id: "decor", label: "Декор" },
    { id: "banquet", label: "Банкет" },
    { id: "print", label: "Поліграфія" },
    { id: "other", label: "Інше" },
  ];

const PAYERS: Array<{ id: Exclude<PayerFilter, "all">; label: string }> = [
  { id: "couple", label: "Обоє" },
  { id: "owner", label: "Наречена" },
  { id: "partner", label: "Наречений" },
  { id: "parents_owner", label: "Батьки нареченої" },
  { id: "parents_partner", label: "Батьки нареченого" },
  { id: "unknown", label: "Ніхто" },
  { id: "other", label: "Хтось інший" },
];

const API_TO_UI: Record<string, Exclude<CategoryFilter, "all">> = {
  venue: "vendors",
  photo: "vendors",
  video: "vendors",
  music: "vendors",
  host: "vendors",
  beauty: "vendors",
  transport: "vendors",
  vendors: "vendors",
  attire: "attire",
  rings: "attire",
  decor: "decor",
  catering: "banquet",
  cake: "banquet",
  banquet: "banquet",
  docs: "print",
  gifts: "print",
  print: "print",
  other: "other",
  honeymoon: "other",
  reserve: "other",
};

function mapApiCategory(slug: string): Exclude<CategoryFilter, "all"> {
  return API_TO_UI[slug] ?? "other";
}

function uiToApiCategory(ui: Exclude<CategoryFilter, "all"> | "") {
  switch (ui) {
    case "vendors":
      return "vendors";
    case "attire":
      return "attire";
    case "decor":
      return "decor";
    case "banquet":
      return "banquet";
    case "print":
      return "print";
    case "other":
    default:
      return "other";
  }
}

function parsePayer(notes: string | null): Exclude<PayerFilter, "all"> {
  const match = notes?.match(/payer:([a-z_]+)/);
  const value = match?.[1];
  if (
    value === "couple" ||
    value === "owner" ||
    value === "partner" ||
    value === "parents_owner" ||
    value === "parents_partner" ||
    value === "unknown" ||
    value === "other"
  ) {
    return value;
  }
  return "unknown";
}

function parseCurrency(notes: string | null): Currency {
  return notes?.includes("currency:USD") ? "USD" : "UAH";
}

function parseVendorName(notes: string | null): string {
  const match = notes?.match(/vendor:([^\s]+)/);
  if (!match?.[1]) return "";
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

function buildNotes(input: {
  payer: Exclude<PayerFilter, "all">;
  vendor?: string;
  currency: Currency;
}) {
  const parts = [`payer:${input.payer}`, `currency:${input.currency}`];
  if (input.vendor) parts.push(`vendor:${encodeURIComponent(input.vendor)}`);
  return parts.join(" ");
}

function itemAmount(item: BudgetItem) {
  if (item.paid) return item.actual || item.estimated;
  return item.estimated || item.actual;
}

function formatMoney(value: number, currency: Currency) {
  const amount = currency === "USD" ? value / USD_RATE : value;
  const formatted = new Intl.NumberFormat("uk-UA", {
    maximumFractionDigits: currency === "USD" ? 0 : 0,
  }).format(Math.round(amount));
  return currency === "USD" ? `$${formatted}` : `${formatted} ₴`;
}

function formatShortDate(iso: string) {
  const [, m, d] = iso.slice(0, 10).split("-");
  return `${d}.${m}`;
}

function payerMark(payer: Exclude<PayerFilter, "all">) {
  switch (payer) {
    case "couple":
      return "C";
    case "owner":
      return "o";
    case "partner":
      return "p";
    case "parents_owner":
      return "B";
    case "parents_partner":
      return "R";
    case "other":
      return "?";
    default:
      return "—";
  }
}

function BudgetInner() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<BudgetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needWedding, setNeedWedding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [partnerInitials, setPartnerInitials] = useState("П");
  const [ownerName, setOwnerName] = useState("Оля");
  const [partnerName, setPartnerName] = useState("Роман");
  const [vendors, setVendors] = useState<ExternalVendor[]>([]);

  const [currency, setCurrency] = useState<Currency>("UAH");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [payerFilter, setPayerFilter] = useState<PayerFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BudgetRow | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState<Currency>("UAH");
  const [category, setCategory] = useState<Exclude<CategoryFilter, "all"> | "">(
    "",
  );
  const [vendorId, setVendorId] = useState("");
  const [status, setStatus] = useState<"planned" | "paid" | "">("");
  const [formPayer, setFormPayer] = useState<MenuPayer>("couple");

  async function load() {
    setLoading(true);
    setError(null);
    setNeedWedding(false);
    try {
      const res = await getBudget();
      setData(res);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Помилка";
      if (message.toLowerCase().includes("весілля")) setNeedWedding(true);
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    void getNotificationsSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
    void getMyWedding()
      .then((wedding) => {
        const one =
          wedding?.partnerOneName?.trim().split(/\s+/)[0] ||
          user?.name?.trim().split(/\s+/)[0] ||
          "Оля";
        const two = wedding?.partnerTwoName?.trim().split(/\s+/)[0] || "Роман";
        setOwnerName(one);
        setPartnerName(two);
        const a = one.charAt(0).toUpperCase();
        const b = two.charAt(0).toUpperCase();
        setPartnerInitials(b ? `${a}&${b}` : a);
      })
      .catch(() => undefined);
    void getVendorPipeline()
      .then((pipeline) => setVendors(pipeline.manual))
      .catch(() => setVendors([]));
  }, [user?.name]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [statusFilter, categoryFilter, payerFilter, sortMode]);

  useEffect(() => {
    if (!menuOpenId) return;
    function onDocClick(event: MouseEvent) {
      const target = event.target;
      if (
        !(target instanceof Element) ||
        !target.closest(".cabinet-guest-menu-wrap")
      ) {
        setMenuOpenId(null);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpenId(null);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpenId]);

  const rows: BudgetRow[] = useMemo(() => {
    if (!data) return [];
    return data.items.map((item) => ({
      ...item,
      uiCategory: mapApiCategory(item.category),
      payer: parsePayer(item.notes),
      amount: itemAmount(item),
    }));
  }, [data]);

  const totals = useMemo(() => {
    const current = rows.reduce((sum, row) => sum + row.amount, 0);
    const spent = rows
      .filter((row) => row.paid)
      .reduce((sum, row) => sum + (row.actual || row.estimated), 0);
    const plannedLeft = rows
      .filter((row) => !row.paid)
      .reduce((sum, row) => sum + row.estimated, 0);
    return { current, spent, plannedLeft };
  }, [rows]);

  const counts = useMemo(() => {
    const statusCounts = {
      all: rows.reduce((s, r) => s + r.amount, 0),
      paid: rows.filter((r) => r.paid).reduce((s, r) => s + r.amount, 0),
      unpaid: rows.filter((r) => !r.paid).reduce((s, r) => s + r.amount, 0),
    };
    const categories = Object.fromEntries(
      UI_CATEGORIES.map((c) => [
        c.id,
        rows.filter((r) => r.uiCategory === c.id).reduce((s, r) => s + r.amount, 0),
      ]),
    ) as Record<Exclude<CategoryFilter, "all">, number>;
    const payers = Object.fromEntries(
      PAYERS.map((p) => [
        p.id,
        rows.filter((r) => r.payer === p.id).reduce((s, r) => s + r.amount, 0),
      ]),
    ) as Record<Exclude<PayerFilter, "all">, number>;
    return {
      status: statusCounts,
      categories: { all: statusCounts.all, ...categories },
      payers: { all: statusCounts.all, ...payers },
    };
  }, [rows]);

  const filtered = useMemo(() => {
    const list = rows.filter((row) => {
      if (statusFilter === "paid" && !row.paid) return false;
      if (statusFilter === "unpaid" && row.paid) return false;
      if (categoryFilter !== "all" && row.uiCategory !== categoryFilter) {
        return false;
      }
      if (payerFilter !== "all" && row.payer !== payerFilter) return false;
      return true;
    });
    return list.sort((a, b) => {
      if (sortMode === "alpha") return a.title.localeCompare(b.title, "uk");
      if (sortMode === "amount") return b.amount - a.amount;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [rows, statusFilter, categoryFilter, payerFilter, sortMode]);

  const visible = filtered.slice(0, visibleCount);

  const payerLabels = useMemo(
    () => ({
      couple: "Обоє",
      owner: ownerName,
      partner: partnerName,
      parents_owner: `Батьки ${ownerName}`,
      parents_partner: `Батьки ${partnerName}`,
      unknown: "Ніхто",
      other: "Хтось інший",
    }),
    [ownerName, partnerName],
  );

  function resetDrawer() {
    setEditingId(null);
    setTitle("");
    setAmount("");
    setFormCurrency(currency);
    setCategory("");
    setVendorId("");
    setStatus("");
    setFormPayer("couple");
  }

  function openCreate() {
    resetDrawer();
    setDrawerOpen(true);
  }

  function openEdit(item: BudgetRow) {
    const itemCurrency = parseCurrency(item.notes);
    const uah = item.amount;
    const display =
      itemCurrency === "USD" ? Math.round(uah / USD_RATE) : Math.round(uah);
    const vendorName = parseVendorName(item.notes);
    const matchedVendor = vendors.find((v) => v.name === vendorName);
    setEditingId(item.id);
    setTitle(item.title);
    setAmount(String(display));
    setFormCurrency(itemCurrency);
    setCategory(item.uiCategory);
    setVendorId(matchedVendor?.id ?? "");
    setStatus(item.paid ? "paid" : "planned");
    setFormPayer(
      item.payer === "owner" ||
        item.payer === "partner" ||
        item.payer === "couple" ||
        item.payer === "unknown" ||
        item.payer === "other"
        ? item.payer
        : "couple",
    );
    setMenuOpenId(null);
    setDrawerOpen(true);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    const nextTitle = title.trim();
    const raw = Number(amount.replace(/\s/g, "").replace(",", "."));
    if (nextTitle.length < 2) {
      toast.error("Вкажи, що оплатили");
      return;
    }
    if (!Number.isFinite(raw) || raw <= 0) {
      toast.error("Вкажи суму");
      return;
    }
    if (!status) {
      toast.error("Обери статус");
      return;
    }
    const uah = formCurrency === "USD" ? Math.round(raw * USD_RATE) : Math.round(raw);
    const paid = status === "paid";
    const vendor = vendors.find((v) => v.id === vendorId);
    const notes = buildNotes({
      payer: formPayer,
      vendor: vendor?.name,
      currency: formCurrency,
    });
    setBusy(true);
    try {
      const res = editingId
        ? await updateBudgetItem(editingId, {
            title: nextTitle,
            category: uiToApiCategory(category || "other"),
            estimated: uah,
            actual: paid ? uah : 0,
            paid,
            notes,
          })
        : await createBudgetItem({
            title: nextTitle,
            category: uiToApiCategory(category || "other"),
            estimated: uah,
            actual: paid ? uah : 0,
            paid,
            notes,
          });
      setData(res);
      setDrawerOpen(false);
      resetDrawer();
      toast.success(editingId ? "Оновлено" : "Збережено", nextTitle);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не збережено");
    } finally {
      setBusy(false);
    }
  }

  async function onTogglePaid(item: BudgetRow) {
    setBusy(true);
    try {
      const res = await updateBudgetItem(item.id, {
        paid: !item.paid,
        actual: !item.paid ? item.estimated || item.actual : item.actual,
      });
      setData(res);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не оновлено");
    } finally {
      setBusy(false);
      setMenuOpenId(null);
    }
  }

  async function onSetPayer(item: BudgetRow, nextPayer: MenuPayer) {
    setMenuOpenId(null);
    if (item.payer === nextPayer) return;
    const itemCurrency = parseCurrency(item.notes);
    const vendorName = parseVendorName(item.notes);
    setBusy(true);
    try {
      const res = await updateBudgetItem(item.id, {
        notes: buildNotes({
          payer: nextPayer,
          vendor: vendorName || undefined,
          currency: itemCurrency,
        }),
      });
      setData(res);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не оновлено");
    } finally {
      setBusy(false);
    }
  }

  function requestDelete(item: BudgetRow) {
    setMenuOpenId(null);
    setDeleteTarget(item);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      const res = await deleteBudgetItem(deleteTarget.id);
      setData(res);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не видалено");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <PageLoader label="Завантажуємо бюджет…" />;
  }

  if (needWedding || !data) {
    return (
      <div className="cabinet-tasks-page">
        <div className="cabinet-tasks-top">
          <h1 className="cabinet-tasks-title">Бюджет</h1>
        </div>
        <div className="cabinet-panel" style={{ marginTop: 24 }}>
          <p style={{ margin: 0, color: "#666" }}>
            Спочатку збережи дату весілля в огляді — тоді відкриється бюджет.
          </p>
          <Link href="/dashboard" className="cabinet-panel-link">
            До огляду
          </Link>
        </div>
        {error ? <p className="cabinet-tasks-error">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="cabinet-tasks-page">
      <div className="cabinet-tasks-top">
        <h1 className="cabinet-tasks-title">Бюджет</h1>
        <div className="cabinet-overview-actions">
          {rows.length > 0 ? (
            <label className="cabinet-tasks-sort">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
              >
                <option value="UAH">Показувати витрати в UAH</option>
                <option value="USD">Показувати витрати в USD</option>
              </select>
            </label>
          ) : null}
          <CabinetNotificationsBell summary={summary} />
          <CabinetProfileMenu initials={partnerInitials} />
        </div>
      </div>

      {error ? <p className="cabinet-tasks-error">{error}</p> : null}

      {rows.length === 0 ? (
        <div className="cabinet-guests-empty">
          <div className="cabinet-guests-empty-glow" aria-hidden />
          <BudgetEmptyArt />
          <h2>Почнемо рахувати весільні витрати?</h2>
          <p>
            Додавайте заплановані та фактичні витрати. Ми автоматично покажемо
            суму, допоможемо розбити платежі по категоріях та підкажемо статус
            оплати.
          </p>
          <div className="cabinet-guests-empty-actions">
            <button
              type="button"
              className="cabinet-budget-cta"
              onClick={openCreate}
            >
              Внести витрати
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="cabinet-tasks-layout cabinet-budget-layout">
            <aside className="cabinet-tasks-filters">
              <FilterGroup
                title="Статус"
                items={[
                  {
                    id: "all",
                    label: "Всі",
                    count: formatMoney(counts.status.all, currency),
                  },
                  {
                    id: "paid",
                    label: "Сплачено",
                    count: formatMoney(counts.status.paid, currency),
                  },
                  {
                    id: "unpaid",
                    label: "Ще до сплати",
                    count: formatMoney(counts.status.unpaid, currency),
                  },
                ]}
                active={statusFilter}
                onChange={(id) => setStatusFilter(id as StatusFilter)}
              />
              <FilterGroup
                title="Категорія"
                items={[
                  {
                    id: "all",
                    label: "Всі",
                    count: formatMoney(counts.categories.all, currency),
                  },
                  ...UI_CATEGORIES.map((c) => ({
                    id: c.id,
                    label: c.label,
                    count: formatMoney(counts.categories[c.id], currency),
                  })),
                ]}
                active={categoryFilter}
                onChange={(id) => setCategoryFilter(id as CategoryFilter)}
              />
              <FilterGroup
                title="Хто оплачує"
                items={[
                  {
                    id: "all",
                    label: "Усі",
                    count: formatMoney(counts.payers.all, currency),
                  },
                  ...PAYERS.map((p) => ({
                    id: p.id,
                    label: payerLabels[p.id],
                    count: formatMoney(counts.payers[p.id], currency),
                  })),
                ]}
                active={payerFilter}
                onChange={(id) => setPayerFilter(id as PayerFilter)}
              />
            </aside>

            <div className="cabinet-budget-main">
              <div className="cabinet-budget-stats">
                <article className="cabinet-budget-stat">
                  <p className="cabinet-budget-stat-value">
                    {formatMoney(totals.current, currency)}
                  </p>
                  <p className="cabinet-budget-stat-label">
                    Поточна вартість весілля
                  </p>
                </article>
                <article className="cabinet-budget-stat">
                  <p className="cabinet-budget-stat-value">
                    {formatMoney(totals.spent, currency)}
                  </p>
                  <p className="cabinet-budget-stat-label">Витрачено</p>
                </article>
                <article className="cabinet-budget-stat">
                  <p className="cabinet-budget-stat-value">
                    {formatMoney(totals.plannedLeft, currency)}
                  </p>
                  <p className="cabinet-budget-stat-label">
                    Ще до сплати заплановано
                  </p>
                </article>
              </div>

              <section className="cabinet-budget-list-panel">
              <div className="cabinet-tasks-list-head">
                <h2>Витрати</h2>
                <div className="cabinet-tasks-list-actions">
                  <label className="cabinet-tasks-sort">
                    <select
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value as SortMode)}
                    >
                      <option value="recent">Недавно додані зверху</option>
                      <option value="amount">За сумою</option>
                      <option value="alpha">За алфавітом</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    className="cabinet-budget-add-btn"
                    onClick={openCreate}
                  >
                    Внести витрату
                  </button>
                </div>
              </div>

              {visible.length === 0 ? (
                <p className="cabinet-tasks-empty">Немає витрат у цьому фільтрі.</p>
              ) : (
                <div className="cabinet-budget-table">
                  <div className="cabinet-budget-table-head">
                    <span>Назва витрати</span>
                    <span>Сума</span>
                    <span>Статус</span>
                    <span>Категорія</span>
                    <span>Дата</span>
                    <span>Хто платить</span>
                    <span />
                  </div>
                  <ul className="cabinet-budget-list">
                    {visible.map((item) => {
                      const catLabel =
                        UI_CATEGORIES.find((c) => c.id === item.uiCategory)
                          ?.label ?? "Інше";
                      return (
                        <li key={item.id} className="cabinet-budget-row">
                          <span className="cabinet-budget-title">{item.title}</span>
                          <span className="cabinet-budget-amount">
                            {formatMoney(item.amount, currency)}
                          </span>
                          <span
                            className={`cabinet-budget-status ${
                              item.paid ? "is-paid" : "is-planned"
                            }`}
                          >
                            {item.paid ? (
                              <>
                                <i aria-hidden />
                                Сплачено
                              </>
                            ) : (
                              "Заплановано"
                            )}
                          </span>
                          <span className="cabinet-budget-cat">{catLabel}</span>
                          <span className="cabinet-budget-date">
                            {formatShortDate(item.createdAt)}
                          </span>
                          <span
                            className={`cabinet-task-who cabinet-budget-payer is-${item.payer}`}
                            title={payerLabels[item.payer]}
                          >
                            {item.payer === "couple" ? (
                              <span className="cabinet-guest-menu-duo" aria-hidden>
                                <span className="cabinet-task-who is-partner">
                                  p
                                </span>
                                <span className="cabinet-task-who is-owner">
                                  o
                                </span>
                              </span>
                            ) : (
                              payerMark(item.payer)
                            )}
                          </span>
                          <div className="cabinet-guest-menu-wrap">
                            <button
                              type="button"
                              className="cabinet-task-menu"
                              aria-label="Меню витрати"
                              aria-expanded={menuOpenId === item.id}
                              onClick={() =>
                                setMenuOpenId((id) =>
                                  id === item.id ? null : item.id,
                                )
                              }
                            >
                              ⋯
                            </button>
                            {menuOpenId === item.id ? (
                              <div className="cabinet-guest-menu" role="menu">
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="cabinet-guest-menu-item"
                                  disabled={busy}
                                  onClick={() => openEdit(item)}
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden
                                  >
                                    <path
                                      d="M15.2 5.2 18.8 8.8M4 20l.7-3.7L16.6 4.4a2 2 0 0 1 2.8 0l.2.2a2 2 0 0 1 0 2.8L7.7 19.3 4 20Z"
                                      stroke="currentColor"
                                      strokeWidth="1.6"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Редагувати
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="cabinet-guest-menu-item"
                                  disabled={busy}
                                  onClick={() => void onTogglePaid(item)}
                                >
                                  {item.paid
                                    ? "Позначити як заплановано"
                                    : "Позначити як сплачене"}
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="cabinet-guest-menu-item is-danger"
                                  disabled={busy}
                                  onClick={() => requestDelete(item)}
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden
                                  >
                                    <path
                                      d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                                      stroke="currentColor"
                                      strokeWidth="1.6"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Видалити
                                </button>

                                <div className="cabinet-guest-menu-divider" />
                                <p className="cabinet-guest-menu-label is-caps">
                                  Хто відповідальний:
                                </p>

                                <button
                                  type="button"
                                  role="menuitem"
                                  className={`cabinet-guest-menu-item${
                                    item.payer === "owner" ? " is-active" : ""
                                  }`}
                                  disabled={busy}
                                  onClick={() =>
                                    void onSetPayer(item, "owner")
                                  }
                                >
                                  <span className="cabinet-task-who is-owner">
                                    o
                                  </span>
                                  {ownerName}
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  className={`cabinet-guest-menu-item${
                                    item.payer === "partner" ? " is-active" : ""
                                  }`}
                                  disabled={busy}
                                  onClick={() =>
                                    void onSetPayer(item, "partner")
                                  }
                                >
                                  <span className="cabinet-task-who is-partner">
                                    p
                                  </span>
                                  {partnerName}
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  className={`cabinet-guest-menu-item${
                                    item.payer === "couple" ? " is-active" : ""
                                  }`}
                                  disabled={busy}
                                  onClick={() =>
                                    void onSetPayer(item, "couple")
                                  }
                                >
                                  <span
                                    className="cabinet-guest-menu-duo"
                                    aria-hidden
                                  >
                                    <span className="cabinet-task-who is-partner">
                                      p
                                    </span>
                                    <span className="cabinet-task-who is-owner">
                                      o
                                    </span>
                                  </span>
                                  Обоє
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  className={`cabinet-guest-menu-item${
                                    item.payer === "unknown" ? " is-active" : ""
                                  }`}
                                  disabled={busy}
                                  onClick={() =>
                                    void onSetPayer(item, "unknown")
                                  }
                                >
                                  Ніхто
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  className={`cabinet-guest-menu-item${
                                    item.payer === "other" ? " is-active" : ""
                                  }`}
                                  disabled={busy}
                                  onClick={() => void onSetPayer(item, "other")}
                                >
                                  Хтось інший
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {filtered.length > visibleCount ? (
                <button
                  type="button"
                  className="cabinet-panel-link cabinet-tasks-more"
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                >
                  Показати більше
                </button>
              ) : null}
              </section>
            </div>
          </div>
        </>
      )}

      {drawerOpen ? (
        <div className="cabinet-drawer-root">
          <button
            type="button"
            className="cabinet-drawer-backdrop"
            aria-label="Закрити"
            onClick={() => {
              setDrawerOpen(false);
              resetDrawer();
            }}
          />
          <aside className="cabinet-drawer cabinet-budget-drawer" aria-label="Внести витрату">
            <div className="cabinet-drawer-head">
              <h2>Внести витрату</h2>
              <button
                type="button"
                className="cabinet-drawer-close"
                aria-label="Закрити"
                onClick={() => {
                  setDrawerOpen(false);
                  resetDrawer();
                }}
              >
                ×
              </button>
            </div>
            <form className="cabinet-drawer-form" onSubmit={onSave}>
              <label className="cabinet-drawer-field">
                <span>
                  Що ви оплатили <em>*</em>
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Наприклад: Пробна зачіска"
                  required
                />
              </label>

              <div className="cabinet-budget-amount-row">
                <label className="cabinet-drawer-field">
                  <span>
                    Сума <em>*</em>
                  </span>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Внесіть суму"
                    inputMode="decimal"
                    required
                  />
                </label>
                <label className="cabinet-drawer-field">
                  <span>Оберіть валюту</span>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value as Currency)}
                  >
                    <option value="UAH">грн</option>
                    <option value="USD">$ Долари</option>
                  </select>
                </label>
              </div>

              <label className="cabinet-drawer-field">
                <span>Оберіть категорію</span>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as Exclude<CategoryFilter, "all"> | "",
                    )
                  }
                >
                  <option value="">Обрати категорію</option>
                  {UI_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>

              {category === "vendors" ? (
                <label className="cabinet-drawer-field">
                  <span>
                    Оберіть підрядника <em>*</em>
                  </span>
                  <select
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                    required={category === "vendors"}
                  >
                    <option value="">Обрати підрядника</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <label className="cabinet-drawer-field">
                <span>
                  Статус <em>*</em>
                </span>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "planned" | "paid" | "")
                  }
                  required
                >
                  <option value="">Обрати статус</option>
                  <option value="planned">Заплановано</option>
                  <option value="paid">Сплачено</option>
                </select>
              </label>

              <div className="cabinet-drawer-actions">
                <button
                  type="button"
                  className="cabinet-drawer-cancel"
                  onClick={() => {
                    setDrawerOpen(false);
                    resetDrawer();
                  }}
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="cabinet-budget-save"
                  disabled={busy}
                >
                  {busy ? "…" : "Зберегти"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function FilterGroup({
  title,
  items,
  active,
  onChange,
}: {
  title: string;
  items: Array<{ id: string; label: string; count: string | number }>;
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="cabinet-filter-group">
      <p className="cabinet-filter-title">{title}</p>
      <div className="cabinet-filter-list">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`cabinet-filter-item${active === item.id ? " is-active" : ""}`}
            onClick={() => onChange(item.id)}
          >
            <span>{item.label}</span>
            <span className="cabinet-filter-count">{item.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function BudgetEmptyArt() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="cabinet-guests-empty-art"
      src="/cabinet/empty/budget.png"
      alt=""
      width={280}
      height={200}
      aria-hidden
    />
  );
}

export function BudgetPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <BudgetInner />
    </RequireAuth>
  );
}
