"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type PointerEvent,
} from "react";
import { openCabinetMoreMenu } from "@/lib/cabinet-more-menu";
import { CabinetBackButton } from "@/components/cabinet-back-title";
import type { Guest, RsvpStatus } from "@/lib/guests-api";
import { updateGuest } from "@/lib/guests-api";
import {
  SEATING_GROUP_COLORS,
  childGoesToKidsTable,
  clusterFlags,
  flattenSeatingGuests,
  orderDetachedLast,
} from "@/lib/seating-guests";
import type {
  SeatingGuestAssign,
  SeatingGuestsDraft,
  SeatingTablesDraft,
} from "@/components/seating-wizard";
import {
  GuestListPopover,
  GuestSeatPopover,
  childSeatLabel,
  type GuestPopoverInfo,
} from "@/components/seating-plan-popovers";
import type { ChildNeed } from "@/lib/guest-party";
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
import { IconBaby } from "@/components/icon-baby";
import {
  ResponsibleAvatar,
  ResponsibleAvatarDuo,
} from "@/components/responsible-avatar";
import { Select } from "@/components/ui/select";
import { CabinetOverlay } from "@/components/ui/cabinet-overlay";
import { SeatingChartEditor } from "@/components/seating-chart-editor";
import { NameCardsDesign } from "@/components/name-cards-design";
import {
  saveSeatingPlan,
  type SeatingPlanPayload,
} from "@/lib/seating-api";
import {
  shapedSeatPosition,
  defaultShapedSeatCount,
  tableBodyDims,
} from "@/lib/seat-layout";
import { placeGuest, type PlaceOutcome } from "@/lib/seating-place";
import { toast } from "@/lib/toast";
import {
  detectUaNameGender,
  uaGuestsOfLabel,
  uaNameAccusative,
  uaNameGenitive,
  uaNameInstrumental,
} from "@/lib/ua-name-case";
import "@/styles/seating/plan.scss";


type MobileTab = "map" | "guests" | "tables";

/** 1 місце, 2–4 місця, 5+ місць. */
function seatsWord(n: number) {
  const d10 = n % 10;
  const d100 = n % 100;
  if (d10 === 1 && d100 !== 11) return "місце";
  if (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) return "місця";
  return "місць";
}

function firstName(value: string) {
  return value.trim().split(/\s+/)[0] || "";
}

const GROUP_COLORS = SEATING_GROUP_COLORS;
const GUEST_DRAG_MIME = "application/x-fata-guest-key";
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
  childNeed: ChildNeed | null;
  side: Guest["side"];
  rsvpStatus: RsvpStatus;
  linkedKey: string | null;
  /** Ключ кластера (корінь групи) — для смуги зліва у списку. */
  clusterKey: string;
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

type PlacedOutcome = Extract<PlaceOutcome<PlanTable>, { status: "placed" }>;

function snap(n: number) {
  return Math.max(0, Math.round(n / GRID) * GRID);
}

function tableBodySize(table: PlanTable): { w: number; h: number } {
  const { w, h } = tableBodyDims(table.kind, table.shape, table.seats.length);
  return { w, h };
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
  /** Зберегти від’єднаних гостей у чернетку (щоб не губилось після перезавантаження). */
  onDetachedKeysChange?: (keys: string[]) => void;
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

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

/** Рядки плану зі спільного списку: голова ланцюжка посилається на першого члена, решта — на голову. */
function flattenGuests(guests: Guest[]): FlatGuest[] {
  const rows = flattenSeatingGuests(guests);
  const firstMate = new Map<string, string>();
  for (const r of rows) {
    if (r.linkedTo && !firstMate.has(r.linkedTo)) firstMate.set(r.linkedTo, r.key);
  }
  return rows.map((r) => ({
    key: r.key,
    guestId: r.guestId,
    name: r.name,
    isPlusOne: r.isPlusOne,
    isChild: r.isChild,
    childNeed: r.childNeed,
    side: r.side,
    rsvpStatus: r.rsvpStatus,
    linkedKey: r.linkedTo ?? firstMate.get(r.key) ?? null,
    clusterKey: r.linkedTo ?? r.key,
  }));
}

/** Наречені не є гостями в БД — віртуальні рядки, щоб саджати їх за президіум. */
const COUPLE_GUEST_ID = "__couple__";
const COUPLE_KEYS = ["__couple__:1", "__couple__:2"] as const;

function coupleGuests(partnerOneName: string, partnerTwoName: string): FlatGuest[] {
  const one = partnerOneName.trim() || "Наречена";
  const two = partnerTwoName.trim() || "Наречений";
  const rows: Pick<FlatGuest, "key" | "name" | "side" | "linkedKey">[] = [
    { key: COUPLE_KEYS[0], name: one, side: "BRIDE", linkedKey: COUPLE_KEYS[1] },
    { key: COUPLE_KEYS[1], name: two, side: "GROOM", linkedKey: COUPLE_KEYS[0] },
  ];
  return rows.map((g) => ({
    ...g,
    clusterKey: COUPLE_KEYS[0],
    guestId: COUPLE_GUEST_ID,
    isPlusOne: false,
    isChild: false,
    childNeed: null,
    rsvpStatus: "YES" as RsvpStatus,
  }));
}

/** Free presidium seats ordered from the centre outward. */
function presidiumCentreSeats(table: PlanTable): SeatSpot[] {
  const mid = (table.seats.length - 1) / 2;
  return table.seats
    .map((seat, i) => ({ seat, d: Math.abs(i - mid), i }))
    .filter(({ seat }) => !seat.guestKey)
    .sort((a, b) => a.d - b.d || a.i - b.i)
    .map(({ seat }) => seat);
}

/** Садить наречених за президіум (по центру), якщо вони ще ніде не сидять. */
function seatCoupleAtPresidium(tables: PlanTable[]): PlanTable[] {
  const seatedKeys = new Set(
    tables.flatMap((t) => t.seats.map((s) => s.guestKey).filter(Boolean)),
  );
  const missing = COUPLE_KEYS.filter((k) => !seatedKeys.has(k));
  const presIndex = tables.findIndex((t) => t.kind === "presidium");
  if (!missing.length || presIndex < 0) return tables;

  const pres = {
    ...tables[presIndex],
    seats: tables[presIndex].seats.map((s) => ({ ...s })),
  };
  const free = presidiumCentreSeats(pres);
  for (const key of missing) {
    const seat = free.shift();
    if (seat) seat.guestKey = key;
    else pres.seats.push({ id: uid(`seat-${pres.seats.length}`), guestKey: key });
  }
  return tables.map((t, i) => (i === presIndex ? pres : t));
}

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const HIDDEN_GROUP_COLOR = "#D9D9D9";

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
        x: 80 + i * 260,
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
        x: 80 + (i % 4) * 240,
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
  /** Якщо задано — існуючі місця не чіпаємо, саджаємо лише ці ключі. */
  only?: Set<string>,
): PlanTable[] {
  const next = tables.map((t) => ({
    ...t,
    seats: t.seats.map((s) => ({
      ...s,
      guestKey: only ? s.guestKey : (null as string | null),
    })),
  }));

  const seated = new Set<string>(COUPLE_KEYS);
  if (only) {
    for (const t of next)
      for (const s of t.seats) if (s.guestKey) seated.add(s.guestKey);
  }

  function fill(kind: PlanTable["kind"] | "any", keys: string[]) {
    for (const key of keys) {
      if (seated.has(key)) continue;
      if (only && !only.has(key)) continue;
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

  // Наречені — в центр президіуму, решта президіуму довкола.
  const pres = next.find((t) => t.kind === "presidium");
  if (pres && !only) {
    const centre = presidiumCentreSeats(pres);
    for (const key of COUPLE_KEYS) {
      const seat = centre.shift();
      if (seat) seat.guestKey = key;
    }
  }

  // Нові гості (only): сідає сам лише дитина за дитячий стіл. Дорослих не
  // розсаджуємо — інакше пару розкидає по різних столах; їх садить пара сама.
  if (only) {
    fill(
      "kids",
      flat
        .filter((g) => {
          const assign = draft.assignments[g.key] ?? null;
          return (
            assign === "kids" ||
            (assign === null && childGoesToKidsTable(g.isChild, g.childNeed))
          );
        })
        .map((g) => g.key),
    );
    return next;
  }

  fill("presidium", byAssign("presidium"));
  fill("kids", byAssign("kids"));

  for (const group of draft.groups) {
    fill("any", byAssign(group.id));
  }

  fill(
    "any",
    flat
      .filter((g) => !seated.has(g.key))
      .map((g) => g.key),
  );

  return next;
}

/** Відступ центру стільця від краю столу (стілець 26px + зазор). */
const SEAT_GAP = 22;

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
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      left: `calc(50% + ${cos} * (50% + ${SEAT_GAP}px))`,
      top: `calc(50% + ${sin} * (50% + ${SEAT_GAP}px))`,
    };
  }

  if (kind === "presidium") {
    const t = total <= 1 ? 0.5 : index / (total - 1);
    return { left: `${10 + t * 80}%`, top: `-${SEAT_GAP}px` };
  }

  const half = Math.ceil(total / 2);
  if (index < half) {
    const t = half <= 1 ? 0.5 : index / (half - 1);
    return { left: `${10 + t * 80}%`, top: `-${SEAT_GAP}px` };
  }
  const j = index - half;
  const bottom = Math.max(total - half, 1);
  const t = bottom <= 1 ? 0.5 : j / (bottom - 1);
  return { left: `${10 + t * 80}%`, top: `calc(100% + ${SEAT_GAP}px)` };
}

