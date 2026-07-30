"use client";

import { PageLoader } from "@/components/ui-loader";
import Link from "next/link";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
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
import { DashboardNav } from "@/components/dashboard-nav";
import { InviteShareLinks } from "@/components/invite-share-links";
import { RequireAuth } from "@/components/require-auth";
import { toast } from "@/lib/toast";

type ViewMode = "sides" | "alpha" | "table";

const STATUS_LABEL: Record<RsvpStatus, string> = {
  PENDING: "Очікує",
  YES: "Йде",
  NO: "Не йде",
  MAYBE: "Можливо",
};

const SIDE_LABEL: Record<GuestSide, string> = {
  BRIDE: "Наречена",
  GROOM: "Наречений",
  BOTH: "Спільні",
  OTHER: "Інше",
};

const STATUS_BTN: Record<RsvpStatus, { idle: string; active: string }> = {
  PENDING: {
    idle: "border-line text-ink-soft hover:border-ink/30 hover:bg-mist hover:text-ink",
    active: "border-ink/20 bg-mist text-ink",
  },
  YES: {
    idle: "border-line text-ink-soft hover:border-sage/40 hover:bg-sage/10 hover:text-sage-deep",
    active: "border-sage/40 bg-sage/15 text-sage-deep",
  },
  NO: {
    idle: "border-line text-ink-soft hover:border-red-200 hover:bg-red-50 hover:text-red-700",
    active: "border-red-200 bg-red-50 text-red-700",
  },
  MAYBE: {
    idle: "border-line text-ink-soft hover:border-amber-200 hover:bg-amber-50 hover:text-amber-800",
    active: "border-amber-200 bg-amber-50 text-amber-800",
  },
};

const chipBtn =
  "inline-flex cursor-pointer items-center border px-2.5 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

function GuestNameRow({
  guest,
  origin,
  busy,
  bare = false,
  onRename,
  onDelete,
  onStatus,
  onTogglePlusOne,
  onCopy,
  onShare,
}: {
  guest: Guest;
  origin: string;
  busy: boolean;
  bare?: boolean;
  onRename: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => void;
  onStatus: (guest: Guest, status: RsvpStatus) => void;
  onTogglePlusOne: (guest: Guest) => void;
  onCopy: (guest: Guest) => void;
  onShare: (guest: Guest) => void;
}) {
  const [value, setValue] = useState(guest.name);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setValue(guest.name);
  }, [guest.name, focused]);

  async function commit() {
    const next = value.trim();
    if (next.length < 2) {
      setValue(guest.name);
      return;
    }
    if (next === guest.name) return;
    await onRename(guest.id, next);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      setValue(guest.name);
      e.currentTarget.blur();
    }
  }

  return (
    <div
      className={
        bare
          ? "group"
          : "group border-b border-line/80 py-3 last:border-b-0"
      }
    >
      <div className="flex items-baseline gap-2">
        <input
          value={value}
          disabled={busy}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            void commit();
          }}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 cursor-text bg-transparent font-[family-name:var(--font-display)] text-xl text-ink outline-none placeholder:text-ink-soft/40 disabled:opacity-50"
          aria-label="Імʼя гостя"
        />
        <button
          type="button"
          onClick={() => onDelete(guest.id)}
          className="shrink-0 cursor-pointer px-1.5 py-0.5 text-sm text-ink-soft opacity-0 transition hover:bg-red-50 hover:text-red-700 group-hover:opacity-100"
          aria-label="Видалити"
        >
          ×
        </button>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {(["YES", "MAYBE", "NO", "PENDING"] as const).map((status) => {
          const active = guest.rsvpStatus === status;
          return (
            <button
              key={status}
              type="button"
              disabled={busy}
              onClick={() => onStatus(guest, status)}
              className={`${chipBtn} ${
                active ? STATUS_BTN[status].active : STATUS_BTN[status].idle
              }`}
            >
              {STATUS_LABEL[status]}
            </button>
          );
        })}
        <button
          type="button"
          disabled={busy}
          onClick={() => onTogglePlusOne(guest)}
          className={`${chipBtn} ${
            guest.plusOne
              ? "border-sage/40 bg-sage/15 text-sage-deep"
              : "border-line text-ink-soft hover:border-sage/40 hover:bg-sage/10 hover:text-sage-deep"
          }`}
        >
          {guest.plusOne ? "+1 так" : "+1"}
        </button>
        {origin ? (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => onShare(guest)}
              className={`${chipBtn} border-sage bg-sage text-white hover:bg-sage-deep`}
            >
              Поділитись
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onCopy(guest)}
              className={`${chipBtn} border-line text-ink-soft hover:border-sage/40 hover:bg-mist hover:text-ink`}
            >
              Запрошення
            </button>
          </>
        ) : null}
      </div>
      {origin ? (
        <div className="mt-2">
          <InviteShareLinks
            url={`${origin}/rsvp/${guest.inviteToken}`}
            guestName={guest.name}
            onCopy={() => onCopy(guest)}
          />
        </div>
      ) : null}
    </div>
  );
}

