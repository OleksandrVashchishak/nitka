"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Guest, RsvpStatus } from "@/lib/guests-api";
import { updateGuest } from "@/lib/guests-api";
import type {
  SeatingGuestAssign,
  SeatingGuestsDraft,
  SeatingTablesDraft,
} from "@/components/seating-wizard";
import {
  GuestListPopover,
  GuestSeatPopover,
  type GuestPopoverInfo,
} from "@/components/seating-plan-popovers";
import { IconMore } from "@/components/icon-more";
import { Select } from "@/components/ui/select";
import { toast } from "@/lib/toast";
import "@/app/seating-plan.css";

const GROUP_COLORS = ["#8B7CC8", "#5B8DEF", "#4CAF7A", "#C47A3A", "#E07A9A"];

type FlatGuest = {
  key: string;
  guestId: string;
  name: string;
  isPlusOne: boolean;
  isChild: boolean;
  side: Guest["side"];
  rsvpStatus: RsvpStatus;
  linkedKey: string | null;
};

type SeatSpot = {
  id: string;
  guestKey: string | null;
};

type PlanTable = {
  id: string;
  kind: "presidium" | "round" | "long" | "kids" | "t-shape" | "p-shape";
  label: string;
  x: number;
  y: number;
  seats: SeatSpot[];
};

type Props = {
  weddingId: string;
  guests: Guest[];
  draft: {
    tables: SeatingTablesDraft;
    guests: SeatingGuestsDraft;
  };
  onEditGuests?: () => void;
  onGuestsRefresh?: () => Promise<void>;
};

type SeatFilter = "all" | "seated" | "unseated";
type SideFilter = "all" | "BRIDE" | "GROOM" | "BOTH";
type PopoverState =
  | { kind: "seat"; key: string }
  | { kind: "list"; key: string }
  | null;

function storageKey(weddingId: string) {
  return `fata-seating-plan:v1:${weddingId}`;
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function isChild(guest: Guest) {
  return (guest.notes ?? "").includes("[child]");
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function flattenGuests(guests: Guest[]): FlatGuest[] {
  const rows: FlatGuest[] = [];
  for (const g of guests) {
    const mainKey = g.id;
    const plusKey =
      g.plusOne && g.plusOneName?.trim() ? `${g.id}:plus` : null;
    rows.push({
      key: mainKey,
      guestId: g.id,
      name: g.name,
      isPlusOne: false,
      isChild: isChild(g),
      side: g.side,
      rsvpStatus: g.rsvpStatus,
      linkedKey: plusKey,
    });
    if (plusKey && g.plusOneName?.trim()) {
      rows.push({
        key: plusKey,
        guestId: g.id,
        name: g.plusOneName.trim(),
        isPlusOne: true,
        isChild: false,
        side: g.side,
        rsvpStatus: g.rsvpStatus,
        linkedKey: mainKey,
      });
    }
  }
  return rows;
}

function lastName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[parts.length - 1] ?? "").toLowerCase();
}

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function colorForAssign(
  assign: SeatingGuestAssign,
  groups: SeatingGuestsDraft["groups"],
) {
  if (assign === "presidium") return "#6B7280";
  if (assign === "kids") return "#E07A9A";
  if (typeof assign === "string") {
    const idx = groups.findIndex((g) => g.id === assign);
    return GROUP_COLORS[(idx >= 0 ? idx : hashStr(assign)) % GROUP_COLORS.length];
  }
  return "#9CA3AF";
}

function makeSeats(count: number): SeatSpot[] {
  return Array.from({ length: Math.max(0, count) }, (_, i) => ({
    id: uid(`seat-${i}`),
    guestKey: null,
  }));
}