/** Seat name class: outer side of the table; linear rows stagger every other name. */
function seatNameClass(table: PlanTable, index: number): string {
  const total = table.seats.length;
  const rotation = table.rotation ?? 0;
  const asRound =
    table.kind === "round" || (table.kind === "kids" && table.shape !== "long");
  if (asRound) {
    const angle =
      (Math.PI * 2 * index) / Math.max(total, 1) -
      Math.PI / 2 +
      (rotation * Math.PI) / 180;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    if (Math.abs(x) > 0.5) return x > 0 ? " is-right is-wrap" : " is-left is-wrap";
    return y < 0 ? " is-top" : "";
  }
  return `${seatNameIsTop(table, index) ? " is-top" : ""}${
    index % 2 === 1 ? " is-alt" : ""
  }`;
}

/** Ширина імені збоку від місця за замовчуванням (як у CSS). */
const SIDE_NAME_MAX = 64;
/** Вужче — ім’я не показуємо (лишається підказка при наведенні). */
const SIDE_NAME_MIN = 22;
const SEAT_RADIUS = 13;

/**
 * Скільки px є для імені збоку від місця за круглим столом, щоб не налазити
 * на сусідній стіл. Ключ — `${table.id}:${seat.id}`; лише для бічних імен.
 * Простір до круглого сусіда ділимо навпіл — його імена теж ростуть назустріч.
 */
function sideNameRoom(tables: PlanTable[]): Map<string, number> {
  const room = new Map<string, number>();
  const geo = tables.map((t) => {
    const { w, h } = tableBodySize(t);
    const round = t.kind === "round" || (t.kind === "kids" && t.shape !== "long");
    const rot = Math.abs(t.rotation ?? 0) % 180;
    const rad = (rot * Math.PI) / 180;
    const bw = round ? w : Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad));
    const bh = round ? h : Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
    return {
      t,
      round,
      cx: t.x + w / 2,
      cy: t.y + h / 2,
      ring: w / 2 + SEAT_GAP,
      bw,
      bh,
    };
  });
  const halfText = 11; // до двох рядків по 9px
  for (const g of geo) {
    if (!g.round) continue;
    const n = g.t.seats.length;
    g.t.seats.forEach((seat, i) => {
      const angle =
        (Math.PI * 2 * i) / Math.max(n, 1) -
        Math.PI / 2 +
        ((g.t.rotation ?? 0) * Math.PI) / 180;
      const cos = Math.cos(angle);
      if (Math.abs(cos) <= 0.5) return;
      const dir = cos > 0 ? 1 : -1;
      const sx = g.cx + cos * g.ring;
      const sy = g.cy + Math.sin(angle) * g.ring;
      const edge = sx + dir * SEAT_RADIUS;
      const start = edge + dir * 4;
      let best = SIDE_NAME_MAX;
      for (const o of geo) {
        if (o === g) continue;
        let near: number | null = null;
        if (o.round) {
          const r = o.ring + SEAT_RADIUS;
          const dy = Math.max(0, Math.abs(sy - o.cy) - halfText);
          if (dy >= r) continue;
          const half = Math.sqrt(r * r - dy * dy);
          near = dir > 0 ? o.cx - half : o.cx + half;
          if ((near - edge) * dir <= 0) continue;
          near = (edge + near) / 2;
        } else {
          const top = o.cy - o.bh / 2 - SEAT_BLEED - 14;
          const bottom = o.cy + o.bh / 2 + SEAT_BLEED + 14;
          if (sy + halfText <= top || sy - halfText >= bottom) continue;
          near = dir > 0 ? o.cx - o.bw / 2 - SEAT_BLEED : o.cx + o.bw / 2 + SEAT_BLEED;
          if ((near - edge) * dir <= 0) continue;
          near -= dir * 4;
        }
        best = Math.min(best, (near - start) * dir);
      }
      if (best < SIDE_NAME_MAX) room.set(`${g.t.id}:${seat.id}`, Math.floor(best));
    });
  }
  return room;
}

function seatNameIsTop(table: PlanTable, index: number): boolean {
  const total = table.seats.length;
  let top: boolean;
  if (table.kind === "presidium") top = true;
  else if (table.kind === "t-shape" || table.kind === "p-shape") {
    top = index < Math.min(Math.ceil(total / 2), 8);
  } else top = index < Math.ceil(total / 2);
  const rot = (((table.rotation ?? 0) % 360) + 360) % 360;
  return rot > 90 && rot < 270 ? !top : top;
}

