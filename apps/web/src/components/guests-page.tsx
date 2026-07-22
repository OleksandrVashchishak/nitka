"use client";

import { PageLoader } from "@/components/ui-loader";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createGuest,
  deleteGuest,
  getGuestList,
  updateGuest,
  type Guest,
  type GuestListResponse,
  type GuestSide,
  type RsvpStatus,
} from "@/lib/guests-api";
import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/require-auth";

const STATUS_LABEL: Record<RsvpStatus, string> = {
  PENDING: "Очікує",
  YES: "Йде",
  NO: "Не йде",
  MAYBE: "Можливо",
};

const SIDE_LABEL: Record<GuestSide, string> = {
  BRIDE: "Наречена",
  GROOM: "Наречений",
  BOTH: "Обидві сторони",
  OTHER: "Інше",
};

const FILTERS: Array<RsvpStatus | "ALL"> = [
  "ALL",
  "PENDING",
  "YES",
  "NO",
  "MAYBE",
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  side: "BOTH" as GuestSide,
  rsvpStatus: "PENDING" as RsvpStatus,
  plusOne: false,
  plusOneName: "",
  plusOneAttending: false,
  allergies: "",
  tableLabel: "",
  notes: "",
};

function GuestsInner() {
  const [data, setData] = useState<GuestListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RsvpStatus | "ALL">("ALL");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [needWedding, setNeedWedding] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    setNeedWedding(false);
    try {
      setData(await getGuestList());
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

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "ALL") return data.guests;
    return data.guests.filter((g) => g.rsvpStatus === filter);
  }, [data, filter]);

  function startEdit(guest: Guest) {
    setEditingId(guest.id);
    setForm({
      name: guest.name,
      email: guest.email ?? "",
      phone: guest.phone ?? "",
      side: guest.side,
      rsvpStatus: guest.rsvpStatus,
      plusOne: guest.plusOne,
      plusOneName: guest.plusOneName ?? "",
      plusOneAttending: guest.plusOneAttending === true,
      allergies: guest.allergies ?? "",
      tableLabel: guest.tableLabel ?? "",
      notes: guest.notes ?? "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        side: form.side,
        rsvpStatus: form.rsvpStatus,
        plusOne: form.plusOne,
        plusOneName: form.plusOne ? form.plusOneName || undefined : undefined,
        plusOneAttending: form.plusOne ? form.plusOneAttending : null,
        allergies: form.allergies || undefined,
        tableLabel: form.tableLabel || undefined,
        notes: form.notes || undefined,
      };

      if (editingId) {
        await updateGuest(editingId, payload);
      } else {
        await createGuest(payload);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не збережено");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setError(null);
    try {
      await deleteGuest(id);
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не видалено");
    }
  }

  async function onQuickStatus(guest: Guest, rsvpStatus: RsvpStatus) {
    try {
      await updateGuest(guest.id, { rsvpStatus });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  async function copyLink(guest: Guest) {
    const url = `${window.location.origin}/rsvp/${guest.inviteToken}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(guest.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError("Не вдалось скопіювати лінк");
    }
  }

  if (loading) {
    return <PageLoader label="Завантажуємо гостей…" />;
  }

  if (needWedding) {
    return (
      <>
        <DashboardNav variant="COUPLE" />
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
          Гості
        </h1>
        <div className="mt-6 rounded-2xl border border-line bg-mist px-6 py-10">
          <p className="text-ink-soft">
            Спочатку створи весілля (дата / місто) у кабінеті — і тоді можна
            збирати список гостей.
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

  const stats = data?.stats;

  return (
    <>
      <DashboardNav variant="COUPLE" />
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
        Гості & RSVP
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Веди список, став статуси, стіл і алергії. Кожному гостю можна дати
        персональне RSVP-посилання.
      </p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {stats ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {[
            { label: "Усього", value: stats.total },
            { label: "Йдуть", value: stats.yes },
            { label: "Можливо", value: stats.maybe },
            { label: "Не йдуть", value: stats.no },
            { label: "Очікують", value: stats.pending },
            { label: "Headcount", value: stats.headcount },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-line bg-mist px-4 py-4"
            >
              <p className="text-xs text-ink-soft">{item.label}</p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-3xl text-ink">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-line bg-white p-5 md:p-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
            {editingId ? "Редагувати гостя" : "Додати гостя"}
          </h2>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-ink-soft underline-offset-4 hover:underline"
            >
              Скасувати
            </button>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            required
            minLength={2}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Імʼя"
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="Email"
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="Телефон"
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
          <select
            value={form.side}
            onChange={(e) =>
              setForm((f) => ({ ...f, side: e.target.value as GuestSide }))
            }
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          >
            {Object.entries(SIDE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={form.rsvpStatus}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                rsvpStatus: e.target.value as RsvpStatus,
              }))
            }
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          >
            {Object.entries(STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            value={form.tableLabel}
            onChange={(e) =>
              setForm((f) => ({ ...f, tableLabel: e.target.value }))
            }
            placeholder="Стіл (напр. Стіл 5)"
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.plusOne}
            onChange={(e) =>
              setForm((f) => ({ ...f, plusOne: e.target.checked }))
            }
            className="size-4 accent-[var(--sage)]"
          />
          Дозволити +1
        </label>

        {form.plusOne ? (
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={form.plusOneName}
              onChange={(e) =>
                setForm((f) => ({ ...f, plusOneName: e.target.value }))
              }
              placeholder="Імʼя +1"
              className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
            />
            <label className="flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.plusOneAttending}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    plusOneAttending: e.target.checked,
                  }))
                }
                className="size-4 accent-[var(--sage)]"
              />
              +1 теж йде
            </label>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={form.allergies}
            onChange={(e) =>
              setForm((f) => ({ ...f, allergies: e.target.value }))
            }
            placeholder="Алергії / дієта"
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
          <input
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Нотатки"
            className="rounded-xl border border-line px-4 py-3 outline-none focus:border-sage"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep disabled:opacity-60"
        >
          {saving ? "Зберігаємо..." : editingId ? "Оновити" : "Додати гостя"}
        </button>
      </form>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={
              filter === item
                ? "rounded-full bg-sage px-4 py-2 text-sm font-medium text-white"
                : "rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-soft hover:border-sage/40"
            }
          >
            {item === "ALL" ? "Усі" : STATUS_LABEL[item]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-ink-soft">Поки немає гостей у цьому фільтрі.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {filtered.map((guest) => (
            <li
              key={guest.id}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl text-ink">
                    {guest.name}
                    {guest.plusOne ? (
                      <span className="ml-2 text-base text-ink-soft">
                        +1
                        {guest.plusOneName ? ` (${guest.plusOneName})` : ""}
                      </span>
                    ) : null}
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">
                    {SIDE_LABEL[guest.side]}
                    {guest.tableLabel ? ` · ${guest.tableLabel}` : ""}
                    {guest.email ? ` · ${guest.email}` : ""}
                  </p>
                  {guest.allergies ? (
                    <p className="mt-2 text-sm text-ink">
                      Алергії: {guest.allergies}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-full bg-mist px-3 py-1 text-sm text-sage-deep">
                  {STATUS_LABEL[guest.rsvpStatus]}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(["YES", "MAYBE", "NO", "PENDING"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => void onQuickStatus(guest, status)}
                    className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-sage/40"
                  >
                    {STATUS_LABEL[status]}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => void copyLink(guest)}
                  className="rounded-full bg-sage px-3 py-1.5 text-xs font-medium text-white hover:bg-sage-deep"
                >
                  {copiedId === guest.id ? "Скопійовано" : "RSVP лінк"}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(guest)}
                  className="rounded-full border border-line px-3 py-1.5 text-xs text-ink hover:border-sage/40"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void onDelete(guest.id)}
                  className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-red-300"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function GuestsPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <GuestsInner />
        </div>
      </section>
    </RequireAuth>
  );
}
