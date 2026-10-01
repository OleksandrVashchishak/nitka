"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import type { Guest, RsvpStatus } from "@/lib/guests-api";
import { updateGuest } from "@/lib/guests-api";
import { isChildGuest, parseCompanions } from "@/lib/guest-party";
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
import {
  SeatingAddTableModal,
  type SeatingAddTableResult,
} from "@/components/seating-add-table-modal";
import {
  SeatingTableModal,
  type SeatTableDraft,
  type SeatTableKind,
} from "@/components/seating-table-modal";
import { CabinetFilterGroup } from "@/components/cabinet-filter-group";
import { CabinetFiltersSheet } from "@/components/cabinet-filters-sheet";
import { IconMore } from "@/components/icon-more";
import { Select } from "@/components/ui/select";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { SeatingChartEditor } from "@/components/seating-chart-editor";
import { NameCardsDesign } from "@/components/name-cards-design";
import {
  saveSeatingPlan,
  type SeatingPlanPayload,
} from "@/lib/seating-api";
import { shapedSeatPosition, defaultShapedSeatCount } from "@/lib/seat-layout";
import { toast } from "@/lib/toast";
import "@/styles/seating/plan.scss";

type MobileTab = "map" | "guests" | "tables";

function firstName(value: string) {
  return value.trim().split(/\s+/)[0] || "";
}

const GROUP_COLORS = ["#8B7CC8", "#5B8DEF", "#4CAF7A", "#C47A3A", "#E07A9A"];
const GRID = 24;
/** Padding past the farthest table edge before canvas ends. */
const CANVAS_PAD = 48;
/** Seats stick out past the table body. */
const SEAT_BLEED = 28;

const TABLE_KIND_OPTIONS = [
  ["round", "Круглий"],
  ["long", "Довгий"],
  ["presidium", "Президіум"],
  ["kids", "Дитячий"],
  ["t-shape", "Т-форма"],
  ["p-shape", "П-форма"],
] as const;

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
  /** Visual layout for kids tables (round vs long). */
  shape?: "round" | "long";
  label: string;
  x: number;
  y: number;
  /** Degrees clockwise. */
  rotation?: number;
  seats: SeatSpot[];
};

function snap(n: number) {
  return Math.max(0, Math.round(n / GRID) * GRID);
}

function tableBodySize(table: PlanTable): { w: number; h: number } {
  if (table.kind === "presidium") return { w: 320, h: 56 };
  if (table.kind === "round") return { w: 120, h: 120 };
  if (table.kind === "long") return { w: 280, h: 48 };
  if (table.kind === "t-shape" || table.kind === "p-shape") {
    return { w: 280, h: 200 };
  }
  if (table.shape === "long") return { w: 240, h: 48 };
  return { w: 100, h: 100 };
}

/** Content box the canvas must cover (tables + seat bleed + pad). */
function canvasContentSize(tables: PlanTable[]): { width: number; height: number } {
  let maxRight = 0;
  let maxBottom = 0;
  for (const table of tables) {
    const { w, h } = tableBodySize(table);
    const rot = Math.abs(table.rotation ?? 0) % 180;
    if (rot > 5 && rot < 175) {
      const rad = (rot * Math.PI) / 180;
      const bw = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad));
      const bh = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
      const cx = table.x + w / 2;
      const cy = table.y + h / 2;
      maxRight = Math.max(maxRight, cx + bw / 2 + SEAT_BLEED);
      maxBottom = Math.max(maxBottom, cy + bh / 2 + SEAT_BLEED);
    } else {
      maxRight = Math.max(maxRight, table.x + w + SEAT_BLEED);
      maxBottom = Math.max(maxBottom, table.y + h + SEAT_BLEED);
    }
  }
  return {
    width: Math.ceil(maxRight + CANVAS_PAD),
    height: Math.ceil(maxBottom + CANVAS_PAD),
  };
}

function defaultTableLabel(kind: PlanTable["kind"], numbered: number) {
  if (kind === "presidium") return "Президіум";
  if (kind === "kids") return "Дитячий стіл";
  if (kind === "t-shape") return `Т-форма ${numbered}`;
  if (kind === "p-shape") return `П-форма ${numbered}`;
  return `Стіл ${numbered}`;
}

type Props = {
  weddingId: string;
  guests: Guest[];
  draft: {
    tables: SeatingTablesDraft;
    guests: SeatingGuestsDraft;
  };
  initialPlan?: SeatingPlanPayload | null;
  partnerOneName?: string;
  partnerTwoName?: string;
  weddingDate?: string | null;
  onEditGuests?: () => void;
  onGuestsRefresh?: () => Promise<void>;
};