function buildTables(tables: SeatingTablesDraft): PlanTable[] {
  const result: PlanTable[] = [];
  let y = 40;

  if (tables.hasPresidium) {
    result.push({
      id: uid("pres"),
      kind: "presidium",
      label: "Президіум",
      x: 260,
      y,
      seats: makeSeats(tables.presidiumSeats || 6),
    });
    y += 140;
  }

  const roundCount = Math.max(0, Number.parseInt(tables.roundTableCount, 10) || 0);
  const roundSeats = Math.max(0, Number.parseInt(tables.roundSeatsPerTable, 10) || 10);
  const needsRound =
    tables.format === "presidium-round" ||
    tables.format === "presidium-mixed" ||
    roundCount > 0;

  if (needsRound) {
    const n = roundCount > 0 ? roundCount : 3;
    for (let i = 0; i < n; i += 1) {
      result.push({
        id: uid("round"),
        kind: "round",
        label: `Стіл ${result.filter((t) => t.kind !== "presidium" && t.kind !== "kids").length + 1}`,
        x: 80 + i * 200,
        y,
        seats: makeSeats(roundSeats || 10),
      });
    }
    y += 220;
  }

  const longCount = Math.max(0, Number.parseInt(tables.longTableCount, 10) || 0);
  const longSeats = Math.max(0, Number.parseInt(tables.longSeatsPerTable, 10) || 18);
  const needsLong =
    tables.format === "presidium-long" ||
    tables.format === "presidium-mixed" ||
    tables.format === "p-shape" ||
    tables.format === "t-shape" ||
    longCount > 0;

  if (needsLong) {
    const n =
      longCount > 0
        ? longCount
        : tables.format === "presidium-long" ||
            tables.format === "presidium-mixed" ||
            tables.format === "p-shape" ||
            tables.format === "t-shape"
          ? 2
          : 0;
    for (let i = 0; i < n; i += 1) {
      result.push({
        id: uid("long"),
        kind: "long",
        label: `Стіл ${result.filter((t) => t.kind !== "presidium" && t.kind !== "kids").length + 1}`,
        x: 120 + (i % 2) * 340,
        y: y + Math.floor(i / 2) * 120,
        seats: makeSeats(longSeats || 18),
      });
    }
    if (n > 0) y += Math.ceil(n / 2) * 120 + 40;
  }

  if (tables.hasKidsTable) {
    result.push({
      id: uid("kids"),
      kind: "kids",
      label: "Дитячий стіл",
      x: 360,
      y,
      seats: makeSeats(8),
    });
  }

  // Relabel numbered tables sequentially
  let num = 1;
  return result.map((t) => {
    if (t.kind === "presidium" || t.kind === "kids") return t;
    return { ...t, label: `Стіл ${num++}` };
  });
}

function autoSeat(
  tables: PlanTable[],
  flat: FlatGuest[],
  draft: SeatingGuestsDraft,
): PlanTable[] {
  const next = tables.map((t) => ({
    ...t,
    seats: t.seats.map((s) => ({ ...s, guestKey: null as string | null })),
  }));

  const seated = new Set<string>();

  function fill(kind: PlanTable["kind"] | "any", keys: string[]) {
    for (const key of keys) {
      if (seated.has(key)) continue;
      const table = next.find(
        (t) =>
          (kind === "any" ? t.kind !== "presidium" && t.kind !== "kids" : t.kind === kind) &&
          t.seats.some((s) => !s.guestKey),
      );
      if (!table) continue;
      const seat = table.seats.find((s) => !s.guestKey);
      if (!seat) continue;
      seat.guestKey = key;
      seated.add(key);
    }
  }

  const byAssign = (value: SeatingGuestAssign) =>
    flat
      .filter((g) => (draft.assignments[g.key] ?? null) === value)
      .map((g) => g.key);

  fill("presidium", byAssign("presidium"));
  fill("kids", byAssign("kids"));

  for (const group of draft.groups) {
    fill("any", byAssign(group.id));
  }

  fill(
    "any",
    flat.filter((g) => !seated.has(g.key)).map((g) => g.key),
  );

  return next;
}