function bodyStyle(table: PlanTable): React.CSSProperties {
  const { w, h, scale } = tableBodyDims(
    table.kind,
    table.shape,
    table.seats.length,
  );
  return {
    width: w,
    height: h,
    ...(scale ? ({ "--shape-scale": scale } as React.CSSProperties) : null),
  };
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
  onDetachedKeysChange,
}: Props) {
  const flat = useMemo(
    () => [
      ...coupleGuests(partnerOneName, partnerTwoName),
      ...flattenGuests(guests),
    ],
    [guests, partnerOneName, partnerTwoName],
  );
  const knownKeysRef = useRef<Set<string> | null>(null);
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
  /** Групи, чий колір вимкнено фільтром (presidium / kids / group id). */
  const [hiddenGroups, setHiddenGroups] = useState<Set<string>>(
    () => new Set(),
  );
  const visibleColor = (assign: SeatingGuestAssign) =>
    typeof assign === "string" && hiddenGroups.has(assign)
      ? HIDDEN_GROUP_COLOR
      : colorForAssign(assign, draft.guests.groups);
  const [hydrated, setHydrated] = useState(false);
  const [popover, setPopover] = useState<PopoverState>(null);
  const [detachedKeys, setDetachedKeys] = useState<Set<string>>(
    () => new Set(draft.guests.detachedKeys ?? []),
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragGuestKey, setDragGuestKey] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [seatPick, setSeatPick] = useState<{
    tableId: string;
    seatId: string;
  } | null>(null);
  const [seatConflict, setSeatConflict] = useState<{
    tableId: string;
    seatId: string;
    guestKey: string;
    /** Ланцюжок, який мав би сісти разом (партнер, діти). */
    mateKeys: string[];
    /** Місць для гостя й ланцюжка за столом (разом із цим місцем). */
    available: number;
  } | null>(null);
  /** «Посадити за інший стіл» (mobile): наступний тап по місцю садить цього гостя. */
  const [reseatKey, setReseatKey] = useState<string | null>(null);
  /** Пошук у модалці «Посадити» — окремий від пошуку списку. */
  const [pickQuery, setPickQuery] = useState("");
  const [saveFailed, setSaveFailed] = useState(false);
  const [saveRetry, setSaveRetry] = useState(0);
  const [conflictSwapOpen, setConflictSwapOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("guests");
  const [isMobile, setIsMobile] = useState(false);
  const [draftSeatFilter, setDraftSeatFilter] = useState<SeatFilter>("all");
  const [draftGroupFilter, setDraftGroupFilter] = useState("all");
  const [draftSideFilter, setDraftSideFilter] = useState<SideFilter>("all");
  const [draftTableFilter, setDraftTableFilter] = useState("all");
  const addRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const canvasScrollRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [mapArea, setMapArea] = useState({ w: 0, h: 0 });
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

  const liveContentSize = useMemo(() => canvasContentSize(tables), [tables]);
  // Поки тягнемо стіл, розмір/масштаб карти не міняємо — інакше на mobile
  // «вписаний» план перемасштабовується під пальцем і стіл стрибає.
  const frozenContentSizeRef = useRef(liveContentSize);
  const freezeContentSize = Boolean(draggingId) && isMobile;
  if (!freezeContentSize) frozenContentSizeRef.current = liveContentSize;
  const contentSize = freezeContentSize
    ? frozenContentSizeRef.current
    : liveContentSize;
  // Mobile: fit the whole plan into the visible area (no scrolling).
  const mobileFit = useMemo(() => {
    if (!isMobile || mapArea.w < 1 || mapArea.h < 1) return null;
    const scale = Math.min(
      1,
      mapArea.w / contentSize.width,
      mapArea.h / contentSize.height,
    );
    return {
      scale,
      x: (mapArea.w - contentSize.width * scale) / 2,
      y: (mapArea.h - contentSize.height * scale) / 2,
    };
  }, [isMobile, mapArea, contentSize]);
  // Mobile: pinch-zoom + two-finger pan поверх «вписаного» вигляду.
  const [mapView, setMapView] = useState({ k: 1, x: 0, y: 0 });
  const mapViewRef = useRef(mapView);
  mapViewRef.current = mapView;
  const mobileFitRef = useRef(mobileFit);
  mobileFitRef.current = mobileFit;
  const pinchingRef = useRef(false);
  const touchDragRef = useRef<{
    key: string;
    startX: number;
    startY: number;
    active: boolean;
  } | null>(null);
  const suppressSeatClickRef = useRef(false);
  const moveFrameRef = useRef<{ id: number | null; fn: (() => void) | null }>(
    { id: null, fn: null },
  );
  const [touchGhost, setTouchGhost] = useState<{
    key: string;
    x: number;
    y: number;
  } | null>(null);
  const canvasScale = mobileFit ? mobileFit.scale * mapView.k : 1;
  const canvasStyle = useMemo(() => {
    if (mobileFit) {
      return {
        width: contentSize.width,
        height: contentSize.height,
        transform: `translate(${mobileFit.x + mapView.x}px, ${mobileFit.y + mapView.y}px) scale(${mobileFit.scale * mapView.k})`,
        transformOrigin: "0 0",
      };
    }
    // Fill the visible wrap at minimum; grow only when tables need more room.
    const barReserve = 52;
    const minW = Math.max(viewport.w, 1);
    const minH = Math.max(viewport.h - barReserve, 1);
    return {
      width: Math.max(contentSize.width, minW),
      height: Math.max(contentSize.height, minH),
    };
  }, [contentSize, viewport, mobileFit, mapView]);

  useEffect(() => {
    const el = canvasScrollRef.current;
    if (!el || !isMobile) return;
    let last: { cx: number; cy: number; dist: number } | null = null;
    const read = (e: TouchEvent) => {
      const a = e.touches[0];
      const b = e.touches[1];
      const r = el.getBoundingClientRect();
      return {
        cx: (a.clientX + b.clientX) / 2 - r.left,
        cy: (a.clientY + b.clientY) / 2 - r.top,
        dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
      };
    };
    const beginPinch = (e: TouchEvent) => {
      last = read(e);
      pinchingRef.current = true;
      // другий палець — це жест, а не перетягування столу
      dragRef.current = null;
      setDraggingId(null);
    };
    const onStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) beginPinch(e);
    };
    const onMove = (e: TouchEvent) => {
      const fit = mobileFitRef.current;
      if (e.touches.length < 2 || !fit) return;
      e.preventDefault();
      // iOS інколи не віддає touchstart другого пальця — підхоплюємо жест тут
      if (!last) {
        beginPinch(e);
        return;
      }
      const cur = read(e);
      const v = mapViewRef.current;
      const k = Math.min(4, Math.max(1, v.k * (cur.dist / (last.dist || 1))));
      const s = fit.scale * v.k;
      const s2 = fit.scale * k;
      const tx = fit.x + v.x;
      const ty = fit.y + v.y;
      const nx = cur.cx - ((last.cx - tx) / s) * s2;
      const ny = cur.cy - ((last.cy - ty) / s) * s2;
      last = cur;
      setMapView({ k, x: nx - fit.x, y: ny - fit.y });
    };
    const onEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) last = null;
      if (e.touches.length === 0) {
        pinchingRef.current = false;
        if (mapViewRef.current.k <= 1.01) setMapView({ k: 1, x: 0, y: 0 });
      }
    };
    // Safari (iOS) має власний pinch-жест: якщо його не заблокувати, система
    // перехоплює дотики (touchcancel) і наш touchmove не приходить.
    const stopGesture = (e: Event) => e.preventDefault();
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    el.addEventListener("gesturestart", stopGesture, { passive: false });
    el.addEventListener("gesturechange", stopGesture, { passive: false });
    el.addEventListener("gestureend", stopGesture, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
      el.removeEventListener("gesturestart", stopGesture);
      el.removeEventListener("gesturechange", stopGesture);
      el.removeEventListener("gestureend", stopGesture);
    };
  }, [isMobile, mobileTab]);

  // «Зберегти PDF»: друкуємо лише робочу зону (столи + імена), обрізану по столах.
  function printCanvas() {
    if (tables.length === 0) {
      toast.info("Спочатку додай столи на план");
      return;
    }
    const margin = 80;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const table of tables) {
      const { w, h } = tableBodySize(table);
      const rot = Math.abs(table.rotation ?? 0) % 180;
      const rad = (rot * Math.PI) / 180;
      const bw = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad));
      const bh = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
      const cx = table.x + w / 2;
      const cy = table.y + h / 2;
      minX = Math.min(minX, cx - bw / 2);
      minY = Math.min(minY, cy - bh / 2);
      maxX = Math.max(maxX, cx + bw / 2);
      maxY = Math.max(maxY, cy + bh / 2);
    }
    const width = Math.ceil(maxX - minX + margin * 2);
    const height = Math.ceil(maxY - minY + margin * 2);
    const dx = Math.round(margin - minX);
    const dy = Math.round(margin - minY);

    const style = document.createElement("style");
    style.textContent = `@media print {
  @page { size: ${width}px ${height}px; margin: 0; }
  html, body { width: ${width}px !important; height: ${height}px !important; }
  body.is-seat-plan-print .seat-plan-canvas {
    width: ${width}px !important;
    height: ${height}px !important;
  }
  body.is-seat-plan-print .seat-plan-canvas > .seat-plan-table {
    margin: ${dy}px 0 0 ${dx}px;
  }
}`;
    document.head.appendChild(style);
    const prevShowNames = showNames;
    setShowNames(true);
    const cleanup = () => {
      document.body.classList.remove("is-seat-plan-print");
      document.getElementById("seat-plan-print-root")?.remove();
      style.remove();
      setShowNames(prevShowNames);
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    // Імена показуються після рендера — чекаємо, потім клонуємо полотно в окремий корінь на body
    window.setTimeout(() => {
      const canvas = document.querySelector<HTMLElement>(".seat-plan-canvas");
      if (!canvas) {
        cleanup();
        return;
      }
      const root = document.createElement("div");
      root.id = "seat-plan-print-root";
      const clone = canvas.cloneNode(true) as HTMLElement;
      clone.removeAttribute("style");
      root.appendChild(clone);
      document.body.appendChild(root);
      document.body.classList.add("is-seat-plan-print");
      window.setTimeout(() => window.print(), 50);
    }, 100);
  }

  useEffect(() => {
    const el = canvasScrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const sync = () => setMapArea({ w: el.clientWidth, h: el.clientHeight });
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mobileTab]);

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

  // Режим «Посадити за інший стіл» живе лише на вкладці карти.
  useEffect(() => {
    if (mobileTab !== "map" || !isMobile) setReseatKey(null);
  }, [mobileTab, isMobile]);

  // Кожне відкриття «Посадити» — з чистим пошуком.
  useEffect(() => {
    if (seatPick) setPickQuery("");
  }, [seatPick?.tableId, seatPick?.seatId]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const stored = seatCoupleAtPresidium(initialPlan.tables as PlanTable[]);
      // Старі плани без knownKeys: відомі = ті, хто вже сидить.
      const known = new Set<string>(
        initialPlan.knownKeys ??
          stored.flatMap((t) =>
            t.seats.flatMap((s) => (s.guestKey ? [s.guestKey] : [])),
          ),
      );
      knownKeysRef.current = known;
      const fresh = new Set(
        flat.filter((g) => !known.has(g.key)).map((g) => g.key),
      );
      for (const k of fresh) known.add(k);
      setTables(
        fresh.size ? autoSeat(stored, flat, draft.guests, fresh) : stored,
      );
      fromStored = true;
    }
    if (!fromStored) {
      knownKeysRef.current = new Set(flat.map((g) => g.key));
      setTables(autoSeat(buildTables(draft.tables), flat, draft.guests));
    }
    setHydrated(true);
    // Only hydrate once per mount (key resets when plan cleared).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [weddingId]);

  // Нові гості (яких ще не було в плані): автоматично сідають лише діти за дитячий стіл.
  useEffect(() => {
    if (!hydrated) return;
    setTables((prev) => {
      const known = knownKeysRef.current;
      if (!known) {
        knownKeysRef.current = new Set(flat.map((g) => g.key));
        return prev;
      }
      const fresh = new Set(
        flat.filter((g) => !known.has(g.key)).map((g) => g.key),
      );
      if (!fresh.size) return prev;
      for (const k of fresh) known.add(k);
      return autoSeat(prev, flat, draft.guests, fresh);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- лише при зміні гостей
  }, [flat, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const present = new Set(flat.map((g) => g.key));
    setTables((prev) => {
      const stale = prev.some((t) =>
        t.seats.some((s) => s.guestKey && !present.has(s.guestKey)),
      );
      if (!stale) return prev;
      return prev.map((t) => ({
        ...t,
        seats: t.seats.map((s) =>
          s.guestKey && !present.has(s.guestKey)
            ? { ...s, guestKey: null }
            : s,
        ),
      }));
    });
  }, [flat, hydrated]);

  const saveFailedRef = useRef(false);
  useEffect(() => {
    if (!hydrated) return;
    let retryTimer: number | undefined;
    const t = window.setTimeout(() => {
      // Видалені гості з knownKeys прибираємо — інакше масив лише росте.
      const present = new Set(flat.map((g) => g.key));
      const known = knownKeysRef.current;
      if (known) {
        for (const k of known) if (!present.has(k)) known.delete(k);
      }
      saveSeatingPlan({
        tables: tables as SeatingPlanPayload["tables"],
        knownKeys: [...(known ?? [])],
        savedAt: Date.now(),
      })
        .then(() => {
          saveFailedRef.current = false;
          setSaveFailed(false);
        })
        .catch(() => {
          if (!saveFailedRef.current) {
            toast.error("Не вдалося зберегти розсадку. Пробуємо ще раз…");
          }
          saveFailedRef.current = true;
          setSaveFailed(true);
          retryTimer = window.setTimeout(() => setSaveRetry((n) => n + 1), 5000);
        });
    }, 500);
    return () => {
      window.clearTimeout(t);
      if (retryTimer) window.clearTimeout(retryTimer);
    };
    // flat читаємо лише в момент збереження
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tables, weddingId, hydrated, saveRetry]);

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
        setReseatKey(null);
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

  const nameRoom = useMemo(() => sideNameRoom(tables), [tables]);

  const seatedCount = seatOfGuest.size;
  const totalGuests = visibleFlat.length;

  /** Від’єднати супутника від пари/сім’ї і зберегти це в чернетку. */
  function detachLinked(key: string) {
    const guest = guestMap.get(key);
    if (!guest?.linkedKey) return;
    const target = guest.isPlusOne ? key : guest.linkedKey;
    const next = new Set(detachedKeys);
    next.add(target);
    setDetachedKeys(next);
    onDetachedKeysChange?.(Array.from(next));
    freeGuestCluster(target);
    toast.success("Від’єднано");
  }

  const clusterRootOf = (g: FlatGuest) =>
    detachedKeys.has(g.key) ? null : g.clusterKey;

  const filteredGuests = useMemo(() => {
    const q = query.trim().toLowerCase();
    const shown = visibleFlat.filter((g) => {
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
      if (sideFilter !== "all" && g.side !== sideFilter) return false;
      if (tableFilter !== "all") {
        const info = seatOfGuest.get(g.key);
        if (!info || info.tableId !== tableFilter) return false;
      }
      return true;
    });
    // Відʼєднаний — у кінець свого ланцюжка, щоб смуга решти (діти з мамою) не рвалась.
    return orderDetachedLast(shown, detachedKeys, (g) => g.clusterKey);
  }, [
    visibleFlat,
    detachedKeys,
    query,
    seatFilter,
    groupFilter,
    sideFilter,
    tableFilter,
    seatOfGuest,
    draft.guests.assignments,
  ]);

  /**
   * «Посадити»: лише гості без місця. Пошук свій (pickQuery); з фільтрів списку
   * діють тільки група й сторона — «Посадка» і «Стіл» тут завжди дали б порожньо.
   */
  const pickGuests = useMemo(() => {
    const q = pickQuery.trim().toLowerCase();
    const shown = visibleFlat.filter((g) => {
      if (seatOfGuest.has(g.key)) return false;
      if (q && !g.name.toLowerCase().includes(q)) return false;
      const assign = draft.guests.assignments[g.key] ?? null;
      if (groupFilter !== "all" && assign !== groupFilter) return false;
      if (sideFilter !== "all" && g.side !== sideFilter) return false;
      return true;
    });
    return orderDetachedLast(shown, detachedKeys, (g) => g.clusterKey);
  }, [
    visibleFlat,
    seatOfGuest,
    pickQuery,
    groupFilter,
    sideFilter,
    detachedKeys,
    draft.guests.assignments,
  ]);
  const pickFiltersCount =
    (groupFilter !== "all" ? 1 : 0) + (sideFilter !== "all" ? 1 : 0);

  const namedGroups = draft.guests.groups.filter((g) => g.name.trim());
  const guestsBrideLabel = uaGuestsOfLabel(
    firstName(partnerOneName),
    "нареченої",
  );
  const guestsGroomLabel = uaGuestsOfLabel(
    firstName(partnerTwoName),
    "нареченого",
  );

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
        label: guestsBrideLabel,
        onClear: () => setSideFilter("all"),
      });
    } else if (sideFilter === "GROOM") {
      chips.push({
        id: "side-groom",
        label: guestsGroomLabel,
        onClear: () => setSideFilter("all"),
      });
    } else if (sideFilter === "BOTH") {
      chips.push({
        id: "side-both",
        label: "Спільні",
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
    guestsBrideLabel,
    guestsGroomLabel,
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
    const swapCandidates: Array<{ key: string; name: string }> = [];
    if (table && seatInfo) {
      const n = table.seats.length;
      const idx = table.seats.findIndex((s) => s.id === seatInfo.seatId);
      const wraps =
        table.kind === "round" ||
        (table.kind === "kids" && table.shape !== "long");
      const neighborIdx = [idx - 1, idx + 1]
        .map((i) => (wraps ? (i + n) % n : i))
        .filter((i) => i >= 0 && i < n && i !== idx);
      for (const i of new Set(neighborIdx)) {
        const nKey = table.seats[i].guestKey;
        const g = nKey ? guestMap.get(nKey) : null;
        if (g && g.key !== key) swapCandidates.push({ key: g.key, name: g.name });
      }
    }

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
      childSeatLabel: guest.isChild ? childSeatLabel(guest.childNeed) : null,
      tableLabel: table?.label ?? null,
      rsvpStatus: guest.rsvpStatus,
      isPlusOne: guest.isPlusOne,
      linkedName: linked?.name ?? null,
      swapCandidates,
    };
  }

  const activePopover = popover ? buildPopoverInfo(popover.key) : null;

  /** Ланцюжок, який пересідає разом із гостем (партнер, родина; діти — лише за дорослим столом). */
  function matesOf(key: string): string[] {
    const guest = guestMap.get(key);
    if (!guest || guest.isChild || detachedKeys.has(key)) return [];
    const kidsTableIds = new Set(
      tables.filter((t) => t.kind === "kids").map((t) => t.id),
    );
    return flat
      .filter((m) => {
        if (m.key === key || m.clusterKey !== guest.clusterKey) return false;
        if (detachedKeys.has(m.key)) return false;
        if (!m.isChild) return true;
        const at = seatOfGuest.get(m.key);
        if (at) return !kidsTableIds.has(at.tableId);
        return !childGoesToKidsTable(m.isChild, m.childNeed);
      })
      .map((m) => m.key);
  }

  function guestName(key: string) {
    return guestMap.get(key)?.name ?? "Гість";
  }

  function commitPlacement(outcome: PlacedOutcome, guestKey: string) {
    setTables(outcome.tables);
    if (outcome.swappedWith) {
      toast.info(
        `${guestName(guestKey)} і ${guestName(outcome.swappedWith)} помінялися місцями`,
      );
    } else if (outcome.evicted) {
      toast.info(`${guestName(outcome.evicted)} тепер без місця`);
    }
    if (outcome.leftOut.length) {
      toast.info(`Без місця: ${outcome.leftOut.map(guestName).join(", ")}`);
    }
    setSelectedKey(guestKey);
    setReseatKey(null);
    setSeatPick(null);
    closePopover();
  }

  /** Посадити гостя на місце; ланцюжок — на найближчі місця того ж столу, якщо вистачає. */
  function seatFromPicker(tableId: string, seatId: string, guestKey: string) {
    const outcome = placeGuest(
      tables,
      tableId,
      seatId,
      guestKey,
      matesOf(guestKey),
    );
    if (outcome.status === "placed") {
      commitPlacement(outcome, guestKey);
      return;
    }
    setConflictSwapOpen(false);
    setSeatConflict({
      tableId,
      seatId,
      guestKey,
      mateKeys: outcome.mates,
      available: outcome.available,
    });
  }

  function closeSeatConflict(done: boolean) {
    setSeatConflict(null);
    setConflictSwapOpen(false);
    if (done) {
      setSeatPick(null);
      closePopover();
    }
  }

  function assignToFirstEmptySeat(tableId: string, guestKey: string) {
    const table = tables.find((t) => t.id === tableId);
    const empty = table?.seats.find((s) => !s.guestKey);
    if (!empty) {
      toast.info("Немає вільних місць за цим столом");
      return;
    }
    seatFromPicker(tableId, empty.id, guestKey);
  }

  function readDragGuestKey(event: DragEvent) {
    return (
      event.dataTransfer.getData(GUEST_DRAG_MIME) ||
      event.dataTransfer.getData("text/plain") ||
      dragGuestKey
    );
  }

  function isGuestDrag(event: DragEvent) {
    if (dragGuestKey) return true;
    const types = Array.from(event.dataTransfer.types);
    return types.includes(GUEST_DRAG_MIME) || types.includes("text/plain");
  }

  /** Під курсором — лише кружечок з ініціалами та ім’я (як місце на мапі), а не вся плитка. */
  function setGuestDragImage(event: DragEvent, guestKey: string) {
    const guest = guestMap.get(guestKey);
    if (!guest) return;
    const ghost = document.createElement("div");
    ghost.className = "seat-plan-drag-ghost";
    const dot = document.createElement("span");
    dot.className = "seat-plan-drag-ghost__dot";
    dot.style.background = colorForAssign(
      draft.guests.assignments[guestKey] ?? null,
      draft.guests.groups,
    );
    dot.textContent = initials(guest.name);
    const name = document.createElement("span");
    name.className = "seat-plan-drag-ghost__name";
    name.textContent = guest.name;
    ghost.append(dot, name);
    document.body.appendChild(ghost);
    event.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, 13);
    requestAnimationFrame(() => ghost.remove());
  }

  function beginGuestDrag(event: DragEvent, guestKey: string) {
    event.dataTransfer.setData(GUEST_DRAG_MIME, guestKey);
    event.dataTransfer.setData("text/plain", guestKey);
    event.dataTransfer.effectAllowed = "move";
    setGuestDragImage(event, guestKey);
    setDragGuestKey(guestKey);
    setSelectedKey(guestKey);
    closePopover();
  }

  function endGuestDrag() {
    setDragGuestKey(null);
    setDropTargetId(null);
  }

  function onSeatDragOver(
    event: DragEvent,
    tableId: string,
    seatId: string,
  ) {
    if (!isGuestDrag(event)) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    const id = `${tableId}:${seatId}`;
    if (dropTargetId !== id) setDropTargetId(id);
  }

  function onSeatDrop(event: DragEvent, tableId: string, seatId: string) {
    if (!isGuestDrag(event)) return;
    event.preventDefault();
    event.stopPropagation();
    const guestKey = readDragGuestKey(event);
    endGuestDrag();
    if (!guestKey) return;
    seatFromPicker(tableId, seatId, guestKey);
  }

  function onTableDragOver(event: DragEvent, tableId: string) {
    if (!isGuestDrag(event)) return;
    if ((event.target as Element).closest?.(".seat-plan-seat")) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const id = `table:${tableId}`;
    if (dropTargetId !== id) setDropTargetId(id);
  }

  function onTableDrop(event: DragEvent, tableId: string) {
    if (!isGuestDrag(event)) return;
    if ((event.target as Element).closest?.(".seat-plan-seat")) return;
    event.preventDefault();
    event.stopPropagation();
    const guestKey = readDragGuestKey(event);
    endGuestDrag();
    if (!guestKey) return;
    assignToFirstEmptySeat(tableId, guestKey);
  }

  /** Pointer-drag: оновлюємо стан раз на кадр (останнє положення). */
  function scheduleMoveFrame(fn: () => void) {
    moveFrameRef.current.fn = fn;
    if (moveFrameRef.current.id !== null) return;
    moveFrameRef.current.id = requestAnimationFrame(flushMoveFrame);
  }

  function flushMoveFrame() {
    const frame = moveFrameRef.current;
    if (frame.id !== null) cancelAnimationFrame(frame.id);
    frame.id = null;
    const fn = frame.fn;
    frame.fn = null;
    fn?.();
  }

  function cancelMoveFrame() {
    const frame = moveFrameRef.current;
    if (frame.id !== null) cancelAnimationFrame(frame.id);
    frame.id = null;
    frame.fn = null;
  }

  /** Mobile: перетягування кружечка пальцем (HTML5 DnD на touch не працює). */
  function onSeatTouchPointerDown(
    event: PointerEvent<HTMLButtonElement>,
    guestKey: string | null,
  ) {
    event.stopPropagation();
    if (!isMobile || !guestKey || !event.isPrimary) return;
    touchDragRef.current = {
      key: guestKey,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
    };
  }

  function onSeatTouchPointerMove(event: PointerEvent<HTMLButtonElement>) {
    const drag = touchDragRef.current;
    if (!drag) return;
    if (pinchingRef.current) {
      touchDragRef.current = null;
      endGuestDrag();
      setTouchGhost(null);
      return;
    }
    if (!drag.active) {
      if (
        Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 8
      ) {
        return;
      }
      drag.active = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragGuestKey(drag.key);
      setSelectedKey(drag.key);
      closePopover();
    }
    const { clientX, clientY } = event;
    // Не частіше за кадр: весь план ре-рендериться, на телефоні інакше смикається.
    scheduleMoveFrame(() => {
      if (touchDragRef.current !== drag) return;
      setTouchGhost({ key: drag.key, x: clientX, y: clientY });
      const el = document.elementFromPoint(clientX, clientY);
      const seatEl = el?.closest<HTMLElement>("[data-drop-seat]");
      const tableEl = el?.closest<HTMLElement>("[data-drop-table]");
      const id = seatEl
        ? seatEl.dataset.dropSeat!
        : tableEl
          ? `table:${tableEl.dataset.dropTable}`
          : null;
      setDropTargetId((cur) => (cur === id ? cur : id));
    });
  }

  function onSeatTouchPointerUp(
    event: PointerEvent<HTMLButtonElement>,
    cancelled = false,
  ) {
    const drag = touchDragRef.current;
    touchDragRef.current = null;
    cancelMoveFrame();
    if (!drag?.active) return;
    // Після drag не відкриваємо popover кліком.
    suppressSeatClickRef.current = true;
    setTimeout(() => {
      suppressSeatClickRef.current = false;
    }, 0);
    setTouchGhost(null);
    const el = document.elementFromPoint(event.clientX, event.clientY);
    const seatEl = el?.closest<HTMLElement>("[data-drop-seat]");
    const tableEl = el?.closest<HTMLElement>("[data-drop-table]");
    endGuestDrag();
    if (cancelled) return;
    if (seatEl) {
      const [tableId, seatId] = seatEl.dataset.dropSeat!.split(":");
      seatFromPicker(tableId, seatId, drag.key);
    } else if (tableEl) {
      assignToFirstEmptySeat(tableEl.dataset.dropTable!, drag.key);
    }
  }

  /** «Звільнити місце» / «Залишити без місця» — лише цей гість, без родини. */
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

  /** Лише для «Від’єднати» (поведінку поки не міняємо). */
  function freeGuestCluster(key: string) {
    const self = guestMap.get(key);
    const keys = new Set([key]);
    if (self && !detachedKeys.has(key)) {
      for (const g of flat) {
        if (!detachedKeys.has(g.key) && g.clusterKey === self.clusterKey) {
          keys.add(g.key);
        }
      }
    }
    setTables((prev) =>
      prev.map((table) => ({
        ...table,
        seats: table.seats.map((s) =>
          s.guestKey && keys.has(s.guestKey) ? { ...s, guestKey: null } : s,
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
    if (guestId === COUPLE_GUEST_ID) return;
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
      const usedLabels = new Set(prev.map((t) => t.label));
      for (let i = 0; i < tableCount; i += 1) {
        numbered += 1;
        while (
          labeledKinds.has(kind) &&
          usedLabels.has(defaultTableLabel(kind, numbered))
        ) {
          numbered += 1;
        }
        const label = defaultTableLabel(kind, numbered);
        usedLabels.add(label);
        next.push({
          id: uid(kind),
          kind,
          shape: kind === "kids" ? "round" : undefined,
          label,
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
    if (pinchingRef.current || !event.isPrimary) return;
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
    if (!drag || pinchingRef.current) return;
    const dx = (event.clientX - drag.startX) / canvasScale;
    const dy = (event.clientY - drag.startY) / canvasScale;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    const x = snap(drag.origX + dx);
    const y = snap(drag.origY + dy);
    scheduleMoveFrame(() => {
      if (dragRef.current !== drag) return;
      setTables((prev) =>
        prev.some((t) => t.id === drag.id && (t.x !== x || t.y !== y))
          ? prev.map((t) => (t.id === drag.id ? { ...t, x, y } : t))
          : prev,
      );
    });
  }

  function onTablePointerUp(tableId: string) {
    flushMoveFrame();
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

  const toggleGroup = (id: string) =>
    setHiddenGroups((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const renderGroupChip = (id: string, label: string, color: string) => {
    const off = hiddenGroups.has(id);
    return (
      <button
        key={id}
        type="button"
        className={`seat-plan-chip${off ? " is-off" : ""}`}
        aria-pressed={!off}
        title={off ? "Показати колір групи" : "Сховати колір групи"}
        onClick={() => toggleGroup(id)}
      >
        <span className="seat-plan-chip-dot" style={{ background: color }} />
        {label}
      </button>
    );
  };

  const groupChips = (
    <div className="seat-plan-group-chips">
      {draft.tables.hasPresidium
        ? renderGroupChip(
            "presidium",
            "Президіум",
            colorForAssign("presidium", draft.guests.groups),
          )
        : null}
      {namedGroups.map((g) =>
        renderGroupChip(g.id, g.name, colorForAssign(g.id, draft.guests.groups)),
      )}
      {draft.tables.hasKidsTable
        ? renderGroupChip("kids", "Діти", "#E07A9A")
        : null}
    </div>
  );

  return (
    <div
      className={`seat-plan is-tab-${mobileTab}${
        dragGuestKey ? " is-guest-dragging" : ""
      }`}
    >
      {touchGhost && guestMap.get(touchGhost.key) ? (
        <div
          className="seat-plan-drag-ghost seat-plan-drag-ghost--float"
          style={{
            transform: `translate(${touchGhost.x - 40}px, ${touchGhost.y - 64}px)`,
          }}
        >
          <span
            className="seat-plan-drag-ghost__dot"
            style={{
              background: colorForAssign(
                draft.guests.assignments[touchGhost.key] ?? null,
                draft.guests.groups,
              ),
            }}
          >
            {initials(guestMap.get(touchGhost.key)!.name)}
          </span>
          <span className="seat-plan-drag-ghost__name">
            {guestMap.get(touchGhost.key)!.name}
          </span>
        </div>
      ) : null}
      <div className="seat-plan-top">
        <div className="seat-plan-title-wrap">
          <div className="cabinet-tasks-top__lead">
            <CabinetBackButton
              className="cabinet-tasks-top__back"
              onClick={openCabinetMoreMenu}
            />
            <h1 className="seat-plan-title">
              {mobileTab === "map" ? "План розсадки" : "Розсадка"}
            </h1>
          </div>
          <span
            className={`seat-plan-autosave${saveFailed ? " is-error" : ""}`}
            role={saveFailed ? "alert" : undefined}
          >
            <span className="seat-plan-autosave-dot" aria-hidden />
            {saveFailed ? "Не збережено" : "Авто-збереження"}
          </span>
        </div>

        <div className="seat-plan-actions">
          <button
            type="button"
            className="seat-plan-btn seat-plan-btn--ghost"
            onClick={() => {
              setPrintOpen(false);
              setAddOpen(false);
              printCanvas();
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
                  disabled
                  aria-disabled="true"
                  className="seat-plan-print-dropdown__item--soon"
                >
                  <span className="seat-plan-print-dropdown__label">
                    Дизайн посадкової карти
                  </span>
                  <span className="seat-plan-print-dropdown__badge">
                    Скоро буде!
                  </span>
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
              {filtersActive ? (
                <span className="cabinet-tasks-chip-badge">
                  {activeFilterChips.length}
                </span>
              ) : null}
            </button>
          </div>

          {activeFilterChips.length > 0 ? (
            <div className="seat-plan-active-chips">
              {activeFilterChips.map((chip) => {
                const group =
                  chip.id.startsWith("group-") &&
                  namedGroups.find((g) => `group-${g.id}` === chip.id);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    className={`seat-plan-active-chip${
                      group ? " is-active" : ""
                    }`}
                    onClick={chip.onClear}
                  >
                    {group ? (
                      <span
                        className="seat-plan-chip-dot"
                        style={{
                          background: colorForAssign(
                            group.id,
                            draft.guests.groups,
                          ),
                        }}
                      />
                    ) : null}
                    {chip.label}
                  </button>
                );
              })}
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
                  <option value="all">Всі групи</option>
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
                  <option value="all">Всі столи</option>
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
              const color = visibleColor(assign);
              const open =
                popover?.kind === "list" && popover.key === g.key;
              const cluster = clusterFlags(filteredGuests, index, clusterRootOf);
              const clusterStart = cluster.start;
              const clusterMid = cluster.mid;
              const clusterEnd = cluster.end;
              return (
                <div
                  key={g.key}
                  className={`seat-plan-guest-row-wrap${
                    selectedKey === g.key ? " is-selected" : ""
                  }${dragGuestKey === g.key ? " is-dragging" : ""}${
                    cluster.linked ? " is-linked" : ""
                  }${clusterStart ? " is-cluster-start" : ""}${
                    clusterMid ? " is-cluster-mid" : ""
                  }${clusterEnd ? " is-cluster-end" : ""}`}
                  draggable={!isMobile}
                  onDragStart={(e) => {
                    if (
                      (e.target as Element).closest?.(
                        ".seat-plan-guest-more-btn",
                      )
                    ) {
                      e.preventDefault();
                      return;
                    }
                    beginGuestDrag(e, g.key);
                  }}
                  onDragEnd={endGuestDrag}
                >
                  <button
                    type="button"
                    className={`seat-plan-guest-row${
                      selectedKey === g.key ? " is-selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedKey(g.key);
                      if (isMobile) {
                        if (open) {
                          closePopover();
                          return;
                        }
                        setPopover({ kind: "list", key: g.key });
                        setFloatPop(null);
                        return;
                      }
                      closePopover();
                    }}
                  >
                    <span
                      className={`seat-plan-guest-avatar${
                        seated ? "" : " is-empty"
                      } seat-plan-guest-avatar--index`}
                      style={
                        seated || assign !== null
                          ? { background: color }
                          : undefined
                      }
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
                      {g.isChild ? (
                        <span
                          className="seat-plan-guest-child"
                          title="Дитина"
                          aria-label="Дитина"
                        >
                          <IconBaby />
                        </span>
                      ) : null}
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
                      {g.side === "BRIDE" || g.side === "GROOM" ? (
                        <ResponsibleAvatar
                          name={
                            g.side === "GROOM" ? partnerTwoName : partnerOneName
                          }
                          tone={g.side === "GROOM" ? "partner" : "owner"}
                        />
                      ) : (
                        <ResponsibleAvatarDuo
                          ownerName={partnerOneName}
                          partnerName={partnerTwoName}
                          title="Обоє"
                          aria-hidden
                        />
                      )}
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
            <div className="seat-plan-map-groups-head">
              <button
                type="button"
                className="seat-plan-groups-head"
                aria-expanded={groupsOpen}
                onClick={() => setGroupsOpen((v) => !v)}
              >
                Групи
              </button>
              {onEditGuests ? (
                <button
                  type="button"
                  className="seat-plan-icon-btn"
                  aria-label="Редагувати групи"
                  onClick={onEditGuests}
                >
                  <PencilIcon />
                </button>
              ) : null}
              <button
                type="button"
                className="seat-plan-icon-btn"
                aria-label={groupsOpen ? "Згорнути групи" : "Розгорнути групи"}
                onClick={() => setGroupsOpen((v) => !v)}
              >
                <span
                  className={`seat-plan-collapse-chevron${
                    groupsOpen ? " is-open" : ""
                  }`}
                  aria-hidden
                >
                  <CollapseChevronIcon />
                </span>
              </button>
            </div>
            {groupsOpen ? groupChips : null}
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

          <div className="seat-plan-canvas-scroll" ref={canvasScrollRef}>
          <div className="seat-plan-canvas" style={canvasStyle}>
            {tables.map((table) => (
              <div
                key={table.id}
                className={`seat-plan-table is-${table.kind}${
                  table.kind === "kids" && table.shape === "long"
                    ? " is-kids-long"
                    : ""
                }${draggingId === table.id ? " is-dragging" : ""}${
                  dropTargetId === `table:${table.id}`
                    ? " is-drop-target"
                    : ""
                }`}
                style={{
                  left: table.x,
                  top: table.y,
                  transform: table.rotation
                    ? `rotate(${table.rotation}deg)`
                    : undefined,
                }}
                data-drop-table={table.id}
                onPointerDown={(e) => onTablePointerDown(e, table)}
                onPointerMove={onTablePointerMove}
                onPointerUp={() => onTablePointerUp(table.id)}
                onPointerCancel={() => onTablePointerUp(table.id)}
                onDragOver={(e) => onTableDragOver(e, table.id)}
                onDragLeave={(e) => {
                  if (
                    !e.currentTarget.contains(e.relatedTarget as Node | null)
                  ) {
                    setDropTargetId((cur) =>
                      cur === `table:${table.id}` ? null : cur,
                    );
                  }
                }}
                onDrop={(e) => onTableDrop(e, table.id)}
              >
                <div
                  className="seat-plan-table-body"
                  style={bodyStyle(table)}
                >
                  <TableShapeSilhouette kind={table.kind} />
                  <div
                    className="seat-plan-table-label"
                    style={{
                      transform: table.rotation
                        ? `rotate(${-table.rotation}deg)`
                        : undefined,
                    }}
                  >
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
                        ? visibleColor(assign)
                        : undefined;
                      const pos = seatPosition(
                        table.kind,
                        index,
                        table.seats.length,
                        table.shape,
                      );
                      const seatDropId = `${table.id}:${seat.id}`;
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          className={`seat-plan-seat${
                            guest ? "" : " is-empty"
                          }${
                            dropTargetId === seatDropId
                              ? " is-drop-target"
                              : ""
                          }${
                            dragGuestKey && seat.guestKey === dragGuestKey
                              ? " is-dragging"
                              : ""
                          }`}
                          style={{
                            left: pos.left,
                            top: pos.top,
                            background: guest ? color : undefined,
                            transform: table.rotation
                              ? `translate(-50%, -50%) rotate(${-table.rotation}deg)`
                              : undefined,
                          }}
                          title={guest?.name ?? "Порожнє місце"}
                          draggable={Boolean(guest) && !isMobile}
                          data-drop-seat={seatDropId}
                          onPointerDown={(e) =>
                            onSeatTouchPointerDown(e, seat.guestKey)
                          }
                          onPointerMove={onSeatTouchPointerMove}
                          onPointerUp={(e) => onSeatTouchPointerUp(e)}
                          onPointerCancel={(e) =>
                            onSeatTouchPointerUp(e, true)
                          }
                          onDragStart={(e) => {
                            if (!seat.guestKey) {
                              e.preventDefault();
                              return;
                            }
                            e.stopPropagation();
                            beginGuestDrag(e, seat.guestKey);
                          }}
                          onDragEnd={endGuestDrag}
                          onDragOver={(e) =>
                            onSeatDragOver(e, table.id, seat.id)
                          }
                          onDragLeave={() => {
                            setDropTargetId((cur) =>
                              cur === seatDropId ? null : cur,
                            );
                          }}
                          onDrop={(e) => onSeatDrop(e, table.id, seat.id)}
                          onClick={(e) => {
                            if (suppressSeatClickRef.current) return;
                            // Явний режим «Посадити за (інший) стіл» з меню гостя.
                            if (
                              reseatKey &&
                              guestMap.has(reseatKey) &&
                              seat.guestKey !== reseatKey
                            ) {
                              seatFromPicker(table.id, seat.id, reseatKey);
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
                            setSeatPick({
                              tableId: table.id,
                              seatId: seat.id,
                            });
                          }}
                        >
                          {guest ? initials(guest.name) : ""}
                          {showNames &&
                          guest &&
                          (nameRoom.get(seatDropId) ?? SIDE_NAME_MAX) >=
                            SIDE_NAME_MIN ? (
                            <span
                              className={`seat-plan-seat-name${seatNameClass(
                                table,
                                index,
                              )}`}
                              style={
                                nameRoom.has(seatDropId)
                                  ? { maxWidth: nameRoom.get(seatDropId) }
                                  : undefined
                              }
                            >
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

          <div className="seat-plan-map-groups">
            <div className="seat-plan-map-groups-head">
              <button
                type="button"
                className="seat-plan-groups-head"
                aria-expanded={groupsOpen}
                onClick={() => setGroupsOpen((v) => !v)}
              >
                Групи
              </button>
              <button
                type="button"
                className="seat-plan-icon-btn"
                aria-label="Редагувати групи"
                onClick={onEditGuests}
              >
                <PencilIcon />
              </button>
              <button
                type="button"
                className="seat-plan-icon-btn"
                aria-label={groupsOpen ? "Згорнути групи" : "Розгорнути групи"}
                onClick={() => setGroupsOpen((v) => !v)}
              >
                <span
                  className={`seat-plan-collapse-chevron${
                    groupsOpen ? " is-open" : ""
                  }`}
                  aria-hidden
                >
                  <CollapseChevronIcon />
                </span>
              </button>
            </div>
            {groupsOpen ? groupChips : null}
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
          onSeatClick={(tableId, seatId) => {
            // Щойно додане в модалці крісло ще не в плані — додаємо його,
            // щоб на нього можна було посадити гостя.
            if (!editingTable.seats.some((s) => s.id === seatId)) {
              setTables((prev) =>
                prev.map((t) =>
                  t.id === tableId
                    ? { ...t, seats: [...t.seats, { id: seatId, guestKey: null }] }
                    : t,
                ),
              );
            }
            setSeatPick({ tableId, seatId });
          }}
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
                  ? () => detachLinked(activePopover.key)
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
                      detachLinked(activePopover.key);
                      closePopover();
                    }
                  : null
              }
              onSeatElsewhere={() => {
                setSelectedKey(activePopover.key);
                setReseatKey(activePopover.key);
                setMobileTab("map");
                closePopover();
                toast.info(`Торкніться місця для ${activePopover.name}`);
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
                value={pickQuery}
                onChange={(e) => setPickQuery(e.target.value)}
              />
            </label>
            <button
              type="button"
              className={`seat-plan-filters-btn seat-pick-filters-btn${
                pickFiltersCount > 0 ? " is-active" : ""
              }`}
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontalIcon />
              Фільтри
              {pickFiltersCount > 0 ? (
                <span className="cabinet-tasks-chip-badge">
                  {pickFiltersCount}
                </span>
              ) : null}
            </button>
          </div>

          <div className="seat-pick-list">
            {pickGuests.map((g, index) => {
              const seated = seatOfGuest.has(g.key);
              const cluster = clusterFlags(pickGuests, index, clusterRootOf);
              const clusterStart = cluster.start;
              const clusterMid = cluster.mid;
              const clusterEnd = cluster.end;

              return (
                <div
                  key={g.key}
                  className={`seat-pick-row-wrap${
                    cluster.linked ? " is-linked" : ""
                  }${clusterStart ? " is-cluster-start" : ""}${
                    clusterMid ? " is-cluster-mid" : ""
                  }${clusterEnd ? " is-cluster-end" : ""}`}
                >
                  <button
                    type="button"
                    className="seat-pick-row"
                    onClick={() => {
                      if (!seatPick) return;
                      seatFromPicker(seatPick.tableId, seatPick.seatId, g.key);
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
                      {g.side === "BRIDE" || g.side === "GROOM" ? (
                        <ResponsibleAvatar
                          name={
                            g.side === "GROOM" ? partnerTwoName : partnerOneName
                          }
                          tone={g.side === "GROOM" ? "partner" : "owner"}
                        />
                      ) : (
                        <ResponsibleAvatarDuo
                          ownerName={partnerOneName}
                          partnerName={partnerTwoName}
                          title="Обоє"
                          aria-hidden
                        />
                      )}
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
            {pickGuests.length === 0 ? (
              <p className="seat-pick-empty">Гостей не знайдено.</p>
            ) : null}
          </div>
        </CabinetOverlay>
      ) : null}

      {seatConflict
        ? (() => {
            const guest = guestMap.get(seatConflict.guestKey);
            const mates = seatConflict.mateKeys
              .map((k) => guestMap.get(k))
              .filter((g): g is FlatGuest => Boolean(g));
            const table = tables.find((t) => t.id === seatConflict.tableId);
            if (!guest || mates.length === 0 || !table) return null;
            const firstName = guest.name.trim().split(/\s+/)[0] ?? "";
            const linkedWord =
              detectUaNameGender(firstName) === "feminine"
                ? "зв’язана"
                : "зв’язаний";
            const tableNo = table.label.replace(/^стіл\s*/i, "") || table.label;
            const available = seatConflict.available;
            const deficit = 1 + mates.length - available;
            const busy = new Set([seatConflict.guestKey, ...seatConflict.mateKeys]);
            const targetKey = table.seats.find(
              (s) => s.id === seatConflict.seatId,
            )?.guestKey;
            if (targetKey) busy.add(targetKey);
            const here = new Set(table.seats.map((s) => s.guestKey));
            const seen = new Set<string>();
            const units: string[][] = [];
            for (const seat of table.seats) {
              const k = seat.guestKey;
              if (!k || seen.has(k) || busy.has(k)) continue;
              const keys = [
                k,
                ...matesOf(k).filter(
                  (m) => here.has(m) && !busy.has(m) && !seen.has(m),
                ),
              ];
              keys.forEach((x) => seen.add(x));
              units.push(keys);
            }
            const swapUnits = units.filter((u) => u.length >= deficit);
            const placeWithout = () => {
              const outcome = placeGuest(
                tables,
                seatConflict.tableId,
                seatConflict.seatId,
                seatConflict.guestKey,
                [],
              );
              if (outcome.status === "placed") {
                commitPlacement(outcome, seatConflict.guestKey);
              }
              closeSeatConflict(true);
            };
            const placeFreeing = (unit: string[]) => {
              const out = new Set(unit);
              const cleared = tables.map((t) => ({
                ...t,
                seats: t.seats.map((s) =>
                  s.guestKey && out.has(s.guestKey)
                    ? { ...s, guestKey: null }
                    : s,
                ),
              }));
              const outcome = placeGuest(
                cleared,
                seatConflict.tableId,
                seatConflict.seatId,
                seatConflict.guestKey,
                seatConflict.mateKeys,
                { allowSplit: true },
              );
              if (outcome.status === "placed") {
                commitPlacement(outcome, seatConflict.guestKey);
              }
              closeSeatConflict(true);
            };
            return (
              <div className="seat-plan-sheet seat-conflict">
                <button
                  type="button"
                  className="seat-plan-sheet__backdrop"
                  aria-label="Закрити"
                  onClick={() => closeSeatConflict(false)}
                />
                <div className="seat-plan-sheet__panel seat-conflict__panel">
                  <p className="seat-conflict__title">
                    {guest.name} {linkedWord} з{" "}
                    {mates.map((m) => uaNameInstrumental(m.name)).join(" і ")}.
                    А за столом {tableNo} лише {available}{" "}
                    {seatsWord(available)}. Що робимо?
                  </p>
                  <button
                    type="button"
                    className="seat-conflict__option"
                    onClick={placeWithout}
                  >
                    Садимо {uaNameAccusative(firstName)} без{" "}
                    {mates.map((m) => uaNameGenitive(m.name)).join(" і ")} за{" "}
                    {table.label}
                  </button>
                  <button
                    type="button"
                    className="seat-conflict__option"
                    onClick={() => closeSeatConflict(false)}
                  >
                    Не садимо їх за цей стіл
                  </button>
                  {swapUnits.length > 0 ? (
                    <div
                      className={`seat-conflict__swap${
                        conflictSwapOpen ? " is-open" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="seat-conflict__option"
                        aria-expanded={conflictSwapOpen}
                        onClick={() => setConflictSwapOpen((v) => !v)}
                      >
                        <span>
                          {mates.length === 1 ? "Садимо обох" : "Садимо всіх"},
                          але пересаджуємо когось іншого з цього стола в
                          непосаджені
                        </span>
                        <ChevronDownIcon />
                      </button>
                      {conflictSwapOpen
                        ? swapUnits.map((unit) => (
                            <button
                              key={unit.join("|")}
                              type="button"
                              className="seat-conflict__option seat-conflict__option--sub"
                              onClick={() => placeFreeing(unit)}
                            >
                              {unit.map(guestName).join(" і ")}
                            </button>
                          ))
                        : null}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })()
        : null}

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
            { id: "all", label: "Всі", count: filterCounts.side.all },
            {
              id: "BRIDE",
              label: guestsBrideLabel,
              count: filterCounts.side.BRIDE,
            },
            {
              id: "GROOM",
              label: guestsGroomLabel,
              count: filterCounts.side.GROOM,
            },
            {
              id: "BOTH",
              label: "Спільні",
              count: filterCounts.side.BOTH,
            },
          ]}
          active={draftSideFilter}
          onChange={(id) => setDraftSideFilter(id as SideFilter)}
        />
        <CabinetFilterGroup
          title="Столи"
          items={[
            { id: "all", label: "Всі", count: filterCounts.table.all },
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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8.66602 13.9985H13.9998M14.1158 4.54023C14.4683 4.18785 14.6664 3.70989 14.6664 3.21149C14.6665 2.71309 14.4685 2.23508 14.1161 1.88261C13.7637 1.53014 13.2857 1.33209 12.7872 1.33203C12.2888 1.33197 11.8107 1.5299 11.4582 1.88228L2.5601 10.7815C2.4053 10.9358 2.29082 11.1258 2.22673 11.3348L1.34599 14.2361C1.32876 14.2937 1.32746 14.355 1.34222 14.4133C1.35699 14.4716 1.38727 14.5249 1.42986 14.5674C1.47245 14.6099 1.52575 14.6401 1.58412 14.6548C1.64248 14.6694 1.70373 14.668 1.76136 14.6507L4.66362 13.7707C4.87242 13.7072 5.06244 13.5935 5.217 13.4394L14.1158 4.54023Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
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