type SeatFilter = "all" | "seated" | "unseated";
type SideFilter = "all" | "BRIDE" | "GROOM" | "BOTH";
type PopoverState =
  | { kind: "seat"; key: string }
  | { kind: "list"; key: string }
  | null;

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function isChild(guest: Guest) {
  return isChildGuest(guest.notes);
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
    const companions = parseCompanions(g.notes, g).filter((c) =>
      c.name.trim(),
    );
    rows.push({
      key: mainKey,
      guestId: g.id,
      name: g.name,
      isPlusOne: false,
      isChild: isChild(g),
      side: g.side,
      rsvpStatus: g.rsvpStatus,
      linkedKey: companions[0] ? `${g.id}:plus` : null,
    });
    companions.forEach((companion, index) => {
      rows.push({
        key: index === 0 ? `${g.id}:plus` : `${g.id}:plus:${index}`,
        guestId: g.id,
        name: companion.name.trim(),
        isPlusOne: true,
        isChild: companion.isChild,
        side: g.side,
        rsvpStatus: companion.rsvpStatus,
        linkedKey: mainKey,
      });
    });
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
    tables.format === "round" ||
    tables.format === "mixed" ||
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
    tables.format === "long" ||
    tables.format === "mixed" ||
    longCount > 0;

  if (needsLong) {
    const n =
      longCount > 0
        ? longCount
        : tables.format === "long" || tables.format === "mixed"
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

  if (tables.format === "p-shape") {
    result.push({
      id: uid("p"),
      kind: "p-shape",
      label: "П-форма",
      x: 200,
      y,
      seats: makeSeats(defaultShapedSeatCount("p-shape")),
    });
    y += 260;
  }

  if (tables.format === "t-shape") {
    result.push({
      id: uid("t"),
      kind: "t-shape",
      label: "Т-форма",
      x: 200,
      y,
      seats: makeSeats(defaultShapedSeatCount("t-shape")),
    });
    y += 260;
  }

  if (tables.hasKidsTable) {
    const kidsCount = Math.max(
      1,
      Number.parseInt(tables.kidsTableCount, 10) || 1,
    );
    const kidsShape = tables.kidsTableShape === "long" ? "long" : "round";
    const kidsSeats = 8;
    for (let i = 0; i < kidsCount; i += 1) {
      result.push({
        id: uid("kids"),
        kind: "kids",
        shape: kidsShape,
        label:
          kidsCount === 1 ? "Дитячий стіл" : `Дитячий стіл ${i + 1}`,
        x: 80 + (i % 4) * 200,
        y: y + Math.floor(i / 4) * (kidsShape === "long" ? 120 : 160),
        seats: makeSeats(kidsSeats),
      });
    }
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
  shape?: "round" | "long",
): { left: string; top: string } {
  if (kind === "t-shape" || kind === "p-shape") {
    return shapedSeatPosition(kind, index, total);
  }

  const asRound =
    kind === "round" || (kind === "kids" && shape !== "long");
  if (asRound) {
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

function TableShapeSilhouette({ kind }: { kind: PlanTable["kind"] }) {
  if (kind === "t-shape") {
    return (
      <div className="seat-plan-shape" aria-hidden>
        <span className="seat-plan-shape-top" />
        <span className="seat-plan-shape-stem" />
      </div>
    );
  }
  if (kind === "p-shape") {
    return (
      <div className="seat-plan-shape" aria-hidden>
        <span className="seat-plan-shape-top" />
        <span className="seat-plan-shape-leg is-left" />
        <span className="seat-plan-shape-leg is-right" />
      </div>
    );
  }
  return null;
}

export function SeatingPlan({
  weddingId,
  guests,
  draft,
  initialPlan,
  partnerOneName = "",
  partnerTwoName = "",
  weddingDate = null,
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
  const [addKind, setAddKind] = useState<SeatTableKind | null>(null);
  const [printOpen, setPrintOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [nameCardsOpen, setNameCardsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [groupsOpen, setGroupsOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [popover, setPopover] = useState<PopoverState>(null);
  const [detachedKeys, setDetachedKeys] = useState<Set<string>>(
    () => new Set(draft.guests.detachedKeys ?? []),
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [seatPick, setSeatPick] = useState<{
    tableId: string;
    seatId: string;
  } | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("guests");
  const [isMobile, setIsMobile] = useState(false);
  const [draftSeatFilter, setDraftSeatFilter] = useState<SeatFilter>("all");
  const [draftGroupFilter, setDraftGroupFilter] = useState("all");
  const [draftSideFilter, setDraftSideFilter] = useState<SideFilter>("all");
  const [draftTableFilter, setDraftTableFilter] = useState("all");
  const addRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);
  const [floatPop, setFloatPop] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const contentSize = useMemo(() => canvasContentSize(tables), [tables]);
  const canvasStyle = useMemo(() => {
    // Fill the visible wrap at minimum; grow only when tables need more room.
    const barReserve = 52;
    const minW = Math.max(viewport.w, 1);
    const minH = Math.max(viewport.h - barReserve, 1);
    return {
      width: Math.max(contentSize.width, minW),
      height: Math.max(contentSize.height, minH),
    };
  }, [contentSize, viewport]);

  useEffect(() => {
    const el = canvasWrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const sync = () => {
      setViewport({ w: el.clientWidth, h: el.clientHeight });
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setDetachedKeys(new Set(draft.guests.detachedKeys ?? []));
  }, [draft.guests.detachedKeys]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    setDraftSeatFilter(seatFilter);
    setDraftGroupFilter(groupFilter);
    setDraftSideFilter(sideFilter);
    setDraftTableFilter(tableFilter);
    // Sync draft only when opening the sheet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileFiltersOpen]);

  useEffect(() => {
    let fromStored = false;
    if (initialPlan?.tables?.length) {
      setTables(initialPlan.tables as PlanTable[]);
      fromStored = true;
    }
    if (!fromStored) {
      setTables(autoSeat(buildTables(draft.tables), flat, draft.guests));
    }
    setHydrated(true);
    // Only hydrate once per mount (key resets when plan cleared).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [weddingId]);

  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => {
      void saveSeatingPlan({
        tables: tables as SeatingPlanPayload["tables"],
        savedAt: Date.now(),
      }).catch(() => {
        /* silent autosave */
      });
    }, 500);
    return () => window.clearTimeout(t);
  }, [tables, weddingId, hydrated]);

  useEffect(() => {
    function onDoc(event: MouseEvent) {
      const target = event.target as Node;
      if (
        addOpen &&
        !(target as Element).closest?.(".seat-plan-add-menu")
      ) {
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
        if (editingTableId) return;
        setPopover(null);
        setFloatPop(null);
        setAddOpen(false);
        setPrintOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editingTableId]);

  function openFloatPopover(
    kind: "seat" | "list",
    key: string,
    anchor: HTMLElement,
  ) {
    const rect = anchor.getBoundingClientRect();
    const width = 280;
    const estimatedH = kind === "list" ? 280 : 220;
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

  const visibleFlat = useMemo(() => flat, [flat]);

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
  const partnerOneShort = firstName(partnerOneName) || "нареченої";
  const partnerTwoShort = firstName(partnerTwoName) || "нареченого";

  const filterCounts = useMemo(() => {
    const seat = { all: 0, seated: 0, unseated: 0 };
    const side = { all: 0, BRIDE: 0, GROOM: 0, BOTH: 0 };
    const group: Record<string, number> = { all: 0 };
    for (const g of namedGroups) group[g.id] = 0;
    if (draft.tables.hasPresidium) group.presidium = 0;
    if (draft.tables.hasKidsTable) group.kids = 0;
    const table: Record<string, number> = { all: 0 };
    for (const t of tables) table[t.id] = 0;

    for (const g of visibleFlat) {
      const seated = seatOfGuest.has(g.key);
      seat.all += 1;
      if (seated) seat.seated += 1;
      else seat.unseated += 1;

      side.all += 1;
      if (g.side === "BRIDE") side.BRIDE += 1;
      else if (g.side === "GROOM") side.GROOM += 1;
      else if (g.side === "BOTH") side.BOTH += 1;

      const assign = draft.guests.assignments[g.key] ?? null;
      group.all += 1;
      if (typeof assign === "string" && assign in group) {
        group[assign] = (group[assign] ?? 0) + 1;
      }

      table.all += 1;
      const info = seatOfGuest.get(g.key);
      if (info && info.tableId in table) {
        table[info.tableId] = (table[info.tableId] ?? 0) + 1;
      }
    }
    return { seat, side, group, table };
  }, [
    visibleFlat,
    seatOfGuest,
    namedGroups,
    tables,
    draft.guests.assignments,
    draft.tables.hasPresidium,
    draft.tables.hasKidsTable,
  ]);

  const activeFilterChips = useMemo(() => {
    const chips: Array<{ id: string; label: string; onClear: () => void }> = [];
    if (seatFilter === "seated") {
      chips.push({
        id: "seat-seated",
        label: "Посаджені",
        onClear: () => setSeatFilter("all"),
      });
    } else if (seatFilter === "unseated") {
      chips.push({
        id: "seat-unseated",
        label: "Не посаджені",
        onClear: () => setSeatFilter("all"),
      });
    }
    if (groupFilter !== "all") {
      const label =
        groupFilter === "presidium"
          ? "Президіум"
          : groupFilter === "kids"
            ? "Дитячий стіл"
            : namedGroups.find((g) => g.id === groupFilter)?.name || "Група";
      chips.push({
        id: `group-${groupFilter}`,
        label,
        onClear: () => setGroupFilter("all"),
      });
    }
    if (sideFilter === "BRIDE") {
      chips.push({
        id: "side-bride",
        label: `Гості ${partnerOneShort}`,
        onClear: () => setSideFilter("all"),
      });
    } else if (sideFilter === "GROOM") {
      chips.push({
        id: "side-groom",
        label: `Гості ${partnerTwoShort}`,
        onClear: () => setSideFilter("all"),
      });
    }
    if (tableFilter !== "all") {
      const t = tables.find((x) => x.id === tableFilter);
      chips.push({
        id: `table-${tableFilter}`,
        label: t?.label || "Стіл",
        onClear: () => setTableFilter("all"),
      });
    }
    return chips;
  }, [
    seatFilter,
    groupFilter,
    sideFilter,
    tableFilter,
    namedGroups,
    tables,
    partnerOneShort,
    partnerTwoShort,
  ]);

  const filtersActive = activeFilterChips.length > 0;

  function applyMobileFilters() {
    setSeatFilter(draftSeatFilter);
    setGroupFilter(draftGroupFilter);
    setSideFilter(draftSideFilter);
    setTableFilter(draftTableFilter);
    setMobileFiltersOpen(false);
  }

  function resetMobileFilters() {
    setDraftSeatFilter("all");
    setDraftGroupFilter("all");
    setDraftSideFilter("all");
    setDraftTableFilter("all");
  }

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
      guest.linkedKey &&
      !detachedKeys.has(guest.key) &&
      !detachedKeys.has(guest.linkedKey)
        ? guestMap.get(guest.linkedKey)
        : null;

    return {
      key,
      guestId: guest.guestId,
      name: guest.name,
      groupLabel: groupLabelFor(key),
      tableLabel: table?.label ?? null,
      rsvpStatus: guest.rsvpStatus,
      isPlusOne: guest.isPlusOne,
      linkedName: linked?.name ?? null,
      swapCandidates,
    };
  }

  const activePopover = popover ? buildPopoverInfo(popover.key) : null;

  function assignToSeat(
    tableId: string,
    seatId: string,
    guestKey: string | null = selectedKey,
  ) {
    if (!guestKey) {
      toast.info("Оберіть гостя зліва");
      return;
    }
    setTables((prev) =>
      prev.map((table) => ({
        ...table,
        seats: table.seats.map((seat) => {
          if (seat.guestKey === guestKey) return { ...seat, guestKey: null };
          if (table.id === tableId && seat.id === seatId) {
            return { ...seat, guestKey };
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

  function openAddTable(kind: SeatTableKind) {
    setAddOpen(false);
    setAddKind(kind);
  }

  function addTables({ kind, tableCount, seatsPerTable }: SeatingAddTableResult) {
    const labeledKinds = new Set(["round", "long", "t-shape", "p-shape"]);
    setTables((prev) => {
      let numbered = prev.filter((t) => labeledKinds.has(t.kind)).length;
      const next = [...prev];
      for (let i = 0; i < tableCount; i += 1) {
        numbered += 1;
        next.push({
          id: uid(kind),
          kind,
          shape: kind === "kids" ? "round" : undefined,
          label: defaultTableLabel(kind, numbered),
          x: snap(100 + (numbered % 3) * 200),
          y: snap(480 + Math.floor(numbered / 3) * 40),
          rotation: 0,
          seats: makeSeats(seatsPerTable),
        });
      }
      return next;
    });
    setAddKind(null);
  }

  function deleteTable(id: string) {
    setTables((prev) => prev.filter((t) => t.id !== id));
    setEditingTableId(null);
    toast.success("Стіл видалено");
  }

  function saveTableDraft(next: SeatTableDraft) {
    setTables((prev) =>
      prev.map((t) =>
        t.id === next.id
          ? {
              ...t,
              kind: next.kind,
              shape: next.shape,
              label: next.label,
              rotation: next.rotation,
              seats: next.seats,
            }
          : t,
      ),
    );
    setEditingTableId(null);
  }

  function onTablePointerDown(
    event: PointerEvent<HTMLDivElement>,
    table: PlanTable,
  ) {
    const target = event.target as Element;
    if (target.closest(".seat-plan-seat, button, input")) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      id: table.id,
      startX: event.clientX,
      startY: event.clientY,
      origX: table.x,
      origY: table.y,
      moved: false,
    };
    setDraggingId(table.id);
  }

  function onTablePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    const x = snap(drag.origX + dx);
    const y = snap(drag.origY + dy);
    setTables((prev) =>
      prev.map((t) => (t.id === drag.id ? { ...t, x, y } : t)),
    );
  }

  function onTablePointerUp(tableId: string) {
    const drag = dragRef.current;
    const wasClick = Boolean(drag && drag.id === tableId && !drag.moved);
    dragRef.current = null;
    setDraggingId(null);
    if (wasClick) setEditingTableId(tableId);
  }

  const editingTable = editingTableId
    ? tables.find((t) => t.id === editingTableId) ?? null
    : null;

  const modalGuests = useMemo(() => {
    const m = new Map<string, { key: string; name: string; color: string }>();
    for (const g of flat) {
      const assign = draft.guests.assignments[g.key] ?? null;
      m.set(g.key, {
        key: g.key,
        name: g.name,
        color: colorForAssign(assign, draft.guests.groups),
      });
    }
    return m;
  }, [flat, draft.guests]);

  return (
    <div className={`seat-plan is-tab-${mobileTab}`}>
      <div className="seat-plan-top">
        <div className="seat-plan-title-wrap">
          <h1 className="seat-plan-title">
            {mobileTab === "map" ? "План розсадки" : "Розсадка"}
          </h1>
          <span className="seat-plan-autosave">
            <span className="seat-plan-autosave-dot" aria-hidden />
            Авто-збереження
          </span>
        </div>

        <div className="seat-plan-actions">
          <button
            type="button"
            className="seat-plan-btn seat-plan-btn--ghost"
            onClick={() => {
              setPrintOpen(false);
              setAddOpen(false);
              setChartOpen(true);
            }}
          >
            <span className="seat-plan-btn-label seat-plan-btn-label--full">
              Зберегти PDF
            </span>
            <span className="seat-plan-btn-label seat-plan-btn-label--short">
              PDF
            </span>
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
              <span className="seat-plan-btn-label seat-plan-btn-label--full">
                Дизайн для друку
              </span>
              <span className="seat-plan-btn-label seat-plan-btn-label--short">
                Дизайн
              </span>
              <ChevronDownIcon />
            </button>
            {printOpen ? (
              <div className="seat-plan-print-dropdown" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setPrintOpen(false);
                    setChartOpen(true);
                  }}
                >
                  Дизайн посадкової карти
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setPrintOpen(false);
                    setNameCardsOpen(true);
                  }}
                >
                  Дизайн іменних карток
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <nav className="seat-plan-mobile-tabs" aria-label="Розділи розсадки">
        {(
          [
            ["map", "Карта розсадки"],
            ["guests", "Список гостей"],
            ["tables", "Столи"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`seat-plan-mobile-tab${
              mobileTab === id ? " is-active" : ""
            }`}
            onClick={() => setMobileTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="seat-plan-layout">
        <aside className="seat-plan-panel">
          <div className="seat-plan-panel-head">
            <h2 className="seat-plan-panel-title">
              Гості
              <span className="seat-plan-panel-count">
                {seatedCount} / {totalGuests} розсаджено
              </span>
              <button
                type="button"
                className="seat-plan-icon-btn"
                aria-label="Редагувати групи"
                onClick={onEditGuests}
              >
                <PencilIcon />
              </button>
            </h2>
          </div>

          <div className="seat-plan-toolbar">
            <label className="seat-plan-search">
              <SearchIcon />
              <input
                type="search"
                placeholder="Пошук гостей"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <button
              type="button"
              className={`seat-plan-filters-btn${
                filtersActive ? " is-active" : ""
              }`}
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontalIcon />
              Фільтри
            </button>
            <button
              type="button"
              className="seat-plan-filters-btn seat-plan-groups-btn"
              aria-label="Редагувати групи"
              onClick={onEditGuests}
            >
              <PencilIcon />
            </button>
          </div>

          {activeFilterChips.length > 0 ? (
            <div className="seat-plan-active-chips">
              {activeFilterChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  className="seat-plan-active-chip"
                  onClick={chip.onClear}
                >
                  {chip.id.startsWith("group-") ? (
                    <span
                      className="seat-plan-chip-dot"
                      style={{
                        background:
                          GROUP_COLORS[
                            Math.max(
                              0,
                              namedGroups.findIndex(
                                (g) => g.id === groupFilter,
                              ),
                            ) % GROUP_COLORS.length
                          ],
                      }}
                    />
                  ) : null}
                  {chip.label}
                </button>
              ))}
            </div>
          ) : null}

          <div
            className={`seat-plan-filters${filtersOpen ? " is-open" : ""}`}
          >
            <button
              type="button"
              className="seat-plan-filters-head"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <span className="seat-plan-filters-title">
                <SlidersHorizontalIcon />
                Фільтри
              </span>
              <span
                className={`seat-plan-collapse-chevron${
                  filtersOpen ? " is-open" : ""
                }`}
                aria-hidden
              >
                <CollapseChevronIcon />
              </span>
            </button>
            {filtersOpen ? (
              <div className="seat-plan-filters-body">
                <Select
                  size="xs"
                  value={seatFilter}
                  onChange={(e) =>
                    setSeatFilter(e.target.value as SeatFilter)
                  }
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
                  onChange={(e) =>
                    setSideFilter(e.target.value as SideFilter)
                  }
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
            ) : null}
          </div>

          <div className="seat-plan-guest-scroll">
            {filteredGuests.map((g, index) => {
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
                      if (isMobile) setMobileTab("map");
                    }}
                  >
                    <span
                      className={`seat-plan-guest-avatar${
                        seated ? "" : " is-empty"
                      } seat-plan-guest-avatar--index`}
                      style={seated ? { background: color } : undefined}
                      data-index={index + 1}
                    >
                      <span className="seat-plan-guest-avatar-initials">
                        {seated ? initials(g.name) : ""}
                      </span>
                      <span className="seat-plan-guest-avatar-num">
                        {index + 1}
                      </span>
                    </span>
                    <span className="seat-plan-guest-name">{g.name}</span>
                    <span className="seat-plan-guest-meta">
                      {seated ? (
                        <span
                          className="seat-plan-guest-check"
                          aria-label="Розсаджено"
                        >
                          <SeatedStatusIcon />
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
                      {g.rsvpStatus === "PENDING" ? (
                        <span
                          className="seat-plan-guest-pending"
                          aria-label="Ще немає відповіді"
                        >
                          <PendingStatusIcon />
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
                      if (isMobile) {
                        setPopover({ kind: "list", key: g.key });
                        setFloatPop(null);
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
              aria-expanded={groupsOpen}
              onClick={() => setGroupsOpen((v) => !v)}
            >
              Групи
              <span
                className={`seat-plan-collapse-chevron${
                  groupsOpen ? " is-open" : ""
                }`}
                aria-hidden
              >
                <CollapseChevronIcon />
              </span>
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

        <div className="seat-plan-canvas-wrap" ref={canvasWrapRef}>
          <div className="seat-plan-canvas-bar">
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
                  {TABLE_KIND_OPTIONS.map(([kind, label]) => (
                    <button
                      key={kind}
                      type="button"
                      role="menuitem"
                      onClick={() => openAddTable(kind)}
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

          <div className="seat-plan-canvas-scroll">
          <div className="seat-plan-canvas" style={canvasStyle}>
            {tables.map((table) => (
              <div
                key={table.id}
                className={`seat-plan-table is-${table.kind}${
                  table.kind === "kids" && table.shape === "long"
                    ? " is-kids-long"
                    : ""
                }${draggingId === table.id ? " is-dragging" : ""}`}
                style={{
                  left: table.x,
                  top: table.y,
                  transform: table.rotation
                    ? `rotate(${table.rotation}deg)`
                    : undefined,
                }}
                onPointerDown={(e) => onTablePointerDown(e, table)}
                onPointerMove={onTablePointerMove}
                onPointerUp={() => onTablePointerUp(table.id)}
                onPointerCancel={() => onTablePointerUp(table.id)}
              >
                <div className="seat-plan-table-body">
                  <TableShapeSilhouette kind={table.kind} />
                  <div className="seat-plan-table-label">
                    <span className="seat-plan-table-label-name">
                      {table.label}
                    </span>
                    <span className="seat-plan-table-label-count">
                      {table.seats.filter((s) => s.guestKey).length}/
                      {table.seats.length}
                    </span>
                  </div>
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
                        table.shape,
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
                            transform: table.rotation
                              ? `translate(-50%, -50%) rotate(${-table.rotation}deg)`
                              : undefined,
                          }}
                          title={guest?.name ?? "Порожнє місце"}
                          onPointerDown={(e) => e.stopPropagation()}
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
                            if (isMobile) {
                              setSeatPick({
                                tableId: table.id,
                                seatId: seat.id,
                              });
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
      </div>

      <div className="seat-plan-tables-mobile">
        <div
          className={`seat-plan-add-menu seat-plan-tables-add${
            addOpen ? " is-open" : ""
          }`}
        >
          <button
            type="button"
            className="seat-plan-btn seat-plan-btn--dark seat-plan-tables-add-btn"
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
              {TABLE_KIND_OPTIONS.map(([kind, label]) => (
                <button
                  key={kind}
                  type="button"
                  role="menuitem"
                  onClick={() => openAddTable(kind)}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <ul className="seat-plan-tables-list">
          {tables.map((table) => {
            const filled = table.seats.filter((s) => s.guestKey).length;
            const shape = tableListShape(table);
            return (
              <li key={table.id}>
                <button
                  type="button"
                  className="seat-plan-tables-item"
                  onClick={() => {
                    setEditingTableId(table.id);
                  }}
                >
                  <span className="seat-plan-tables-item-name">
                    {table.label}
                  </span>
                  <span className="seat-plan-tables-item-count">
                    {filled}/{table.seats.length}
                  </span>
                  {shape ? (
                    <span
                      className={`seat-plan-tables-shape is-${shape}`}
                      aria-hidden
                    />
                  ) : null}
                  <span className="seat-plan-tables-chevron" aria-hidden>
                    <ChevronRightIcon />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {tables.length === 0 ? (
          <p className="seat-plan-tables-empty">Столів ще немає.</p>
        ) : null}
      </div>

      {addKind ? (
        <SeatingAddTableModal
          open
          kind={addKind}
          onClose={() => setAddKind(null)}
          onAdd={addTables}
        />
      ) : null}

      {editingTable ? (
        <SeatingTableModal
          open
          table={{
            id: editingTable.id,
            kind: editingTable.kind,
            shape: editingTable.shape,
            label: editingTable.label,
            rotation: editingTable.rotation ?? 0,
            seats: editingTable.seats,
          }}
          guests={modalGuests}
          onClose={() => setEditingTableId(null)}
          onSave={saveTableDraft}
          onDelete={deleteTable}
        />
      ) : null}

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

      {popover?.kind === "list" && activePopover && isMobile && !floatPop ? (
        <div className="seat-plan-sheet">
          <button
            type="button"
            className="seat-plan-sheet__backdrop"
            aria-label="Закрити"
            onClick={closePopover}
          />
          <div className="seat-plan-sheet__panel">
            <GuestListPopover
              variant="sheet"
              info={activePopover}
              onSetRsvp={(status) => {
                void setRsvp(activePopover.guestId, status);
                closePopover();
              }}
              onLeaveUnseated={() => {
                freeGuest(activePopover.key);
                closePopover();
              }}
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
                      closePopover();
                    }
                  : null
              }
              onSeatElsewhere={() => {
                setSelectedKey(activePopover.key);
                setMobileTab("map");
                closePopover();
                toast.info("Оберіть місце на карті");
              }}
              onClose={closePopover}
            />
          </div>
        </div>
      ) : null}

      {seatPick ? (
        <CabinetOverlay
          open
          onClose={() => setSeatPick(null)}
          title="Посадити"
          variant="modal"
          mobileVariant="fullscreen"
          panelClassName="seat-pick-modal"
          bodyClassName="seat-pick-modal-body"
        >
          <div className="seat-pick-toolbar">
            <label className="seat-plan-search seat-pick-search">
              <SearchIcon />
              <input
                type="search"
                placeholder="Пошук гостей"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <button
              type="button"
              className={`seat-plan-filters-btn seat-pick-filters-btn${
                filtersActive ? " is-active" : ""
              }`}
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontalIcon />
              Фільтри
            </button>
          </div>

          <div className="seat-pick-list">
            {filteredGuests.map((g, index) => {
              const seated = seatOfGuest.has(g.key);
              const next = filteredGuests[index + 1];
              const linked =
                Boolean(g.linkedKey) && !detachedKeys.has(g.key);
              const clusterPrimaryKey = linked ? g.linkedKey! : g.key;
              const nextInCluster = Boolean(
                next &&
                  next.linkedKey === clusterPrimaryKey &&
                  !detachedKeys.has(next.key),
              );
              const clusterStart =
                !g.linkedKey &&
                Boolean(
                  next &&
                    next.linkedKey === g.key &&
                    !detachedKeys.has(next.key),
                );
              const clusterMid = linked;
              const clusterEnd =
                (clusterStart || clusterMid) && !nextInCluster;
              const sideLetter =
                g.name.trim().charAt(0).toUpperCase() || "·";

              return (
                <div
                  key={g.key}
                  className={`seat-pick-row-wrap${
                    clusterStart || clusterMid ? " is-linked" : ""
                  }${clusterStart ? " is-cluster-start" : ""}${
                    clusterMid ? " is-cluster-mid" : ""
                  }${clusterEnd ? " is-cluster-end" : ""}`}
                >
                  <button
                    type="button"
                    className="seat-pick-row"
                    onClick={() => {
                      if (!seatPick) return;
                      assignToSeat(seatPick.tableId, seatPick.seatId, g.key);
                      setSelectedKey(g.key);
                      setSeatPick(null);
                      closePopover();
                    }}
                  >
                    <span
                      className={`seat-pick-avatar${
                        seated ? "" : " is-empty"
                      }`}
                    >
                      {seated ? initials(g.name) : ""}
                    </span>
                    <span className="seat-pick-name">{g.name}</span>
                    <span className="seat-pick-meta">
                      {g.rsvpStatus === "YES" ? (
                        <span
                          className="seat-plan-guest-check"
                          aria-label="Підтверджено"
                        >
                          <SeatedStatusIcon />
                        </span>
                      ) : g.rsvpStatus === "PENDING" ? (
                        <span
                          className="seat-plan-guest-pending"
                          aria-label="Ще немає відповіді"
                        >
                          <PendingStatusIcon />
                        </span>
                      ) : null}
                      <span className="seat-pick-side" aria-hidden>
                        {sideLetter}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="seat-plan-icon-btn seat-pick-more"
                    aria-label="Дії з гостем"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedKey(g.key);
                      setPopover({ kind: "list", key: g.key });
                      setFloatPop(null);
                      setSeatPick(null);
                    }}
                  >
                    <IconMore size={14} />
                  </button>
                </div>
              );
            })}
            {filteredGuests.length === 0 ? (
              <p className="seat-pick-empty">Гостей не знайдено.</p>
            ) : null}
          </div>
        </CabinetOverlay>
      ) : null}

      <CabinetFiltersSheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        onApply={applyMobileFilters}
        onReset={resetMobileFilters}
      >
        <CabinetFilterGroup
          title="Посадка"
          items={[
            { id: "all", label: "Всі", count: filterCounts.seat.all },
            {
              id: "seated",
              label: "Посаджені",
              count: filterCounts.seat.seated,
            },
            {
              id: "unseated",
              label: "Не посаджені",
              count: filterCounts.seat.unseated,
            },
          ]}
          active={draftSeatFilter}
          onChange={(id) => setDraftSeatFilter(id as SeatFilter)}
        />
        <CabinetFilterGroup
          title="Групи"
          items={[
            { id: "all", label: "Всі", count: filterCounts.group.all },
            ...namedGroups.map((g) => ({
              id: g.id,
              label: g.name,
              count: filterCounts.group[g.id] ?? 0,
            })),
            ...(draft.tables.hasPresidium
              ? [
                  {
                    id: "presidium",
                    label: "Президіум",
                    count: filterCounts.group.presidium ?? 0,
                  },
                ]
              : []),
            ...(draft.tables.hasKidsTable
              ? [
                  {
                    id: "kids",
                    label: "Дитячий стіл",
                    count: filterCounts.group.kids ?? 0,
                  },
                ]
              : []),
          ]}
          active={draftGroupFilter}
          onChange={setDraftGroupFilter}
        />
        <CabinetFilterGroup
          title="Гості"
          items={[
            { id: "all", label: "Усі", count: filterCounts.side.all },
            {
              id: "BRIDE",
              label: `Гості ${partnerOneShort}`,
              count: filterCounts.side.BRIDE,
            },
            {
              id: "GROOM",
              label: `Гості ${partnerTwoShort}`,
              count: filterCounts.side.GROOM,
            },
          ]}
          active={draftSideFilter}
          onChange={(id) => setDraftSideFilter(id as SideFilter)}
        />
        <CabinetFilterGroup
          title="Столи"
          items={[
            { id: "all", label: "Усі", count: filterCounts.table.all },
            ...tables.map((t, i) => ({
              id: t.id,
              label: t.label || String(i + 1),
              count: filterCounts.table[t.id] ?? 0,
            })),
          ]}
          active={draftTableFilter}
          onChange={setDraftTableFilter}
        />
      </CabinetFiltersSheet>

      {chartOpen ? (
        <SeatingChartEditor
          tables={tables}
          guests={flat.map((g) => ({ key: g.key, name: g.name }))}
          partnerOneName={partnerOneName}
          partnerTwoName={partnerTwoName}
          weddingDate={weddingDate}
          onClose={() => setChartOpen(false)}
        />
      ) : null}

      {nameCardsOpen ? (
        <NameCardsDesign
          names={flat.map((g) => g.name)}
          onClose={() => setNameCardsOpen(false)}
        />
      ) : null}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M13.0001 13.0001L10.1068 10.1068M11.6667 6.33333C11.6667 9.27885 9.27885 11.6667 6.33333 11.6667C3.38781 11.6667 1 9.27885 1 6.33333C1 3.38781 3.38781 1 6.33333 1C9.27885 1 11.6667 3.38781 11.6667 6.33333Z"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinecap="round"
      />
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

function SlidersHorizontalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6.66667 3.33333H2M8 12.6667H2M9.33333 2V4.66667M10.6667 11.3333V14M14 8H8M14 12.6667H10.6667M14 3.33333H9.33333M5.33333 6.66667V9.33333M5.33333 8H2"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CollapseChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 5L8 11L14 5"
        stroke="#ABABAB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SeatedStatusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <circle cx="6.5" cy="6.5" r="6" stroke="#3EA635" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.77976 4.08567C9.00861 4.24021 9.06886 4.551 8.91433 4.77985L6.21332 8.77981C6.12592 8.90925 5.98306 8.9904 5.82713 8.9992C5.67119 9.008 5.5201 8.94343 5.4187 8.82465L4.11974 7.3032C3.94045 7.09318 3.96534 6.77759 4.17535 6.59829C4.38537 6.41899 4.70096 6.44389 4.88026 6.6539L5.75242 7.67546L8.08559 4.22024C8.24012 3.99139 8.55091 3.93114 8.77976 4.08567Z"
        fill="#3EA635"
      />
    </svg>
  );
}

function PendingStatusIcon() {
  return (
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" aria-hidden>
      <path
        d="M7 4.4V8L9.4 9.2M13 8C13 11.3137 10.3137 14 7 14C3.68629 14 1 11.3137 1 8C1 4.68629 3.68629 2 7 2C10.3137 2 13 4.68629 13 8Z"
        stroke="#EDAF44"
        strokeLinecap="round"
      />
    </svg>
  );
}

function tableListShape(table: PlanTable): "round" | "long" | null {
  if (table.kind === "presidium") return null;
  if (table.kind === "round") return "round";
  if (table.kind === "kids" && table.shape !== "long") return "round";
  return "long";
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6 3.5 10.5 8 6 12.5"
        stroke="#ABABAB"
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
