"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { PageLoader } from "@/components/ui-loader";
import { CabinetNotificationsBell } from "@/components/cabinet-notifications";
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
  PENDING: { label: "Ще немає відповіді", tone: "pending" },
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

  const [sideFilter, setSideFilter] = useState<SideFilter>("all");
  const [inviteFilter, setInviteFilter] = useState<InviteFilter>("all");
  const [rsvpFilter, setRsvpFilter] = useState<RsvpFilter>("all");
  const [ageFilter, setAgeFilter] = useState<AgeFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [drawerOpen, setDrawerOpen] = useState(false);
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
        const one =
          wedding?.partnerOneName?.trim().charAt(0).toUpperCase() ||
          user?.name?.trim().charAt(0).toUpperCase() ||
          "П";
        const two = wedding?.partnerTwoName?.trim().charAt(0).toUpperCase() || "";
        setPartnerInitials(two ? `${one}&${two}` : one);
      })
      .catch(() => undefined);
  }, [user?.name]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [sideFilter, inviteFilter, rsvpFilter, ageFilter, sortMode]);

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

  function resetDrawer() {
    setName("");
    setPlusOne(false);
    setPlusOneName("");
    setSide("");
    setMethod("phone");
    setPhone("");
    setInviteStatus("not_invited");
    setIsChildGuest(false);
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
      const created = await createGuest({
        name: nextName,
        side: side || "BOTH",
        phone: phone.trim() || undefined,
        plusOne,
        plusOneName: plusOne ? plusOneName.trim() || undefined : undefined,
        notes: buildNotes({
          child: isChildGuest,
          invited,
          method,
        }) ?? undefined,
      });
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
      setDrawerOpen(false);
      resetDrawer();
      toast.success("Додано", nextName);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не додано");
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

  async function onSetRsvp(guest: Guest, status: RsvpStatus) {
    setBusy(true);
    try {
      const updated = await updateGuest(guest.id, {
        name: guest.name,
        rsvpStatus: status,
      });
      setData((prev) =>
        prev
          ? {
              ...prev,
              guests: prev.guests.map((g) => (g.id === guest.id ? updated : g)),
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
        <h1 className="cabinet-tasks-title">Гості</h1>
        <div className="cabinet-overview-actions">
          <CabinetNotificationsBell summary={summary} />
          <Link href="/website" className="cabinet-profile" aria-label="Профіль пари">
            <span className="cabinet-profile-avatar">{partnerInitials}</span>
            <span aria-hidden>▾</span>
          </Link>
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
              className="cabinet-tasks-add-btn"
              onClick={() => setDrawerOpen(true)}
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
      <div className="cabinet-tasks-layout" style={{ marginTop: 24 }}>
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

        <section className="cabinet-panel cabinet-tasks-list-panel">
          <div className="cabinet-tasks-list-head">
            <h2>
              Список гостей{" "}
              <span className="cabinet-guests-count">({filtered.length})</span>
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
                onClick={() => setDrawerOpen(true)}
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
            <p className="cabinet-tasks-empty">Немає гостей у цьому фільтрі.</p>
          ) : (
            <ul className="cabinet-guests-list">
              {visible.map((guest) => {
                const ui = RSVP_UI[guest.rsvpStatus];
                const mark =
                  guest.side === "GROOM" ? "P" : guest.side === "BRIDE" ? "O" : "G";
                return (
                  <li
                    key={guest.id}
                    className={`cabinet-guest-row${
                      guest.rsvpStatus === "YES" ? " is-yes" : ""
                    }`}
                  >
                    <div className="cabinet-guest-main">
                      <p className="cabinet-guest-name">
                        {guest.name}
                        {isChild(guest) ? (
                          <span className="cabinet-guest-child" title="Дитина" aria-label="Дитина">
                            ☺
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <div className="cabinet-guest-meta">
                      <span className={`cabinet-guest-status is-${ui.tone}`}>
                        <StatusIcon tone={ui.tone} />
                        {ui.label}
                      </span>
                      <span
                        className={`cabinet-task-who ${
                          guest.side === "GROOM" ? "is-partner" : "is-owner"
                        }`}
                      >
                        {mark}
                      </span>
                      <div className="cabinet-guest-menu-wrap">
                        <button
                          type="button"
                          className="cabinet-task-menu"
                          aria-label="Меню гостя"
                          onClick={() =>
                            setMenuOpenId((id) => (id === guest.id ? null : guest.id))
                          }
                        >
                          ⋯
                        </button>
                        {menuOpenId === guest.id ? (
                          <div className="cabinet-guest-menu">
                            {(
                              [
                                ["YES", "Прийде"],
                                ["MAYBE", "Можливо"],
                                ["NO", "Відмова"],
                                ["PENDING", "Без відповіді"],
                              ] as const
                            ).map(([status, label]) => (
                              <button
                                key={status}
                                type="button"
                                disabled={busy}
                                onClick={() => void onSetRsvp(guest, status)}
                              >
                                {label}
                              </button>
                            ))}
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void onDelete(guest)}
                            >
                              Видалити
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
          <aside className="cabinet-drawer" aria-label="Додати гостя">
            <div className="cabinet-drawer-head">
              <h2>Додати гостя</h2>
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
    <svg
      className="cabinet-guests-empty-art"
      viewBox="0 0 280 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M28 48c18-22 42-28 70-18 20 8 34 6 52-6 22-14 48-10 70 8"
        stroke="#1a1a1a"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M40 40c10-16 28-22 44-10M210 36c12-14 28-16 42-4"
        stroke="#1a1a1a"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {[52, 78, 104, 130, 156, 182, 208].map((x) => (
        <g key={x}>
          <path d={`M${x} 48v10`} stroke="#1a1a1a" strokeWidth="1.2" />
          <circle cx={x} cy="62" r="4" fill="#ff4200" opacity="0.85" />
          <circle cx={x} cy="62" r="8" fill="#ff4200" opacity="0.18" />
        </g>
      ))}
      <rect x="36" y="88" width="208" height="10" rx="2" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d="M44 98v18M72 98v18M100 98v18M128 98v18M156 98v18M184 98v18M212 98v18M236 98v18" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      {[50, 78, 106, 134, 162, 190].map((x) => (
        <path
          key={`chair-${x}`}
          d={`M${x} 78h18v10H${x}z M${x + 3} 88v10 M${x + 15} 88v10`}
          stroke="#1a1a1a"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      ))}
    </svg>
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
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5V8l2.2 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
