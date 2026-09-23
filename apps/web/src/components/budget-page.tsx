"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageLoader } from "@/components/ui-loader";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import {
  IconClose,
  IconFilters,
  IconQuickAdd,
} from "@/components/cabinet-task-icons";
import {
  CabinetContextMenu,
  CabinetContextMenuDivider,
  CabinetContextMenuItem,
  CabinetContextMenuLabel,
} from "@/components/cabinet-context-menu";
import { IconEdit } from "@/components/icon-edit";
import { IconMore } from "@/components/icon-more";
import { IconTrash } from "@/components/icon-trash";
import {
  ResponsibleAvatar,
  ResponsibleAvatarDuo,
} from "@/components/responsible-avatar";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TextInput } from "@/components/ui/text-input";
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
type MenuPayer =
  | "owner"
  | "partner"
  | "couple"
  | "parents_owner"
  | "parents_partner";
type SortMode = "recent" | "amount" | "alpha";
type Currency = "UAH" | "USD";

type BudgetRow = BudgetItem & {
  uiCategory: Exclude<CategoryFilter, "all">;
  payer: Exclude<PayerFilter, "all">;
  amount: number;
};

const PAGE_SIZE = 12;
/**
 * TODO(fx): replace hardcoded USD_RATE with shared weekly NBU rate (same as API budget sync).
 * Free endpoint (no key):
 *   GET https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json
 * Use `rate` from JSON; refresh ~once a week. Until then UI convert is approximate.
 * See also: apps/api/src/budget/vendor-budget-sync.ts
 */
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

/** Already paid (full payment or partial deposit on vendor-linked rows). */
function itemPaidAmount(item: BudgetItem) {
  if (item.paid) return item.actual || item.estimated;
  return item.actual || 0;
}