function QuickAdd({
  side,
  busy,
  onAdd,
}: {
  side: GuestSide;
  busy: boolean;
  onAdd: (side: GuestSide, name: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function submit() {
    const next = name.trim();
    if (next.length < 2) return;
    await onAdd(side, next);
    setName("");
    inputRef.current?.focus();
  }

  if (!open) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex cursor-pointer items-center gap-2 border border-sage bg-white px-4 py-2.5 text-sm font-semibold text-sage transition hover:bg-sage hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="text-base leading-none">+</span>
        Додати гостя
      </button>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border border-sage/30 bg-mist/60 p-3">
      <input
        ref={inputRef}
        value={name}
        disabled={busy}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            void submit();
          }
          if (e.key === "Escape") {
            setOpen(false);
            setName("");
          }
        }}
        placeholder="Імʼя гостя"
        className="min-w-[160px] flex-1 cursor-text border border-line bg-white px-3 py-2 font-[family-name:var(--font-display)] text-lg text-ink outline-none placeholder:text-ink-soft/45 focus:border-sage"
      />
      <button
        type="button"
        disabled={busy || name.trim().length < 2}
        onClick={() => void submit()}
        className="cursor-pointer bg-sage px-4 py-2 text-sm font-semibold text-white transition hover:bg-sage-deep disabled:cursor-not-allowed disabled:opacity-40"
      >
        Додати
      </button>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setName("");
        }}
        className="cursor-pointer px-3 py-2 text-sm text-ink-soft transition hover:bg-white hover:text-ink"
      >
        Скасувати
      </button>
    </div>
  );
}

function SideColumn({
  title,
  hint,
  guests,
  side,
  origin,
  busy,
  onAdd,
  onRename,
  onDelete,
  onStatus,
  onTogglePlusOne,
  onCopy,
  onShare,
}: {
  title: string;
  hint: string;
  guests: Guest[];
  side: GuestSide;
  origin: string;
  busy: boolean;
  onAdd: (side: GuestSide, name: string) => Promise<void>;
  onRename: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => void;
  onStatus: (guest: Guest, status: RsvpStatus) => void;
  onTogglePlusOne: (guest: Guest) => void;
  onCopy: (guest: Guest) => void;
  onShare: (guest: Guest) => void;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">
          {hint}
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-ink md:text-3xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">{guests.length} гостей</p>
      </div>

      <div>
        {guests.length === 0 ? (
          <p className="border-b border-dashed border-line py-3 text-sm text-ink-soft/70">
            Поки порожньо — додай перше імʼя
          </p>
        ) : (
          guests.map((guest) => (
            <GuestNameRow
              key={guest.id}
              guest={guest}
              origin={origin}
              busy={busy}
              onRename={onRename}
              onDelete={onDelete}
              onStatus={onStatus}
              onTogglePlusOne={onTogglePlusOne}
              onCopy={onCopy}
              onShare={onShare}
            />
          ))
        )}
      </div>

      <QuickAdd side={side} busy={busy} onAdd={onAdd} />
    </div>
  );
}

