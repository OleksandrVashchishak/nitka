"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { PageLoader } from "@/components/ui-loader";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
import { CabinetProfileMenu } from "@/components/cabinet-profile-menu";
import {
  IconClose,
  IconFilters,
  IconQuickAdd,
} from "@/components/cabinet-task-icons";
import { IconMore } from "@/components/icon-more";
import { RequireAuth } from "@/components/require-auth";
import {
  createGuest,
  deleteGuest,
  getGuestList,
  importGuests,
  updateGuest,
  type Guest,
  type GuestListResponse,
  type GuestSide,
  type RsvpStatus,
} from "@/lib/guests-api";
import { getMyWedding } from "@/lib/dashboard-api";
import {
  getNotificationsSummary,
  type NotificationsSummary,
} from "@/lib/notifications-api";
import { useAuthStore } from "@/lib/auth-store";
import { toast } from "@/lib/toast";
import "../app/couple-cabinet.css";

type SideFilter = "all" | "BRIDE" | "GROOM";
type InviteFilter = "all" | "not_invited" | "invited";
type RsvpFilter = "all" | RsvpStatus;
type AgeFilter = "all" | "adult" | "child";
type SortMode = "recent" | "alpha" | "rsvp";

type InviteMethod =
  | "phone"
  | "telegram"
  | "messenger"
  | "viber"
  | "email"
  | "meet"
  | "other";

const PAGE_SIZE = 12;

const INVITE_METHODS: Array<{ id: InviteMethod; label: string }> = [
  { id: "phone", label: "Телефоном" },
  { id: "telegram", label: "Telegram" },
  { id: "messenger", label: "Messenger" },
  { id: "viber", label: "Viber" },
  { id: "email", label: "Email" },
  { id: "meet", label: "При зустрічі" },
  { id: "other", label: "Інше" },
];

const RSVP_UI: Record<
  RsvpStatus,
  { label: string; tone: "yes" | "no" | "maybe" | "pending" }
> = {
  YES: { label: "Прийде", tone: "yes" },
  NO: { label: "Відмова", tone: "no" },
  MAYBE: { label: "Можливо прийде", tone: "maybe" },
  PENDING: { label: "Ще не відповіли", tone: "pending" },
};

function isChild(guest: Guest) {
  return (guest.notes ?? "").includes("[child]");
}

function isInvited(guest: Guest) {
  if ((guest.notes ?? "").includes("[invited]")) return true;
  return Boolean(guest.phone || guest.email || guest.respondedAt);
}

function buildNotes(input: {
  child: boolean;
  invited: boolean;
  method: InviteMethod;
  extra?: string | null;
}) {
  const parts: string[] = [];
  if (input.child) parts.push("[child]");
  if (input.invited) parts.push("[invited]");
  parts.push(`invite:${input.method}`);
  const extra = input.extra?.replace(/\[child\]|\[invited\]|invite:\w+/g, "").trim();
  if (extra) parts.push(extra);
  return parts.join(" ").trim() || null;
}

function parseInviteMethod(notes: string | null): InviteMethod {
  const match = notes?.match(/invite:(\w+)/);
  const id = match?.[1];
  if (INVITE_METHODS.some((item) => item.id === id)) {
    return id as InviteMethod;
  }
  return "phone";
}

function firstName(value: string) {
  return value.trim().split(/\s+/)[0] || "";
}