/** Still owed — estimated minus any partial payment already in actual. */
function itemRemainingAmount(item: BudgetItem) {
  if (item.paid) return 0;
  return Math.max(0, (item.estimated || 0) - (item.actual || 0));
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

function BudgetPayerAvatar({
  payer,
  ownerName,
  partnerName,
  title,
}: {
  payer: Exclude<PayerFilter, "all">;
  ownerName: string;
  partnerName: string;
  title: string;
}) {
  if (payer === "couple") {
    return (
      <ResponsibleAvatarDuo
        ownerName={ownerName}
        partnerName={partnerName}
        title={title}
        aria-label={title}
      />
    );
  }
  if (payer === "owner") {
    return (
      <ResponsibleAvatar name={ownerName} tone="owner" title={title} />
    );
  }
  if (payer === "partner") {
    return (
      <ResponsibleAvatar name={partnerName} tone="partner" title={title} />
    );
  }
  if (payer === "parents_owner") {
    return (
      <ResponsibleAvatar
        name={ownerName}
        tone="parents_owner"
        title={title}
      />
    );
  }
  if (payer === "parents_partner") {
    return (
      <ResponsibleAvatar
        name={partnerName}
        tone="parents_partner"
        title={title}
      />
    );
  }
  if (payer === "unknown") {
    return (
      <ResponsibleAvatar tone="unknown" letter="—" title={title} />
    );
  }
  return <ResponsibleAvatar tone="other" letter="?" title={title} />;
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filtersMounted, setFiltersMounted] = useState(false);
  const [draftStatus, setDraftStatus] = useState<StatusFilter>("all");
  const [draftCategory, setDraftCategory] = useState<CategoryFilter>("all");
  const [draftPayer, setDraftPayer] = useState<PayerFilter>("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
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
    if (!filtersOpen) {
      setFiltersVisible(false);
      const timer = window.setTimeout(() => setFiltersMounted(false), 320);
      return () => window.clearTimeout(timer);
    }
    setDraftStatus(statusFilter);
    setDraftCategory(categoryFilter);
    setDraftPayer(payerFilter);
    setFiltersMounted(true);
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setFiltersVisible(true));
    });
    return () => window.cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersOpen]);

  useEffect(() => {
    if (!filtersOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setFiltersOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtersOpen]);

  useEffect(() => {
    if (!drawerOpen) {
      setDrawerVisible(false);
      const timer = window.setTimeout(() => setDrawerMounted(false), 320);
      return () => window.clearTimeout(timer);
    }
    setDrawerMounted(true);
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setDrawerVisible(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        resetDrawer();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  useEffect(() => {
    if (!menuOpenId) return;
    function onDocClick(event: MouseEvent) {
      const target = event.target;
      if (
        !(target instanceof Element) ||
        !target.closest(".cabinet-ctx-menu-wrap")
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
    const spent = rows.reduce((sum, row) => sum + itemPaidAmount(row), 0);
    const plannedLeft = rows.reduce(
      (sum, row) => sum + itemRemainingAmount(row),
      0,
    );
    return { current, spent, plannedLeft };
  }, [rows]);

  const counts = useMemo(() => {
    const statusCounts = {
      all: rows.reduce((s, r) => s + r.amount, 0),
      paid: rows.reduce((s, r) => s + itemPaidAmount(r), 0),
      unpaid: rows.reduce((s, r) => s + itemRemainingAmount(r), 0),
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

  const activeFilterCount = [
    statusFilter !== "all",
    categoryFilter !== "all",
    payerFilter !== "all",
  ].filter(Boolean).length;
  const filtersActive = activeFilterCount > 0;

  function applyDraftFilters() {
    setStatusFilter(draftStatus);
    setCategoryFilter(draftCategory);
    setPayerFilter(draftPayer);
    setFiltersOpen(false);
  }

  function resetDraftFilters() {
    setDraftStatus("all");
    setDraftCategory("all");
    setDraftPayer("all");
  }

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
        item.payer === "parents_owner" ||
        item.payer === "parents_partner"
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
    <div className="cabinet-tasks-page cabinet-budget-page">
      <div className="cabinet-tasks-top">
        <h1 className="cabinet-tasks-title">Бюджет</h1>
        <div className="cabinet-tasks-top-actions">
          {rows.length > 0 ? (
            <>
              <div className="cabinet-budget-currency-chip">
                <Select
                  tone="ghost"
                  size="m"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  aria-label="Валюта"
                >
                  <option value="UAH">UAH</option>
                  <option value="USD">USD</option>
                </Select>
              </div>
              <button
                type="button"
                className="cabinet-tasks-quick-add"
                aria-label="Внести витрату"
                onClick={openCreate}
              >
                <IconQuickAdd />
              </button>
            </>
          ) : null}
          <div className="cabinet-overview-actions cabinet-tasks-desktop-actions">
            {rows.length > 0 ? (
              <Select
                className="cabinet-tasks-sort cabinet-budget-currency-desktop"
                size="m"
                shape="pill"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                aria-label="Валюта"
              >
                <option value="UAH">Показувати витрати в UAH</option>
                <option value="USD">Показувати витрати в USD</option>
              </Select>
            ) : null}
            <CabinetNotificationsBell summary={summary} />
            <CabinetProfileMenu initials={partnerInitials} />
          </div>
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
            <Button type="button" tone="ink" size="m" className="cabinet-empty-cta" onClick={openCreate}>
              Внести витрати
            </Button>
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

              <div className="cabinet-tasks-mobile-bar cabinet-budget-mobile-bar">
                <button
                  type="button"
                  className={`cabinet-tasks-chip${filtersActive ? " is-active" : ""}`}
                  onClick={() => setFiltersOpen(true)}
                >
                  <IconFilters size={14} />
                  Фільтри
                  {filtersActive ? (
                    <span className="cabinet-tasks-chip-badge">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </button>
                <div className="cabinet-tasks-chip cabinet-tasks-chip--select">
                  <Select
                    tone="ghost"
                    size="s"
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value as SortMode)}
                    aria-label="Сортування"
                  >
                    <option value="recent">Недавно додані зверху</option>
                    <option value="amount">За сумою</option>
                    <option value="alpha">За алфавітом</option>
                  </Select>
                </div>
              </div>

              <section className="cabinet-budget-list-panel">
                <div className="cabinet-tasks-list-head">
                  <h2>Витрати</h2>
                  <div className="cabinet-tasks-list-actions">
                    <Select
                      className="cabinet-tasks-sort"
                      size="m"
                      shape="pill"
                      value={sortMode}
                      onChange={(e) =>
                        setSortMode(e.target.value as SortMode)
                      }
                      aria-label="Сортування"
                    >
                      <option value="recent">Недавно додані зверху</option>
                      <option value="amount">За сумою</option>
                      <option value="alpha">За алфавітом</option>
                    </Select>
                    <Button
                      type="button"
                      tone="ink"
                      size="s"
                      className="cabinet-budget-add-btn"
                      onClick={openCreate}
                    >
                      Внести витрату
                    </Button>
                  </div>
                </div>

                {visible.length === 0 ? (
                  <p className="cabinet-tasks-empty">
                    Немає витрат у цьому фільтрі.
                  </p>
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
                            <span className="cabinet-budget-title">
                              {item.title}
                            </span>
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
                            <span className="cabinet-budget-meta">
                              <span className="cabinet-budget-cat">
                                {catLabel}
                              </span>
                              <span className="cabinet-budget-date">
                                {formatShortDate(item.createdAt)}
                              </span>
                              <BudgetPayerAvatar
                                payer={item.payer}
                                ownerName={ownerName}
                                partnerName={partnerName}
                                title={payerLabels[item.payer]}
                              />
                            </span>
                            <div className="cabinet-ctx-menu-wrap">
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
                                <IconMore />
                              </button>
                              {menuOpenId === item.id ? (
                                <CabinetContextMenu>
                                  <CabinetContextMenuItem
                                    icon={<IconEdit />}
                                    disabled={busy}
                                    onClick={() => openEdit(item)}
                                  >
                                    Редагувати
                                  </CabinetContextMenuItem>
                                  <CabinetContextMenuItem
                                    disabled={busy}
                                    onClick={() => void onTogglePaid(item)}
                                  >
                                    {item.paid
                                      ? "Позначити як заплановано"
                                      : "Позначити як сплачене"}
                                  </CabinetContextMenuItem>
                                  <CabinetContextMenuItem
                                    icon={<IconTrash />}
                                    danger
                                    disabled={busy}
                                    onClick={() => requestDelete(item)}
                                  >
                                    Видалити
                                  </CabinetContextMenuItem>

                                  <CabinetContextMenuDivider />
                                  <CabinetContextMenuLabel>
                                    Хто оплачує
                                  </CabinetContextMenuLabel>

                                  <CabinetContextMenuItem
                                    icon={
                                      <ResponsibleAvatar
                                        name={ownerName}
                                        tone="owner"
                                      />
                                    }
                                    active={item.payer === "owner"}
                                    disabled={busy}
                                    onClick={() =>
                                      void onSetPayer(item, "owner")
                                    }
                                  >
                                    {ownerName}
                                  </CabinetContextMenuItem>
                                  <CabinetContextMenuItem
                                    icon={
                                      <ResponsibleAvatar
                                        name={partnerName}
                                        tone="partner"
                                      />
                                    }
                                    active={item.payer === "partner"}
                                    disabled={busy}
                                    onClick={() =>
                                      void onSetPayer(item, "partner")
                                    }
                                  >
                                    {partnerName}
                                  </CabinetContextMenuItem>
                                  <CabinetContextMenuItem
                                    icon={
                                      <ResponsibleAvatarDuo
                                        ownerName={ownerName}
                                        partnerName={partnerName}
                                        aria-hidden
                                      />
                                    }
                                    active={item.payer === "couple"}
                                    disabled={busy}
                                    onClick={() =>
                                      void onSetPayer(item, "couple")
                                    }
                                  >
                                    Обоє
                                  </CabinetContextMenuItem>
                                  <CabinetContextMenuItem
                                    icon={
                                      <ResponsibleAvatar
                                        name={ownerName}
                                        tone="parents_owner"
                                      />
                                    }
                                    active={item.payer === "parents_owner"}
                                    disabled={busy}
                                    onClick={() =>
                                      void onSetPayer(item, "parents_owner")
                                    }
                                  >
                                    {payerLabels.parents_owner}
                                  </CabinetContextMenuItem>
                                  <CabinetContextMenuItem
                                    icon={
                                      <ResponsibleAvatar
                                        name={partnerName}
                                        tone="parents_partner"
                                      />
                                    }
                                    active={item.payer === "parents_partner"}
                                    disabled={busy}
                                    onClick={() =>
                                      void onSetPayer(item, "parents_partner")
                                    }
                                  >
                                    {payerLabels.parents_partner}
                                  </CabinetContextMenuItem>
                                </CabinetContextMenu>
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

      {filtersMounted ? (
        <div
          className={`cabinet-tasks-filters-sheet${
            filtersVisible ? " is-open" : ""
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Фільтри"
        >
          <button
            type="button"
            className="cabinet-tasks-filters-sheet__backdrop"
            aria-label="Закрити фільтри"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="cabinet-tasks-filters-sheet__panel">
            <div className="cabinet-tasks-filters-sheet__head">
              <h2 className="cabinet-tasks-filters-sheet__title">Фільтри</h2>
              <button
                type="button"
                className="cabinet-tasks-filters-sheet__close"
                aria-label="Закрити"
                onClick={() => setFiltersOpen(false)}
              >
                <IconClose size={18} />
              </button>
            </div>

            <div className="cabinet-tasks-filters-sheet__body">
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
                active={draftStatus}
                onChange={(id) => setDraftStatus(id as StatusFilter)}
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
                active={draftCategory}
                onChange={(id) => setDraftCategory(id as CategoryFilter)}
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
                active={draftPayer}
                onChange={(id) => setDraftPayer(id as PayerFilter)}
              />
            </div>

            <div className="cabinet-tasks-filters-sheet__foot">
              <button
                type="button"
                className="cabinet-tasks-filters-sheet__apply"
                onClick={applyDraftFilters}
              >
                Застосувати
              </button>
              <button
                type="button"
                className="cabinet-tasks-filters-sheet__reset"
                onClick={resetDraftFilters}
              >
                Скинути фільтри
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {drawerMounted ? (
        <div
          className={`cabinet-drawer-root${drawerVisible ? " is-open" : ""}`}
        >
          <button
            type="button"
            className="cabinet-drawer-backdrop"
            aria-label="Закрити"
            onClick={() => {
              setDrawerOpen(false);
              resetDrawer();
            }}
          />
          <aside
            className="cabinet-drawer cabinet-budget-drawer"
            aria-label={editingId ? "Редагувати витрату" : "Внести витрату"}
          >
            <div className="cabinet-drawer-head">
              <h2>{editingId ? "Редагувати витрату" : "Внести витрату"}</h2>
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
              <TextInput
                label={
                  <>
                    Що ви оплатили <em>*</em>
                  </>
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Наприклад: Пробна зачіска"
                required
              />

              <div className="cabinet-budget-amount-row">
                <TextInput
                  label={
                    <>
                      Сума <em>*</em>
                    </>
                  }
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Внесіть суму"
                  inputMode="decimal"
                  required
                />
                <Select
                  label="Оберіть валюту"
                  value={formCurrency}
                  onChange={(e) => setFormCurrency(e.target.value as Currency)}
                >
                  <option value="UAH">грн</option>
                  <option value="USD">$ Долари</option>
                </Select>
              </div>

              <Select
                label="Оберіть категорію"
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
              </Select>

              {category === "vendors" ? (
                <Select
                  label={
                    <>
                      Оберіть підрядника <em>*</em>
                    </>
                  }
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
                </Select>
              ) : null}

              <Select
                label={
                  <>
                    Статус <em>*</em>
                  </>
                }
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "planned" | "paid" | "")
                }
                required
              >
                <option value="">Обрати статус</option>
                <option value="planned">Заплановано</option>
                <option value="paid">Сплачено</option>
              </Select>

              <Select
                label="Хто оплачує"
                value={formPayer}
                onChange={(e) => setFormPayer(e.target.value as MenuPayer)}
              >
                <option value="owner">{ownerName}</option>
                <option value="partner">{partnerName}</option>
                <option value="couple">Обоє</option>
                <option value="parents_owner">
                  {payerLabels.parents_owner}
                </option>
                <option value="parents_partner">
                  {payerLabels.parents_partner}
                </option>
              </Select>

              <div className="cabinet-drawer-actions">
                <Button
                  type="button"
                  tone="ghost"
                  size="m"
                  className="cabinet-drawer-cancel"
                  onClick={() => {
                    setDrawerOpen(false);
                    resetDrawer();
                  }}
                >
                  Скасувати
                </Button>
                <Button
                  type="submit"
                  tone="ink"
                  size="m"
                  className="cabinet-budget-save"
                  disabled={busy}
                  loading={busy}
                  loadingText="…"
                >
                  Зберегти
                </Button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}

      {deleteTarget ? (
        <div
          className="cabinet-modal-root"
          role="dialog"
          aria-modal="true"
          aria-label="Видалити витрату"
        >
          <button
            type="button"
            className="cabinet-modal-backdrop"
            aria-label="Закрити"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="cabinet-modal cabinet-confirm-modal">
            <div className="cabinet-modal-head">
              <div>
                <h2>Видалити витрату</h2>
                <p>Ви впевнені, що хочете видалити цю витрату?</p>
              </div>
              <button
                type="button"
                className="cabinet-modal-close"
                aria-label="Закрити"
                onClick={() => setDeleteTarget(null)}
              >
                ×
              </button>
            </div>
            <div className="cabinet-modal-actions">
              <Button
                type="button"
                tone="ghost"
                size="m"
                className="cabinet-drawer-cancel"
                onClick={() => setDeleteTarget(null)}
                disabled={busy}
              >
                Скасувати
              </Button>
              <Button
                type="button"
                tone="ink"
                size="m"
                className="cabinet-confirm-delete"
                loading={busy}
                loadingText="…"
                onClick={() => void confirmDelete()}
              >
                Так, видалити
              </Button>
            </div>
          </div>
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
    <RequireAuth roles={["COUPLE"]}>
      <BudgetInner />
    </RequireAuth>
  );
}