function GuestsInner() {
  const [data, setData] = useState<GuestListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needWedding, setNeedWedding] = useState(false);
  const [view, setView] = useState<ViewMode>("sides");
  const [busy, setBusy] = useState(false);
  const [origin, setOrigin] = useState("");
  const [importing, setImporting] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RsvpStatus | "ALL">("ALL");
  const csvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  function guestRsvpUrl(guest: Guest) {
    return `${origin}/rsvp/${guest.inviteToken}`;
  }

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

  const brideGuests = useMemo(
    () => data?.guests.filter((g) => g.side === "BRIDE") ?? [],
    [data],
  );
  const groomGuests = useMemo(
    () => data?.guests.filter((g) => g.side === "GROOM") ?? [],
    [data],
  );
  const sharedGuests = useMemo(
    () =>
      data?.guests.filter((g) => g.side === "BOTH" || g.side === "OTHER") ?? [],
    [data],
  );

  const alphaGuests = useMemo(() => {
    if (!data) return [];
    return [...data.guests].sort((a, b) =>
      a.name.localeCompare(b.name, "uk"),
    );
  }, [data]);

  const tableGuests = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.guests.filter((g) => {
      if (filter !== "ALL" && g.rsvpStatus !== filter) return false;
      if (!q) return true;
      return g.name.toLowerCase().includes(q);
    });
  }, [data, filter, query]);

  const brideCount = brideGuests.length;
  const groomCount = groomGuests.length;
  const ratio =
    brideCount === 0 && groomCount === 0
      ? "0/0"
      : `${brideCount}/${groomCount}`;

  async function addGuest(side: GuestSide, name: string) {
    setBusy(true);
    setError(null);
    try {
      await createGuest({ name, side, rsvpStatus: "PENDING" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не додано");
    } finally {
      setBusy(false);
    }
  }

  async function renameGuest(id: string, name: string) {
    setBusy(true);
    setError(null);
    try {
      await updateGuest(id, { name });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено");
    } finally {
      setBusy(false);
    }
  }

  async function removeGuest(id: string) {
    const guest = data?.guests.find((g) => g.id === id);
    if (!confirm(`Видалити «${guest?.name ?? "гостя"}»?`)) return;
    setBusy(true);
    setError(null);
    try {
      await deleteGuest(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не видалено");
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(guest: Guest, rsvpStatus: RsvpStatus) {
    setBusy(true);
    setError(null);
    try {
      await updateGuest(guest.id, { rsvpStatus });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено");
    } finally {
      setBusy(false);
    }
  }

  async function togglePlusOne(guest: Guest) {
    setBusy(true);
    setError(null);
    try {
      await updateGuest(guest.id, {
        plusOne: !guest.plusOne,
        plusOneName: !guest.plusOne ? guest.plusOneName : undefined,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено");
    } finally {
      setBusy(false);
    }
  }

  async function moveSide(guest: Guest, side: GuestSide) {
    if (guest.side === side) return;
    setBusy(true);
    setError(null);
    try {
      await updateGuest(guest.id, { side });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не оновлено");
    } finally {
      setBusy(false);
    }
  }

  async function copyLink(guest: Guest) {
    try {
      await navigator.clipboard.writeText(guestRsvpUrl(guest));
      toast.success("Скопійовано", `Запрошення для ${guest.name}`);
    } catch {
      setError("Не вдалось скопіювати лінк");
    }
  }

  async function shareLink(guest: Guest) {
    const url = guestRsvpUrl(guest);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Запрошення · ${guest.name}`,
          text: "Підтверди участь у весіллі",
          url,
        });
        return;
      } catch {
        // cancelled
      }
    }
    await copyLink(guest);
  }

  async function copyAllLinks() {
    if (!data?.guests.length || !origin) return;
    const lines = data.guests.map((g) => `${g.name}: ${guestRsvpUrl(g)}`);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast.success("Усі лінки", `${lines.length} рядків`);
    } catch {
      setError("Не вдалось скопіювати лінки");
    }
  }

  function parseCsv(text: string) {
    const lines = text
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) return [];

    const split = (line: string) => {
      const cells: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i += 1) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i += 1;
          } else {
            inQuotes = !inQuotes;
          }
          continue;
        }
        if ((ch === "," || ch === ";") && !inQuotes) {
          cells.push(current.trim());
          current = "";
          continue;
        }
        current += ch;
      }
      cells.push(current.trim());
      return cells;
    };

    const headerCells = split(lines[0]).map((c) => c.toLowerCase());
    const hasHeader = headerCells.some((c) =>
      ["name", "імя", "ім'я", "імʼя", "гость", "guest", "сторона", "side"].includes(
        c,
      ),
    );
    const rows = hasHeader ? lines.slice(1) : lines;
    const idx = (aliases: string[]) =>
      headerCells.findIndex((c) => aliases.includes(c));
    const nameIdx = hasHeader
      ? Math.max(0, idx(["name", "імя", "ім'я", "імʼя", "гость", "guest"]))
      : 0;
    const sideIdx = hasHeader ? idx(["side", "сторона"]) : 1;

    const sideMap: Record<string, GuestSide> = {
      bride: "BRIDE",
      наречена: "BRIDE",
      groom: "GROOM",
      наречений: "GROOM",
      both: "BOTH",
      обидві: "BOTH",
      спільні: "BOTH",
      other: "OTHER",
      інше: "OTHER",
    };

    return rows
      .map((line) => {
        const cells = split(line);
        const name = (cells[nameIdx] ?? "").trim();
        if (name.length < 2) return null;
        const sideRaw =
          sideIdx >= 0 ? cells[sideIdx]?.trim().toLowerCase() : "";
        return {
          name,
          side: sideRaw ? sideMap[sideRaw] : undefined,
        };
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row));
  }

  async function onCsvFile(file?: File) {
    if (!file) return;
    setImporting(true);
    setError(null);
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (rows.length === 0) {
        throw new Error("У CSV немає валідних рядків");
      }
      const result = await importGuests(rows);
      toast.success("Імпорт", `Додано ${result.imported}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Імпорт не вдався");
    } finally {
      setImporting(false);
      if (csvInputRef.current) csvInputRef.current.value = "";
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
        <div className="mt-6 border border-line bg-mist px-6 py-10">
          <p className="text-ink-soft">
            Спочатку створи весілля у кабінеті.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex cursor-pointer bg-sage px-5 py-3 text-sm font-semibold text-white transition hover:bg-sage-deep"
          >
            До кабінету
          </Link>
        </div>
      </>
    );
  }

  const stats = data?.stats;
  const rowProps = {
    origin,
    busy,
    onRename: renameGuest,
    onDelete: removeGuest,
    onStatus: setStatus,
    onTogglePlusOne: togglePlusOne,
    onCopy: copyLink,
    onShare: shareLink,
  };

  return (
    <>
      <DashboardNav variant="COUPLE" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            Гості
          </h1>
          <p className="mt-2 max-w-lg text-ink-soft">
            Набивай імена по сторонах — Enter додає наступного. Запрошення і статуси
            одразу під кожним гостем.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={importing}
            onClick={() => csvInputRef.current?.click()}
            className="cursor-pointer border border-line bg-white px-4 py-2.5 text-sm text-ink-soft transition hover:border-sage/40 hover:bg-mist hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {importing ? "Імпорт…" : "Імпорт CSV"}
          </button>
          <button
            type="button"
            disabled={!data?.guests.length || !origin}
            onClick={() => void copyAllLinks()}
            className="cursor-pointer border border-line bg-white px-4 py-2.5 text-sm text-ink-soft transition hover:border-sage/40 hover:bg-mist hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            Усі запрошення
          </button>
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => void onCsvFile(e.target.files?.[0])}
          />
        </div>
      </div>

      {error ? (
        <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-b border-line pb-3">
        <div className="inline-flex border border-line bg-white p-0.5">
          {(
            [
              { id: "sides", label: "Дві сторони" },
              { id: "alpha", label: "За абеткою" },
              { id: "table", label: "Таблиця" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`cursor-pointer px-3 py-2 text-sm transition ${
                view === item.id
                  ? "bg-sage text-white"
                  : "text-ink-soft hover:bg-mist hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {view === "sides" ? (
        <div className="mt-8">
          <div className="grid gap-10 md:grid-cols-2 md:gap-0">
            <div className="md:pr-10">
              <SideColumn
                title="Гості нареченої"
                hint="Сторона нареченої"
                guests={brideGuests}
                side="BRIDE"
                onAdd={addGuest}
                {...rowProps}
              />
            </div>
            <div className="md:border-l md:border-line md:pl-10">
              <SideColumn
                title="Гості нареченого"
                hint="Сторона нареченого"
                guests={groomGuests}
                side="GROOM"
                onAdd={addGuest}
                {...rowProps}
              />
            </div>
          </div>

          <div className="mt-12 border-t border-line pt-8">
            <SideColumn
              title="Спільні / інші"
              hint="Не привʼязані до однієї сторони"
              guests={sharedGuests}
              side="BOTH"
              onAdd={addGuest}
              {...rowProps}
            />
          </div>
        </div>
      ) : null}

      {view === "alpha" ? (
        <div className="mt-8 max-w-xl">
          {alphaGuests.length === 0 ? (
            <p className="text-sm text-ink-soft">Список порожній.</p>
          ) : (
            alphaGuests.map((guest) => (
              <div
                key={guest.id}
                className="border-b border-line/80 py-2.5 last:border-b-0"
              >
                <GuestNameRow guest={guest} bare {...rowProps} />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(["BRIDE", "GROOM", "BOTH"] as const).map((side) => (
                    <button
                      key={side}
                      type="button"
                      disabled={busy}
                      onClick={() => void moveSide(guest, side)}
                      className={`${chipBtn} ${
                        guest.side === side
                          ? "border-sage/40 bg-sage/15 text-sage-deep"
                          : "border-line text-ink-soft hover:border-sage/40 hover:bg-mist hover:text-ink"
                      }`}
                    >
                      {SIDE_LABEL[side]}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <QuickAdd side="BRIDE" busy={busy} onAdd={addGuest} />
            <QuickAdd side="GROOM" busy={busy} onAdd={addGuest} />
          </div>
        </div>
      ) : null}

      {view === "table" ? (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1">
              {(
                ["ALL", "PENDING", "YES", "MAYBE", "NO"] as const
              ).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`cursor-pointer px-3 py-1.5 text-sm transition ${
                    filter === item
                      ? "bg-sage text-white"
                      : "text-ink-soft hover:bg-mist hover:text-ink"
                  }`}
                >
                  {item === "ALL" ? "Усі" : STATUS_LABEL[item]}
                </button>
              ))}
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Пошук…"
              className="w-full max-w-xs border border-line bg-white px-3 py-2 text-sm outline-none focus:border-sage sm:w-48"
            />
          </div>

          <div className="overflow-x-auto border border-line bg-white">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-[0.12em] text-ink-soft">
                  <th className="px-4 py-3 font-medium">Гість</th>
                  <th className="px-4 py-3 font-medium">Сторона</th>
                  <th className="px-4 py-3 font-medium">Запрошення</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {tableGuests.map((guest) => (
                  <tr
                    key={guest.id}
                    className="border-b border-line/70 last:border-b-0"
                  >
                    <td className="px-4 py-3">
                      <GuestNameRow guest={guest} bare {...rowProps} />
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      <select
                        value={guest.side}
                        disabled={busy}
                        onChange={(e) =>
                          void moveSide(guest, e.target.value as GuestSide)
                        }
                        className="cursor-pointer border border-transparent bg-transparent py-1 outline-none hover:border-line focus:border-sage"
                      >
                        {Object.entries(SIDE_LABEL).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${chipBtn} ${STATUS_BTN[guest.rsvpStatus].active}`}>
                        {STATUS_LABEL[guest.rsvpStatus]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => void removeGuest(guest.id)}
                        className="cursor-pointer px-2 py-1 text-xs text-ink-soft transition hover:bg-red-50 hover:text-red-700"
                      >
                        Видалити
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tableGuests.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-ink-soft">
                Нікого немає.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-14 border-t border-line pt-10 text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">
          Співвідношення за сторонами
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-5xl text-ink md:text-6xl">
          {ratio}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-soft">
          <span>Наречена {brideCount}</span>
          <span>Наречений {groomCount}</span>
          <span>Спільні {sharedGuests.length}</span>
          {stats ? (
            <>
              <span>Усього {stats.total}</span>
              <span>Йдуть {stats.yes}</span>
              <span>Чекаємо {stats.pending}</span>
              <span>З +1 · {stats.headcount}</span>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export function GuestsPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-5xl">
          <GuestsInner />
        </div>
      </section>
    </RequireAuth>
  );
}