function GuestsInner() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<GuestListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<NotificationsSummary | null>(null);
  const [partnerInitials, setPartnerInitials] = useState("П");
  const [ownerName, setOwnerName] = useState("Наречена");
  const [partnerName, setPartnerName] = useState("Наречений");

  const [sideFilter, setSideFilter] = useState<SideFilter>("all");
  const [inviteFilter, setInviteFilter] = useState<InviteFilter>("all");
  const [rsvpFilter, setRsvpFilter] = useState<RsvpFilter>("all");
  const [ageFilter, setAgeFilter] = useState<AgeFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filtersMounted, setFiltersMounted] = useState(false);
  const [draftSide, setDraftSide] = useState<SideFilter>("all");
  const [draftInvite, setDraftInvite] = useState<InviteFilter>("all");
  const [draftRsvp, setDraftRsvp] = useState<RsvpFilter>("all");
  const [draftAge, setDraftAge] = useState<AgeFilter>("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [plusOne, setPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");
  const [side, setSide] = useState<GuestSide | "">("");
  const [method, setMethod] = useState<InviteMethod>("phone");
  const [phone, setPhone] = useState("");
  const [inviteStatus, setInviteStatus] = useState<"not_invited" | "invited">(
    "not_invited",
  );
  const [isChildGuest, setIsChildGuest] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setData(await getGuestList());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка завантаження");
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
        const oneRaw =
          wedding?.partnerOneName?.trim() || user?.name?.trim() || "";
        const twoRaw = wedding?.partnerTwoName?.trim() || "";
        const one = oneRaw.charAt(0).toUpperCase() || "П";
        const two = twoRaw.charAt(0).toUpperCase();
        setPartnerInitials(two ? `${one}&${two}` : one);
        setOwnerName(firstName(oneRaw) || "Наречена");
        setPartnerName(firstName(twoRaw) || "Наречений");
      })
      .catch(() => undefined);
  }, [user?.name]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [sideFilter, inviteFilter, rsvpFilter, ageFilter, sortMode]);

  useEffect(() => {
    if (!filtersOpen) {
      setFiltersVisible(false);
      const timer = window.setTimeout(() => setFiltersMounted(false), 320);
      return () => window.clearTimeout(timer);
    }

    setDraftSide(sideFilter);
    setDraftInvite(inviteFilter);
    setDraftRsvp(rsvpFilter);
    setDraftAge(ageFilter);
    setFiltersMounted(true);
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setFiltersVisible(true));
    });
    return () => window.cancelAnimationFrame(id);
    // Sync draft only when opening the sheet.
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
    // resetDrawer is stable enough for Escape close
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

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

  const guests = data?.guests ?? [];

  const counts = useMemo(() => {
    const sideCounts = {
      all: guests.length,
      BRIDE: guests.filter((g) => g.side === "BRIDE").length,
      GROOM: guests.filter((g) => g.side === "GROOM").length,
    };
    const invite = {
      all: guests.length,
      not_invited: guests.filter((g) => !isInvited(g)).length,
      invited: guests.filter((g) => isInvited(g)).length,
    };
    const rsvp = {
      all: guests.length,
      YES: guests.filter((g) => g.rsvpStatus === "YES").length,
      NO: guests.filter((g) => g.rsvpStatus === "NO").length,
      MAYBE: guests.filter((g) => g.rsvpStatus === "MAYBE").length,
      PENDING: guests.filter((g) => g.rsvpStatus === "PENDING").length,
    };
    const age = {
      all: guests.length,
      adult: guests.filter((g) => !isChild(g)).length,
      child: guests.filter((g) => isChild(g)).length,
    };
    return { side: sideCounts, invite, rsvp, age };
  }, [guests]);

  const filtered = useMemo(() => {
    const list = guests.filter((guest) => {
      if (sideFilter !== "all" && guest.side !== sideFilter) return false;
      if (inviteFilter === "invited" && !isInvited(guest)) return false;
      if (inviteFilter === "not_invited" && isInvited(guest)) return false;
      if (rsvpFilter !== "all" && guest.rsvpStatus !== rsvpFilter) return false;
      if (ageFilter === "child" && !isChild(guest)) return false;
      if (ageFilter === "adult" && isChild(guest)) return false;
      return true;
    });

    return list.sort((a, b) => {
      if (sortMode === "alpha") return a.name.localeCompare(b.name, "uk");
      if (sortMode === "rsvp") {
        const order: Record<RsvpStatus, number> = {
          YES: 0,
          MAYBE: 1,
          PENDING: 2,
          NO: 3,
        };
        const diff = order[a.rsvpStatus] - order[b.rsvpStatus];
        if (diff !== 0) return diff;
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [guests, sideFilter, inviteFilter, rsvpFilter, ageFilter, sortMode]);

  const visible = filtered.slice(0, visibleCount);

  const activeFilterCount = [
    sideFilter !== "all",
    inviteFilter !== "all",
    rsvpFilter !== "all",
    ageFilter !== "all",
  ].filter(Boolean).length;
  const filtersActive = activeFilterCount > 0;

  function applyDraftFilters() {
    setSideFilter(draftSide);
    setInviteFilter(draftInvite);
    setRsvpFilter(draftRsvp);
    setAgeFilter(draftAge);
    setFiltersOpen(false);
  }

  function resetDraftFilters() {
    setDraftSide("all");
    setDraftInvite("all");
    setDraftRsvp("all");
    setDraftAge("all");
  }

  function resetDrawer() {
    setEditingId(null);
    setName("");
    setPlusOne(false);
    setPlusOneName("");
    setSide("");
    setMethod("phone");
    setPhone("");
    setInviteStatus("not_invited");
    setIsChildGuest(false);
  }

  function openCreate() {
    resetDrawer();
    setDrawerOpen(true);
  }

  function openEdit(guest: Guest) {
    setEditingId(guest.id);
    setName(guest.name);
    setPlusOne(guest.plusOne);
    setPlusOneName(guest.plusOneName ?? "");
    setSide(guest.side === "OTHER" ? "BOTH" : guest.side);
    setMethod(parseInviteMethod(guest.notes));
    setPhone(guest.phone ?? "");
    setInviteStatus(isInvited(guest) ? "invited" : "not_invited");
    setIsChildGuest(isChild(guest));
    setMenuOpenId(null);
    setDrawerOpen(true);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    const nextName = name.trim();
    if (nextName.length < 2) {
      toast.error("Вкажи імʼя гостя");
      return;
    }
    setBusy(true);
    try {
      const invited = inviteStatus === "invited";
      const payload = {
        name: nextName,
        side: (side || "BOTH") as GuestSide,
        phone: phone.trim() || undefined,
        plusOne,
        plusOneName: plusOne ? plusOneName.trim() || undefined : undefined,
        notes: buildNotes({
          child: isChildGuest,
          invited,
          method,
        }) ?? undefined,
      };

      if (editingId) {
        const updated = await updateGuest(editingId, payload);
        setData((prev) =>
          prev
            ? {
                ...prev,
                guests: prev.guests.map((g) =>
                  g.id === updated.id ? updated : g,
                ),
              }
            : prev,
        );
        toast.success("Оновлено", nextName);
      } else {
        const created = await createGuest(payload);
        setData((prev) =>
          prev
            ? {
                ...prev,
                guests: [created, ...prev.guests],
                stats: {
                  ...prev.stats,
                  total: prev.stats.total + 1,
                  pending: prev.stats.pending + 1,
                  headcount: prev.stats.headcount + 1 + (plusOne ? 1 : 0),
                },
              }
            : prev,
        );
        toast.success("Додано", nextName);
      }
      setDrawerOpen(false);
      resetDrawer();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : editingId
            ? "Не оновлено"
            : "Не додано",
      );
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(guest: Guest) {
    if (!confirm(`Видалити «${guest.name}»?`)) return;
    setBusy(true);
    try {
      await deleteGuest(guest.id);
      setData((prev) =>
        prev
          ? {
              ...prev,
              guests: prev.guests.filter((g) => g.id !== guest.id),
              stats: {
                ...prev.stats,
                total: Math.max(0, prev.stats.total - 1),
              },
            }
          : prev,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не видалено");
    } finally {
      setBusy(false);
      setMenuOpenId(null);
    }
  }

  async function onSetSide(guest: Guest, nextSide: GuestSide) {
    if (guest.side === nextSide) {
      setMenuOpenId(null);
      return;
    }
    setBusy(true);
    try {
      const updated = await updateGuest(guest.id, {
        name: guest.name,
        side: nextSide,
      });
      setData((prev) =>
        prev
          ? {
              ...prev,
              guests: prev.guests.map((g) => (g.id === updated.id ? updated : g)),
            }
          : prev,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не оновлено");
    } finally {
      setBusy(false);
      setMenuOpenId(null);
    }
  }

  async function onImportCsv(file: File) {
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const rows = lines
      .slice(1)
      .map((line) => {
        const [guestName, phoneValue, sideValue] = line.split(/[,;]/);
        if (!guestName?.trim()) return null;
        const sideRaw = sideValue?.trim().toUpperCase();
        const nextSide: GuestSide =
          sideRaw === "BRIDE" || sideRaw === "GROOM" || sideRaw === "BOTH"
            ? sideRaw
            : "BOTH";
        return {
          name: guestName.trim(),
          phone: phoneValue?.trim() || undefined,
          side: nextSide,
        };
      })
      .filter(Boolean) as Array<{
      name: string;
      phone?: string;
      side: GuestSide;
    }>;

    if (rows.length === 0) {
      toast.error("У CSV немає рядків з іменами");
      return;
    }

    setBusy(true);
    try {
      await importGuests(rows);
      await load();
      toast.success("Імпортовано", `${rows.length} гостей`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Імпорт не вдався");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <PageLoader label="Завантажуємо гостей…" />;
  }

  if (!data) {
    return (
      <div className="cabinet-tasks-page">
        <div className="cabinet-tasks-top">
          <h1 className="cabinet-tasks-title">Гості</h1>
        </div>
        <div className="cabinet-panel" style={{ marginTop: 24 }}>
          <p style={{ margin: 0, color: "#666" }}>
            Спочатку збережи дату весілля в огляді — тоді відкриється список гостей.
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
        <h1 className="cabinet-tasks-title">
          Гості
          {guests.length > 0 ? (
            <span className="cabinet-guests-title-count">
              {" "}
              ({filtered.length})
            </span>
          ) : null}
        </h1>
        <div className="cabinet-tasks-top-actions">
          {guests.length > 0 ? (
            <button
              type="button"
              className="cabinet-tasks-quick-add"
              aria-label="Додати гостя"
              onClick={openCreate}
            >
              <IconQuickAdd />
            </button>
          ) : null}
          <div className="cabinet-overview-actions cabinet-tasks-desktop-actions">
            <CabinetNotificationsBell summary={summary} />
            <CabinetProfileMenu initials={partnerInitials} />
          </div>
        </div>
      </div>

      {error ? <p className="cabinet-tasks-error">{error}</p> : null}

      {guests.length === 0 ? (
        <div className="cabinet-guests-empty">
          <div className="cabinet-guests-empty-glow" aria-hidden />
          <GuestsEmptyArt />
          <h2>Внесіть своїх перших гостей</h2>
          <p>
            Єдиний список гостей для вас обох. Всі контакти, статуси запрошень,
            деталі щодо гостей — в одному місці.
          </p>
          <p>Додайте гостей вручну або імпортуйте список із CSV файлу</p>
          <div className="cabinet-guests-empty-actions">
            <button
              type="button"
              className="cabinet-empty-cta"
              onClick={openCreate}
            >
              Додати гостей
            </button>
            <button
              type="button"
              className="cabinet-guests-import-btn"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
            >
              Імпорт CSV
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onImportCsv(file);
              e.target.value = "";
            }}
          />
        </div>
      ) : (
        <>
          <div className="cabinet-tasks-mobile-bar">
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
            <label className="cabinet-tasks-chip cabinet-tasks-chip--select">
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                aria-label="Сортування"
              >
                <option value="recent">Недавно додані</option>
                <option value="alpha">За алфавітом</option>
                <option value="rsvp">За відповіддю</option>
              </select>
            </label>
          </div>

          <div className="cabinet-tasks-layout">
            <aside className="cabinet-tasks-filters">
              <FilterGroup
                title="Чиї гості"
                items={[
                  { id: "all", label: "Всі", count: counts.side.all },
                  {
                    id: "BRIDE",
                    label: "Гості нареченої",
                    count: counts.side.BRIDE,
                  },
                  {
                    id: "GROOM",
                    label: "Гості нареченого",
                    count: counts.side.GROOM,
                  },
                ]}
                active={sideFilter}
                onChange={(id) => setSideFilter(id as SideFilter)}
              />
              <FilterGroup
                title="Статус запрошення"
                items={[
                  { id: "all", label: "Всі", count: counts.invite.all },
                  {
                    id: "not_invited",
                    label: "Не запрошені",
                    count: counts.invite.not_invited,
                  },
                  {
                    id: "invited",
                    label: "Запрошені",
                    count: counts.invite.invited,
                  },
                ]}
                active={inviteFilter}
                onChange={(id) => setInviteFilter(id as InviteFilter)}
              />
              <FilterGroup
                title="Результат запрошення"
                items={[
                  { id: "all", label: "Усі", count: counts.rsvp.all },
                  { id: "YES", label: "Прийдуть", count: counts.rsvp.YES },
                  { id: "NO", label: "Відмовили", count: counts.rsvp.NO },
                  {
                    id: "MAYBE",
                    label: "Можливо прийдуть",
                    count: counts.rsvp.MAYBE,
                  },
                  {
                    id: "PENDING",
                    label: "Ще не відповіли",
                    count: counts.rsvp.PENDING,
                  },
                ]}
                active={rsvpFilter}
                onChange={(id) => setRsvpFilter(id as RsvpFilter)}
              />
              <FilterGroup
                title="Вік"
                items={[
                  { id: "all", label: "Усі", count: counts.age.all },
                  { id: "adult", label: "Дорослі", count: counts.age.adult },
                  { id: "child", label: "Діти", count: counts.age.child },
                ]}
                active={ageFilter}
                onChange={(id) => setAgeFilter(id as AgeFilter)}
              />
            </aside>

            <section className="cabinet-guest-list-panel">
              <div className="cabinet-tasks-list-head">
                <h2>
                  Список гостей{" "}
                  <span className="cabinet-guests-count">
                    ({filtered.length})
                  </span>
                </h2>
                <div className="cabinet-tasks-list-actions">
                  <label className="cabinet-tasks-sort">
                    <select
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value as SortMode)}
                    >
                      <option value="recent">Недавно додані</option>
                      <option value="alpha">За алфавітом</option>
                      <option value="rsvp">За відповіддю</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    className="cabinet-tasks-add-btn"
                    onClick={openCreate}
                  >
                    <span aria-hidden>+</span>
                    Додати гостей
                  </button>
                  <button
                    type="button"
                    className="cabinet-guests-import-btn"
                    onClick={() => fileRef.current?.click()}
                    disabled={busy}
                  >
                    Імпорт CSV
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,text/csv"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void onImportCsv(file);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>

              {visible.length === 0 ? (
                <p className="cabinet-tasks-empty">
                  Немає гостей у цьому фільтрі.
                </p>
              ) : (
                <ul className="cabinet-guests-list">
                  {visible.map((guest) => {
                    const ui = RSVP_UI[guest.rsvpStatus];
                    const mark =
                      guest.side === "GROOM"
                        ? "P"
                        : guest.side === "BRIDE"
                          ? "O"
                          : "G";
                    return (
                      <li
                        key={guest.id}
                        className={`cabinet-guest-row${
                          guest.rsvpStatus === "YES" ? " is-yes" : ""
                        }`}
                      >
                        <div className="cabinet-guest-main">
                          <p className="cabinet-guest-name">
                            <span className="cabinet-guest-name-text">
                              {guest.name}
                            </span>
                            {isChild(guest) ? (
                              <span
                                className="cabinet-guest-child"
                                title="Дитина"
                                aria-label="Дитина"
                              >
                                ☺
                              </span>
                            ) : null}
                          </p>
                        </div>
                        <div className="cabinet-guest-meta">
                          <span
                            className={`cabinet-guest-status is-${ui.tone}`}
                          >
                            <StatusIcon tone={ui.tone} />
                            {ui.label}
                          </span>
                          <span
                            className={`cabinet-task-who ${
                              guest.side === "GROOM"
                                ? "is-partner"
                                : "is-owner"
                            }`}
                          >
                            {mark}
                          </span>
                          <div className="cabinet-guest-menu-wrap">
                            <button
                              type="button"
                              className="cabinet-task-menu"
                              aria-label="Меню гостя"
                              aria-expanded={menuOpenId === guest.id}
                              onClick={() =>
                                setMenuOpenId((id) =>
                                  id === guest.id ? null : guest.id,
                                )
                              }
                            >
                              <IconMore />
                            </button>
                            {menuOpenId === guest.id ? (
                              <div className="cabinet-guest-menu" role="menu">
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="cabinet-guest-menu-item"
                                  disabled={busy}
                                  onClick={() => openEdit(guest)}
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
                                  className="cabinet-guest-menu-item is-danger"
                                  disabled={busy}
                                  onClick={() => void onDelete(guest)}
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
                                <p className="cabinet-guest-menu-label">
                                  з чиєї сторони
                                </p>

                                <button
                                  type="button"
                                  role="menuitem"
                                  className={`cabinet-guest-menu-item${
                                    guest.side === "BRIDE" ? " is-active" : ""
                                  }`}
                                  disabled={busy}
                                  onClick={() => void onSetSide(guest, "BRIDE")}
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
                                    guest.side === "GROOM" ? " is-active" : ""
                                  }`}
                                  disabled={busy}
                                  onClick={() => void onSetSide(guest, "GROOM")}
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
                                    guest.side === "BOTH" ? " is-active" : ""
                                  }`}
                                  disabled={busy}
                                  onClick={() => void onSetSide(guest, "BOTH")}
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
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
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
                title="Чиї гості"
                items={[
                  { id: "all", label: "Всі", count: counts.side.all },
                  {
                    id: "BRIDE",
                    label: "Гості нареченої",
                    count: counts.side.BRIDE,
                  },
                  {
                    id: "GROOM",
                    label: "Гості нареченого",
                    count: counts.side.GROOM,
                  },
                ]}
                active={draftSide}
                onChange={(id) => setDraftSide(id as SideFilter)}
              />
              <FilterGroup
                title="Статус запрошення"
                items={[
                  { id: "all", label: "Всі", count: counts.invite.all },
                  {
                    id: "not_invited",
                    label: "Не запрошені",
                    count: counts.invite.not_invited,
                  },
                  {
                    id: "invited",
                    label: "Запрошені",
                    count: counts.invite.invited,
                  },
                ]}
                active={draftInvite}
                onChange={(id) => setDraftInvite(id as InviteFilter)}
              />
              <FilterGroup
                title="Результат запрошення"
                items={[
                  { id: "all", label: "Усі", count: counts.rsvp.all },
                  { id: "YES", label: "Прийдуть", count: counts.rsvp.YES },
                  { id: "NO", label: "Відмовили", count: counts.rsvp.NO },
                  {
                    id: "MAYBE",
                    label: "Можливо прийдуть",
                    count: counts.rsvp.MAYBE,
                  },
                  {
                    id: "PENDING",
                    label: "Ще не відповіли",
                    count: counts.rsvp.PENDING,
                  },
                ]}
                active={draftRsvp}
                onChange={(id) => setDraftRsvp(id as RsvpFilter)}
              />
              <FilterGroup
                title="Вік"
                items={[
                  { id: "all", label: "Усі", count: counts.age.all },
                  { id: "adult", label: "Дорослі", count: counts.age.adult },
                  { id: "child", label: "Діти", count: counts.age.child },
                ]}
                active={draftAge}
                onChange={(id) => setDraftAge(id as AgeFilter)}
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
            className="cabinet-drawer"
            aria-label={editingId ? "Редагувати гостя" : "Додати гостя"}
          >
            <div className="cabinet-drawer-head">
              <h2>{editingId ? "Редагувати гостя" : "Додати гостя"}</h2>
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
                <span>Імʼя і прізвище</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Наприклад: Ліля Василенко"
                  required
                />
              </label>

              <button
                type="button"
                className={`cabinet-guests-plusone${plusOne ? " is-on" : ""}`}
                onClick={() => setPlusOne((v) => !v)}
              >
                + Додати +1
              </button>
              {plusOne ? (
                <label className="cabinet-drawer-field">
                  <span>Імʼя +1</span>
                  <input
                    value={plusOneName}
                    onChange={(e) => setPlusOneName(e.target.value)}
                    placeholder="Імʼя супутника"
                  />
                </label>
              ) : null}

              <label className="cabinet-drawer-field">
                <span>Сторона нареченого чи нареченої</span>
                <select
                  value={side}
                  onChange={(e) => setSide(e.target.value as GuestSide | "")}
                >
                  <option value="">Обрати сторону</option>
                  <option value="BRIDE">Гості нареченої</option>
                  <option value="GROOM">Гості нареченого</option>
                  <option value="BOTH">Спільні</option>
                </select>
              </label>

              <label className="cabinet-drawer-check">
                <input
                  type="checkbox"
                  checked={isChildGuest}
                  onChange={(e) => setIsChildGuest(e.target.checked)}
                />
                <span>Дитина</span>
              </label>

              <div className="cabinet-guests-invite-box">
                <p className="cabinet-filter-title">Запрошення</p>
                <p className="cabinet-drawer-field-label">Спосіб запрошення</p>
                <div className="cabinet-guests-methods">
                  {INVITE_METHODS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`cabinet-guests-method${
                        method === item.id ? " is-active" : ""
                      }`}
                      onClick={() => setMethod(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <label className="cabinet-drawer-field">
                  <span>Номер телефону</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+380"
                  />
                </label>
                <label className="cabinet-drawer-field">
                  <span>Статус</span>
                  <select
                    value={inviteStatus}
                    onChange={(e) =>
                      setInviteStatus(e.target.value as "not_invited" | "invited")
                    }
                  >
                    <option value="not_invited">Не запрошено</option>
                    <option value="invited">Запрошено</option>
                  </select>
                </label>
              </div>

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
                  className="cabinet-drawer-save"
                  disabled={busy || name.trim().length < 2}
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

function GuestsEmptyArt() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="cabinet-guests-empty-art"
      src="/cabinet/empty/guests.png"
      alt=""
      width={320}
      height={220}
      aria-hidden
    />
  );
}

function FilterGroup({
  title,
  items,
  active,
  onChange,
}: {
  title: string;
  items: Array<{ id: string; label: string; count: number }>;
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

function StatusIcon({ tone }: { tone: "yes" | "no" | "maybe" | "pending" }) {
  if (tone === "yes") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
        <path fill="currentColor" d="M6.2 11.4 2.8 8l1.1-1.1 2.3 2.3 5-5L12.3 5z" />
      </svg>
    );
  }
  if (tone === "no") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
        <path
          fill="currentColor"
          d="M4.2 3.1 3.1 4.2 6.9 8l-3.8 3.8 1.1 1.1L8 9.1l3.8 3.8 1.1-1.1L9.1 8l3.8-3.8-1.1-1.1L8 6.9 4.2 3.1z"
        />
      </svg>
    );
  }
  if (tone === "maybe") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6.2 6.2a1.8 1.8 0 1 1 2.5 1.6c-.5.3-.9.7-.9 1.4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="8" cy="11.4" r="0.9" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 4.5V8l2.2 1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GuestsPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <GuestsInner />
    </RequireAuth>
  );
}