function seatPosition(
  kind: PlanTable["kind"],
  index: number,
  total: number,
): { left: string; top: string } {
  if (kind === "round" || kind === "kids") {
    const angle = (Math.PI * 2 * index) / Math.max(total, 1) - Math.PI / 2;
    const r = kind === "kids" ? 52 : 62;
    return {
      left: `${50 + Math.cos(angle) * r * 0.85}%`,
      top: `${50 + Math.sin(angle) * r * 0.85}%`,
    };
  }

  if (kind === "presidium") {
    const t = total <= 1 ? 0.5 : index / (total - 1);
    return { left: `${10 + t * 80}%`, top: "0%" };
  }

  const half = Math.ceil(total / 2);
  if (index < half) {
    const t = half <= 1 ? 0.5 : index / (half - 1);
    return { left: `${10 + t * 80}%`, top: "0%" };
  }
  const j = index - half;
  const bottom = Math.max(total - half, 1);
  const t = bottom <= 1 ? 0.5 : j / (bottom - 1);
  return { left: `${10 + t * 80}%`, top: "100%" };
}

export function SeatingPlan({
  weddingId,
  guests,
  draft,
  onEditGuests,
  onGuestsRefresh,
}: Props) {
  const flat = useMemo(() => flattenGuests(guests), [guests]);
  const guestMap = useMemo(() => {
    const m = new Map<string, FlatGuest>();
    for (const g of flat) m.set(g.key, g);
    return m;
  }, [flat]);

  const [tables, setTables] = useState<PlanTable[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showNames, setShowNames] = useState(true);
  const [query, setQuery] = useState("");
  const [seatFilter, setSeatFilter] = useState<SeatFilter>("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [sideFilter, setSideFilter] = useState<SideFilter>("all");
  const [tableFilter, setTableFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [groupsOpen, setGroupsOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [popover, setPopover] = useState<PopoverState>(null);
  const [detachedKeys, setDetachedKeys] = useState<Set<string>>(new Set());
  const addRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [floatPop, setFloatPop] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    let fromStorage = false;
    try {
      const raw = localStorage.getItem(storageKey(weddingId));
      if (raw) {
        const parsed = JSON.parse(raw) as { tables: PlanTable[] };
        if (parsed.tables?.length) {
          setTables(parsed.tables);
          fromStorage = true;
        }
      }
    } catch {
      /* ignore */
    }
    if (!fromStorage) {
      setTables(autoSeat(buildTables(draft.tables), flat, draft.guests));
    }
    setHydrated(true);
  }, [weddingId, draft, flat]);

  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(
          storageKey(weddingId),
          JSON.stringify({ tables, savedAt: Date.now() }),
        );
      } catch {
        /* ignore */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [tables, weddingId, hydrated]);

  useEffect(() => {
    function onDoc(event: MouseEvent) {
      const target = event.target as Node;
      if (addOpen && addRef.current && !addRef.current.contains(target)) {
        setAddOpen(false);
      }
      if (printOpen && printRef.current && !printRef.current.contains(target)) {
        setPrintOpen(false);
      }
      const floatEl = document.querySelector(".seat-plan-float-pop");
      if (
        popover &&
        floatEl &&
        !floatEl.contains(target) &&
        !(target as Element).closest?.(".seat-plan-seat") &&
        !(target as Element).closest?.(".seat-plan-guest-more-btn")
      ) {
        setPopover(null);
        setFloatPop(null);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [addOpen, printOpen, popover]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPopover(null);
        setFloatPop(null);
        setAddOpen(false);
        setPrintOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function openFloatPopover(
    kind: "seat" | "list",
    key: string,
    anchor: HTMLElement,
  ) {
    const rect = anchor.getBoundingClientRect();
    const width = 280;
    const estimatedH = 240;
    const left = Math.min(
      Math.max(12, rect.left),
      window.innerWidth - width - 12,
    );
    let top = rect.bottom + 8;
    if (top + estimatedH > window.innerHeight - 12) {
      top = Math.max(12, rect.top - estimatedH - 8);
    }
    setFloatPop({ top, left });
    setPopover({ kind, key });
  }

  function closePopover() {
    setPopover(null);
    setFloatPop(null);
  }

  const visibleFlat = useMemo(
    () => flat.filter((g) => !detachedKeys.has(g.key)),
    [flat, detachedKeys],
  );

  const seatOfGuest = useMemo(() => {
    const m = new Map<string, { tableId: string; seatId: string }>();
    for (const table of tables) {
      for (const seat of table.seats) {
        if (seat.guestKey) m.set(seat.guestKey, { tableId: table.id, seatId: seat.id });
      }
    }
    return m;
  }, [tables]);

  const seatedCount = seatOfGuest.size;
  const totalGuests = visibleFlat.length;

  const filteredGuests = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visibleFlat.filter((g) => {
      if (q && !g.name.toLowerCase().includes(q)) return false;
      const seated = seatOfGuest.has(g.key);
      if (seatFilter === "seated" && !seated) return false;
      if (seatFilter === "unseated" && seated) return false;
      const assign = draft.guests.assignments[g.key] ?? null;
      if (groupFilter !== "all") {
        if (groupFilter === "presidium" && assign !== "presidium") return false;
        else if (groupFilter === "kids" && assign !== "kids") return false;
        else if (
          groupFilter !== "presidium" &&
          groupFilter !== "kids" &&
          assign !== groupFilter
        ) {
          return false;
        }
      }
      if (sideFilter !== "all" && g.side !== sideFilter && g.side !== "BOTH") {
        return false;
      }
      if (tableFilter !== "all") {
        const info = seatOfGuest.get(g.key);
        if (!info || info.tableId !== tableFilter) return false;
      }
      return true;
    });
  }, [
    visibleFlat,
    query,
    seatFilter,
    groupFilter,
    sideFilter,
    tableFilter,
    seatOfGuest,
    draft.guests.assignments,
  ]);

  const namedGroups = draft.guests.groups.filter((g) => g.name.trim());

  function groupLabelFor(key: string) {
    const assign = draft.guests.assignments[key] ?? null;
    if (assign === "presidium") return "Президіум";
    if (assign === "kids") return "Діти";
    if (typeof assign === "string") {
      return draft.guests.groups.find((g) => g.id === assign)?.name ?? null;
    }
    return null;
  }

  function buildPopoverInfo(key: string): GuestPopoverInfo | null {
    const guest = guestMap.get(key);
    if (!guest) return null;
    const seatInfo = seatOfGuest.get(key);
    const table = seatInfo
      ? tables.find((t) => t.id === seatInfo.tableId)
      : null;
    const ln = lastName(guest.name);
    const swapCandidates = visibleFlat
      .filter((g) => {
        if (g.key === key) return false;
        if (!seatOfGuest.has(g.key)) return false;
        if (guest.linkedKey === g.key || g.linkedKey === key) return true;
        return ln && lastName(g.name) === ln;
      })
      .map((g) => ({ key: g.key, name: g.name }));

    const linked =
      guest.linkedKey && !detachedKeys.has(guest.linkedKey)
        ? guestMap.get(guest.linkedKey)
        : null;

    return {
      key,
      guestId: guest.guestId,
      name: guest.name,
      index: Math.max(1, visibleFlat.findIndex((g) => g.key === key) + 1),
      groupLabel: groupLabelFor(key),
      tableLabel: table?.label ?? null,
      rsvpStatus: guest.rsvpStatus,
      isPlusOne: guest.isPlusOne,
      linkedName: linked?.name ?? null,
      swapCandidates,
    };
  }

  const activePopover = popover ? buildPopoverInfo(popover.key) : null;

  function assignToSeat(tableId: string, seatId: string) {
    if (!selectedKey) {
      toast.info("Оберіть гостя зліва");
      return;
    }
    setTables((prev) =>
      prev.map((table) => ({
        ...table,
        seats: table.seats.map((seat) => {
          if (seat.guestKey === selectedKey) return { ...seat, guestKey: null };
          if (table.id === tableId && seat.id === seatId) {
            return { ...seat, guestKey: selectedKey };
          }
          return seat;
        }),
      })),
    );
  }

  function freeGuest(key: string) {
    setTables((prev) =>
      prev.map((table) => ({
        ...table,
        seats: table.seats.map((s) =>
          s.guestKey === key ? { ...s, guestKey: null } : s,
        ),
      })),
    );
    closePopover();
  }

  function swapGuests(a: string, b: string) {
    setTables((prev) =>
      prev.map((table) => ({
        ...table,
        seats: table.seats.map((s) => {
          if (s.guestKey === a) return { ...s, guestKey: b };
          if (s.guestKey === b) return { ...s, guestKey: a };
          return s;
        }),
      })),
    );
    closePopover();
  }

  async function setRsvp(guestId: string, status: RsvpStatus) {
    try {
      await updateGuest(guestId, { rsvpStatus: status });
      await onGuestsRefresh?.();
      toast.success("Статус оновлено");
      closePopover();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не оновлено");
    }
  }

  function addTable(kind: PlanTable["kind"]) {
    const seats =
      kind === "round"
        ? 10
        : kind === "kids"
          ? 8
          : kind === "presidium"
            ? 6
            : kind === "t-shape" || kind === "p-shape"
              ? 20
              : 16;
    const labeledKinds = new Set(["round", "long", "t-shape", "p-shape"]);
    const numbered =
      tables.filter((t) => labeledKinds.has(t.kind)).length + 1;
    const label =
      kind === "presidium"
        ? "Президіум"
        : kind === "kids"
          ? "Дитячий стіл"
          : kind === "t-shape"
            ? `Т-форма ${numbered}`
            : kind === "p-shape"
              ? `П-форма ${numbered}`
              : `Стіл ${numbered}`;
    setTables((prev) => [
      ...prev,
      {
        id: uid(kind),
        kind,
        label,
        x: 100 + (numbered % 3) * 200,
        y: 480 + Math.floor(numbered / 3) * 40,
        seats: makeSeats(seats),
      },
    ]);
    setAddOpen(false);
  }

  return (
    <div className="seat-plan">
      <div className="seat-plan-top">
        <div className="seat-plan-title-wrap">
          <h1 className="seat-plan-title">План розсадки</h1>
          <span className="seat-plan-autosave">
            <span className="seat-plan-autosave-dot" aria-hidden />
            Авто-збереження
          </span>
        </div>

        <div className="seat-plan-actions">
          <button
            type="button"
            className="seat-plan-btn seat-plan-btn--ghost"
            onClick={() => toast.info("PDF — скоро")}
          >
            Зберегти PDF
          </button>

          <div
            className={`seat-plan-print-menu${printOpen ? " is-open" : ""}`}
            ref={printRef}
          >
            <button
              type="button"
              className="seat-plan-btn seat-plan-btn--wine"
              aria-expanded={printOpen}
              onClick={() => {
                setPrintOpen((v) => !v);
                setAddOpen(false);
              }}
            >
              Дизайн для друку
              <ChevronDownIcon />
            </button>
            {printOpen ? (
              <div className="seat-plan-print-dropdown" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setPrintOpen(false);
                    toast.info("Дизайн посадкової карти — скоро");
                  }}
                >
                  Дизайн посадкової карти
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setPrintOpen(false);
                    toast.info("Дизайн іменних карток — скоро");
                  }}
                >
                  Дизайн іменних карток
                </button>
              </div>
            ) : null}
          </div>

          <div
            className={`seat-plan-add-menu${addOpen ? " is-open" : ""}`}
            ref={addRef}
          >
            <button
              type="button"
              className="seat-plan-btn seat-plan-btn--dark"
              aria-expanded={addOpen}
              onClick={() => {
                setAddOpen((v) => !v);
                setPrintOpen(false);
              }}
            >
              <span className="seat-plan-add-plus" aria-hidden>
                <AddPlusIcon />
              </span>
              Додати стіл
              <ChevronDownIcon />
            </button>
            {addOpen ? (
              <div className="seat-plan-add-dropdown" role="menu">
                {(
                  [
                    ["round", "Круглий"],
                    ["long", "Довгий"],
                    ["presidium", "Президіум"],
                    ["kids", "Дитячий"],
                    ["t-shape", "Т-форма"],
                    ["p-shape", "П-форма"],
                  ] as const
                ).map(([kind, label]) => (
                  <button
                    key={kind}
                    type="button"
                    role="menuitem"
                    onClick={() => addTable(kind)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <label className={`seat-plan-toggle${showNames ? " is-on" : ""}`}>
            <input
              type="checkbox"
              checked={showNames}
              onChange={(e) => setShowNames(e.target.checked)}
            />
            <span className="seat-plan-switch" aria-hidden />
            Показати імена
          </label>
        </div>
      </div>

      <div className="seat-plan-layout">
        <aside className="seat-plan-panel">
          <div className="seat-plan-panel-head">
            <div>
              <h2 className="seat-plan-panel-title">
                Гості
                <button
                  type="button"
                  className="seat-plan-icon-btn"
                  aria-label="Редагувати групи"
                  onClick={onEditGuests}
                >
                  <PencilIcon />
                </button>
              </h2>
              <p className="seat-plan-panel-count">
                {seatedCount} / {totalGuests} розсаджено
              </p>
            </div>
          </div>

          <label className="seat-plan-search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Пошук гостей"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <div className="seat-plan-filters">
            <p className="seat-plan-filters-title">Фільтри</p>
            <Select
              size="xs"
              value={seatFilter}
              onChange={(e) => setSeatFilter(e.target.value as SeatFilter)}
              aria-label="Посадка"
            >
              <option value="all">Посаджені і не посаджені</option>
              <option value="seated">Лише посаджені</option>
              <option value="unseated">Лише не посаджені</option>
            </Select>
            <Select
              size="xs"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              aria-label="Група"
            >
              <option value="all">Усі групи</option>
              {namedGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
              {draft.tables.hasPresidium ? (
                <option value="presidium">Президіум</option>
              ) : null}
              {draft.tables.hasKidsTable ? (
                <option value="kids">Дитячий стіл</option>
              ) : null}
            </Select>
            <Select
              size="xs"
              value={sideFilter}
              onChange={(e) => setSideFilter(e.target.value as SideFilter)}
              aria-label="Сторона"
            >
              <option value="all">Гості обох наречених</option>
              <option value="BRIDE">Сторона нареченої</option>
              <option value="GROOM">Сторона нареченого</option>
              <option value="BOTH">Спільні</option>
            </Select>
            <Select
              size="xs"
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              aria-label="Стіл"
            >
              <option value="all">Усі столи</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="seat-plan-guest-scroll">
            {filteredGuests.map((g) => {
              const seated = seatOfGuest.has(g.key);
              const assign = draft.guests.assignments[g.key] ?? null;
              const color = colorForAssign(assign, draft.guests.groups);
              const open =
                popover?.kind === "list" && popover.key === g.key;
              return (
                <div
                  key={g.key}
                  className={`seat-plan-guest-row-wrap${
                    selectedKey === g.key ? " is-selected" : ""
                  }`}
                >
                  <button
                    type="button"
                    className={`seat-plan-guest-row${
                      selectedKey === g.key ? " is-selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedKey(g.key);
                      closePopover();
                    }}
                  >
                    <span
                      className={`seat-plan-guest-avatar${seated ? "" : " is-empty"}`}
                      style={seated ? { background: color } : undefined}
                    >
                      {seated ? initials(g.name) : ""}
                    </span>
                    <span className="seat-plan-guest-name">{g.name}</span>
                    <span className="seat-plan-guest-meta">
                      {seated ? (
                        <span
                          className="seat-plan-guest-check"
                          aria-label="Розсаджено"
                        >
                          <CheckIcon />
                        </span>
                      ) : null}
                      {g.isPlusOne || assign === "presidium" ? (
                        <span
                          className="seat-plan-guest-p"
                          title="Пов’язаний / президіум"
                        >
                          P
                        </span>
                      ) : null}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="seat-plan-icon-btn seat-plan-guest-more-btn"
                    aria-label="Дії з гостем"
                    aria-expanded={open}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedKey(g.key);
                      if (open) {
                        closePopover();
                        return;
                      }
                      openFloatPopover("list", g.key, e.currentTarget);
                    }}
                  >
                    <IconMore size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="seat-plan-groups">
            <button
              type="button"
              className="seat-plan-groups-head"
              onClick={() => setGroupsOpen((v) => !v)}
            >
              Групи
              <span aria-hidden>{groupsOpen ? "▴" : "▾"}</span>
            </button>
            {groupsOpen ? (
              <div className="seat-plan-group-chips">
                {namedGroups.map((g, i) => (
                  <span key={g.id} className="seat-plan-chip">
                    <span
                      className="seat-plan-chip-dot"
                      style={{ background: GROUP_COLORS[i % GROUP_COLORS.length] }}
                    />
                    {g.name}
                  </span>
                ))}
                {draft.tables.hasKidsTable ? (
                  <span className="seat-plan-chip">
                    <span
                      className="seat-plan-chip-dot"
                      style={{ background: "#E07A9A" }}
                    />
                    Діти
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </aside>

        <div className="seat-plan-canvas-wrap">
          <div className="seat-plan-canvas">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`seat-plan-table is-${table.kind}`}
                style={{ left: table.x, top: table.y }}
              >
                <div className="seat-plan-table-label">
                  {table.label}{" "}
                  <span>
                    {table.seats.filter((s) => s.guestKey).length}/{table.seats.length}
                  </span>
                </div>
                <div className="seat-plan-table-body">
                  <div className="seat-plan-seats">
                    {table.seats.map((seat, index) => {
                      const guest = seat.guestKey
                        ? guestMap.get(seat.guestKey)
                        : null;
                      const assign = seat.guestKey
                        ? draft.guests.assignments[seat.guestKey] ?? null
                        : null;
                      const color = guest
                        ? colorForAssign(assign, draft.guests.groups)
                        : undefined;
                      const pos = seatPosition(
                        table.kind,
                        index,
                        table.seats.length,
                      );
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          className={`seat-plan-seat${guest ? "" : " is-empty"}`}
                          style={{
                            left: pos.left,
                            top: pos.top,
                            background: guest ? color : undefined,
                          }}
                          title={guest?.name ?? "Порожнє місце"}
                          onClick={(e) => {
                            if (selectedKey) {
                              assignToSeat(table.id, seat.id);
                              closePopover();
                              return;
                            }
                            if (guest && seat.guestKey) {
                              openFloatPopover(
                                "seat",
                                seat.guestKey,
                                e.currentTarget,
                              );
                              return;
                            }
                            toast.info("Оберіть гостя зліва");
                          }}
                        >
                          {guest ? initials(guest.name) : ""}
                          {showNames && guest ? (
                            <span className="seat-plan-seat-name">
                              {guest.name}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {popover && activePopover && floatPop ? (
        <div
          className="seat-plan-float-pop"
          style={{ top: floatPop.top, left: floatPop.left }}
        >
          {popover.kind === "seat" ? (
            <GuestSeatPopover
              info={activePopover}
              onFree={() => freeGuest(activePopover.key)}
              onSwap={(otherKey) => swapGuests(activePopover.key, otherKey)}
              onClose={closePopover}
            />
          ) : (
            <GuestListPopover
              info={activePopover}
              onSetRsvp={(status) =>
                void setRsvp(activePopover.guestId, status)
              }
              onLeaveUnseated={() => freeGuest(activePopover.key)}
              onDetach={
                activePopover.linkedName
                  ? () => {
                      const guest = guestMap.get(activePopover.key);
                      if (!guest?.linkedKey) return;
                      setDetachedKeys((prev) => {
                        const next = new Set(prev);
                        next.add(
                          guest.isPlusOne
                            ? activePopover.key
                            : guest.linkedKey!,
                        );
                        return next;
                      });
                      freeGuest(
                        guest.isPlusOne
                          ? activePopover.key
                          : guest.linkedKey!,
                      );
                      toast.success("Від’єднано");
                    }
                  : null
              }
              onClose={closePopover}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.25" stroke="#A8A8A8" strokeWidth="1.4" />
      <path d="M9.2 9.2 12 12" stroke="#A8A8A8" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M8.5 2.5 11.5 5.5M2 12l.7-3.2L9.8 1.7a1.2 1.2 0 0 1 1.7 0l.8.8a1.2 1.2 0 0 1 0 1.7L5.2 11.3 2 12Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 7.2 5.6 9.8 11 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M3 4.5 6 7.5 9 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AddPlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8 5v6M5 8h6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
