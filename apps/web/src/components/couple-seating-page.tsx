"use client";

import Link from "next/link";
import {
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PageLoader } from "@/components/ui-loader";
import { DashboardNav } from "@/components/dashboard-nav";
import { RequireAuth } from "@/components/require-auth";
import { getGuestList, type Guest } from "@/lib/guests-api";
import { toast } from "@/lib/toast";

type TableKind = "round" | "rect" | "long" | "head";
type DecorKind =
  | "arch"
  | "tree"
  | "piano"
  | "dance"
  | "stage"
  | "wc"
  | "cake"
  | "gift"
  | "light"
  | "speaker"
  | "mic"
  | "compass";

type Seat = {
  id: string;
  guestId: string | null;
};

type FloorTable = {
  id: string;
  kind: "table";
  tableKind: TableKind;
  label: string;
  x: number;
  y: number;
  seats: Seat[];
};

type FloorDecor = {
  id: string;
  kind: "decor";
  decorKind: DecorKind;
  label?: string;
  x: number;
  y: number;
};

type FloorItem = FloorTable | FloorDecor;

type LayoutState = {
  version: 2;
  items: FloorItem[];
};

const CANVAS_W = 1200;
const CANVAS_H = 860;
const SEAT_SIZE = 28;

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function makeSeats(count: number): Seat[] {
  return Array.from({ length: count }, () => ({
    id: uid("seat"),
    guestId: null,
  }));
}

function createTable(
  tableKind: TableKind,
  label: string,
  x: number,
  y: number,
): FloorTable {
  const seats =
    tableKind === "round"
      ? makeSeats(10)
      : tableKind === "long"
        ? makeSeats(14)
        : tableKind === "head"
          ? makeSeats(6)
          : makeSeats(8);
  return {
    id: uid("table"),
    kind: "table",
    tableKind,
    label,
    x,
    y,
    seats,
  };
}

function createDecor(
  decorKind: DecorKind,
  x: number,
  y: number,
  label?: string,
): FloorDecor {
  return {
    id: uid("decor"),
    kind: "decor",
    decorKind,
    label,
    x,
    y,
  };
}

/** Готова схема залу — вау з першого відкриття */
function defaultWowLayout(): FloorItem[] {
  return [
    createDecor("compass", 1080, 36),
    createDecor("arch", 470, 28),
    createTable("head", "Наречена і наречений", 470, 118),

    createDecor("tree", 70, 60),
    createDecor("tree", 160, 40),
    createDecor("tree", 980, 50),
    createDecor("tree", 1070, 90),
    createDecor("tree", 40, 520),
    createDecor("tree", 1080, 480),

    createDecor("piano", 80, 220),
    createDecor("light", 220, 180),
    createDecor("gift", 1000, 200),
    createDecor("cake", 1040, 280),
    createDecor("wc", 40, 700, "WC"),

    createTable("round", "1", 180, 340),
    createTable("long", "2", 720, 280),
    createTable("long", "3", 720, 480),

    createDecor("dance", 380, 360, "Танцювальна зона"),

    createDecor("stage", 360, 680, "Сцена"),
    createDecor("mic", 520, 730),
    createDecor("speaker", 420, 750),
    createDecor("speaker", 640, 750),
  ];
}

function tableBox(table: FloorTable) {
  switch (table.tableKind) {
    case "round":
      return { w: 180, h: 180 };
    case "long":
      return { w: 320, h: 110 };
    case "head":
      return { w: 260, h: 100 };
    default:
      return { w: 200, h: 120 };
  }
}

function seatPositions(table: FloorTable) {
  const { w, h } = tableBox(table);
  const cx = w / 2;
  const cy = h / 2;

  if (table.tableKind === "round") {
    const r = 72;
    const n = table.seats.length;
    return table.seats.map((seat, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      return {
        seat,
        index: i + 1,
        left: cx + Math.cos(angle) * r - SEAT_SIZE / 2,
        top: cy + Math.sin(angle) * r - SEAT_SIZE / 2,
      };
    });
  }

  if (table.tableKind === "head") {
    // півколо зверху президії
    const n = table.seats.length;
    return table.seats.map((seat, i) => {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const angle = Math.PI + t * Math.PI;
      const r = 88;
      return {
        seat,
        index: i + 1,
        left: cx + Math.cos(angle) * r - SEAT_SIZE / 2,
        top: cy + 10 + Math.sin(angle) * (r * 0.55) - SEAT_SIZE / 2,
      };
    });
  }

  if (table.tableKind === "long") {
    const topCount = Math.ceil(table.seats.length / 2);
    const bottomCount = table.seats.length - topCount;
    return table.seats.map((seat, i) => {
      const topRow = i < topCount;
      const idx = topRow ? i : i - topCount;
      const count = topRow ? topCount : bottomCount;
      const span = w - 48;
      const left =
        24 + (count <= 1 ? span / 2 : (span * idx) / (count - 1)) - SEAT_SIZE / 2;
      const top = (topRow ? 2 : h - SEAT_SIZE - 2) - 4;
      return { seat, index: i + 1, left, top };
    });
  }

  // rect 4 top / 4 bottom-ish
  const topCount = Math.ceil(table.seats.length / 2);
  return table.seats.map((seat, i) => {
    const topRow = i < topCount;
    const idx = topRow ? i : i - topCount;
    const count = topRow ? topCount : table.seats.length - topCount;
    const span = w - 40;
    const left =
      20 + (count <= 1 ? span / 2 : (span * idx) / (count - 1)) - SEAT_SIZE / 2;
    const top = topRow ? -2 : h - SEAT_SIZE + 2;
    return { seat, index: i + 1, left, top };
  });
}

function decorBox(decor: FloorDecor) {
  switch (decor.decorKind) {
    case "dance":
      return { w: 280, h: 280 };
    case "stage":
      return { w: 360, h: 120 };
    case "arch":
      return { w: 260, h: 90 };
    case "tree":
      return { w: 70, h: 70 };
    case "piano":
      return { w: 90, h: 70 };
    case "compass":
      return { w: 56, h: 56 };
    default:
      return { w: 48, h: 48 };
  }
}

function storageKey(weddingId: string) {
  return `nitka-seating:v2:${weddingId}`;
}

function loadLayout(weddingId: string): FloorItem[] | null {
  try {
    const raw = localStorage.getItem(storageKey(weddingId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LayoutState;
    if (parsed.version !== 2 || !Array.isArray(parsed.items)) return null;
    return parsed.items;
  } catch {
    return null;
  }
}

function saveLayout(weddingId: string, items: FloorItem[]) {
  const payload: LayoutState = { version: 2, items };
  localStorage.setItem(storageKey(weddingId), JSON.stringify(payload));
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function DecorVisual({ item }: { item: FloorDecor }) {
  const label = item.label;
  switch (item.decorKind) {
    case "arch":
      return (
        <div className="pointer-events-none relative h-full w-full">
          <div className="absolute inset-x-4 bottom-0 h-[70%] rounded-t-full border-[3px] border-ink/35 bg-transparent" />
          <div className="absolute inset-x-10 bottom-0 h-[55%] rounded-t-full border-2 border-sage/40" />
        </div>
      );
    case "dance":
      return (
        <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center rounded-full border-2 border-dashed border-ink/25 bg-white/30">
          <span className="max-w-[70%] text-center text-sm font-medium text-ink-soft">
            {label ?? "Танцпол"}
          </span>
        </div>
      );
    case "stage":
      return (
        <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center rounded-t-[100px] border border-sage/30 bg-sage/15">
          <span className="text-sm font-semibold text-sage-deep">
            {label ?? "Сцена"}
          </span>
          <span className="mt-1 text-[10px] text-sage-deep/70">DJ · світло · звук</span>
        </div>
      );
    case "tree":
      return (
        <div className="pointer-events-none flex h-full w-full items-center justify-center">
          <div className="relative">
            <div className="size-12 rounded-full bg-leaf/35 shadow-inner" />
            <div className="absolute -right-2 top-1 size-8 rounded-full bg-sage/25" />
            <div className="absolute -left-1 bottom-0 size-7 rounded-full bg-leaf/40" />
          </div>
        </div>
      );
    case "piano":
      return (
        <div className="pointer-events-none flex h-full w-full items-center justify-center">
          <svg viewBox="0 0 90 70" className="h-14 w-16 text-ink/70">
            <path
              fill="currentColor"
              d="M18 48c0-18 10-34 28-38 14-3 28 6 32 20 3 10-2 22-12 26H28c-6 0-10-4-10-8z"
              opacity="0.2"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              d="M20 50c2-16 12-30 28-34 12-3 24 5 28 16 3 8-1 18-10 22H30c-5 0-10-2-10-4z"
            />
            <rect x="48" y="28" width="10" height="22" rx="2" fill="currentColor" opacity="0.35" />
          </svg>
        </div>
      );
    case "compass":
      return (
        <div className="pointer-events-none flex h-full w-full items-center justify-center">
          <div className="relative flex size-12 items-center justify-center rounded-full border-2 border-ink/30 bg-white/80 text-[10px] font-bold text-ink">
            <span className="absolute top-1">Пн</span>
            <span className="size-0 border-x-4 border-b-8 border-x-transparent border-b-sage" />
          </div>
        </div>
      );
    case "wc":
      return (
        <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-0.5">
          <span className="rounded-md bg-sage px-2 py-0.5 text-[10px] font-bold text-white">
            WC
          </span>
          <span className="text-lg leading-none text-ink/50">→</span>
        </div>
      );
    case "cake":
      return (
        <div className="pointer-events-none flex h-full w-full items-center justify-center text-2xl">
          🎂
        </div>
      );
    case "gift":
      return (
        <div className="pointer-events-none flex h-full w-full items-center justify-center text-2xl">
          🎁
        </div>
      );
    case "light":
      return (
        <div className="pointer-events-none flex h-full w-full items-center justify-center text-2xl">
          💡
        </div>
      );
    case "speaker":
      return (
        <div className="pointer-events-none flex h-full w-full items-center justify-center text-2xl">
          🔊
        </div>
      );
    case "mic":
      return (
        <div className="pointer-events-none flex h-full w-full items-center justify-center text-2xl">
          🎤
        </div>
      );
    default:
      return null;
  }
}

function TableBody({ table }: { table: FloorTable }) {
  if (table.tableKind === "round") {
    return (
      <div className="pointer-events-none absolute left-1/2 top-1/2 flex size-[96px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink/25 bg-[#d9dee5] text-sm font-semibold text-ink shadow-sm">
        {table.label}
      </div>
    );
  }
  if (table.tableKind === "head") {
    return (
      <div className="pointer-events-none absolute left-1/2 top-[38%] flex h-[48px] w-[200px] -translate-x-1/2 items-center justify-center rounded-b-full border-2 border-ink/25 bg-[#d9dee5] px-2 text-center text-[11px] font-semibold leading-tight text-ink shadow-sm">
        {table.label}
      </div>
    );
  }
  if (table.tableKind === "long") {
    return (
      <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-[44px] w-[260px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border-2 border-ink/25 bg-[#d9dee5] text-sm font-semibold text-ink shadow-sm">
        {table.label}
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-[48px] w-[150px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border-2 border-ink/25 bg-[#d9dee5] text-sm font-semibold text-ink shadow-sm">
      {table.label}
    </div>
  );
}

function SeatingInner() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [items, setItems] = useState<FloorItem[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [guestFilter, setGuestFilter] = useState<"all" | "free">("all");
  const [query, setQuery] = useState("");
  const [needWedding, setNeedWedding] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [ready, setReady] = useState(false);

  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getGuestList();
        setWeddingId(data.wedding.id);
        setGuests(data.guests);
        const saved = loadLayout(data.wedding.id);
        setItems(saved && saved.length > 0 ? saved : defaultWowLayout());
        requestAnimationFrame(() => setReady(true));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Помилка";
        if (message.toLowerCase().includes("весілля")) {
          setNeedWedding(true);
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!weddingId || items.length === 0) return;
    saveLayout(weddingId, items);
  }, [items, weddingId]);

  const tables = useMemo(
    () => items.filter((i): i is FloorTable => i.kind === "table"),
    [items],
  );

  const seatedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const table of tables) {
      for (const seat of table.seats) {
        if (seat.guestId) ids.add(seat.guestId);
      }
    }
    return ids;
  }, [tables]);

  const guestById = useMemo(
    () => Object.fromEntries(guests.map((g) => [g.id, g])),
    [guests],
  );

  const visibleGuests = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guests.filter((g) => {
      if (guestFilter === "free" && seatedIds.has(g.id)) return false;
      if (q && !g.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [guests, guestFilter, query, seatedIds]);

  const addTable = useCallback((tableKind: TableKind) => {
    setItems((prev) => {
      const n = prev.filter((i) => i.kind === "table").length + 1;
      return [
        ...prev,
        createTable(
          tableKind,
          tableKind === "head" ? "Президія" : String(n),
          200 + (n % 5) * 40,
          180 + (n % 4) * 40,
        ),
      ];
    });
  }, []);

  const addDecor = useCallback((decorKind: DecorKind, label?: string) => {
    setItems((prev) => [
      ...prev,
      createDecor(decorKind, 260 + (prev.length % 6) * 30, 200, label),
    ]);
  }, []);

  const resetWow = useCallback(() => {
    if (!confirm("Замінити схему на готову демо-розсадку?")) return;
    setItems(defaultWowLayout());
    setSelectedId(null);
    toast.success("Готово", "Завантажено демо-схему залу");
  }, []);

  const removeSelected = useCallback(() => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  const renameSelected = useCallback(
    (label: string) => {
      if (!selectedId) return;
      setItems((prev) =>
        prev.map((i) => {
          if (i.id !== selectedId) return i;
          if (i.kind === "table") return { ...i, label };
          return { ...i, label };
        }),
      );
    },
    [selectedId],
  );

  function assignGuestToSeat(
    tableId: string,
    seatId: string,
    guestId: string | null,
  ) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.kind !== "table") return item;
        if (item.id !== tableId) {
          if (!guestId) return item;
          return {
            ...item,
            seats: item.seats.map((s) =>
              s.guestId === guestId ? { ...s, guestId: null } : s,
            ),
          };
        }
        return {
          ...item,
          seats: item.seats.map((s) => {
            if (s.id === seatId) return { ...s, guestId };
            if (guestId && s.guestId === guestId) {
              return { ...s, guestId: null };
            }
            return s;
          }),
        };
      }),
    );
  }

  function onSeatClick(tableId: string, seat: Seat) {
    if (selectedGuestId) {
      if (seat.guestId === selectedGuestId) {
        assignGuestToSeat(tableId, seat.id, null);
      } else {
        assignGuestToSeat(tableId, seat.id, selectedGuestId);
        toast.success("Посаджено", guestById[selectedGuestId]?.name ?? "");
      }
      return;
    }
    if (seat.guestId) {
      assignGuestToSeat(tableId, seat.id, null);
      toast.success("Знято з місця");
      return;
    }
    toast.info("Обери гостя зліва, потім клікни на місце");
  }

  function onGuestDragStart(e: React.DragEvent, guestId: string) {
    e.dataTransfer.setData("text/guest-id", guestId);
    e.dataTransfer.effectAllowed = "move";
    setSelectedGuestId(guestId);
  }

  function onSeatDrop(e: React.DragEvent, tableId: string, seatId: string) {
    e.preventDefault();
    const guestId = e.dataTransfer.getData("text/guest-id");
    if (!guestId) return;
    assignGuestToSeat(tableId, seatId, guestId);
    toast.success("Посаджено", guestById[guestId]?.name ?? "");
  }

  function startDrag(e: ReactPointerEvent<HTMLDivElement>, item: FloorItem) {
    if ((e.target as HTMLElement).closest("[data-seat]")) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const pointerX = (e.clientX - rect.left) * scaleX;
    const pointerY = (e.clientY - rect.top) * scaleY;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      id: item.id,
      offsetX: pointerX - item.x,
      offsetY: pointerY - item.y,
    };
    setSelectedId(item.id);
  }

  function moveDrag(e: ReactPointerEvent<HTMLDivElement>, id: string) {
    const drag = dragRef.current;
    if (!drag || drag.id !== id) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const pointerX = (e.clientX - rect.left) * scaleX;
    const pointerY = (e.clientY - rect.top) * scaleY;
    const x = Math.max(0, Math.min(CANVAS_W - 80, pointerX - drag.offsetX));
    const y = Math.max(0, Math.min(CANVAS_H - 80, pointerY - drag.offsetY));
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item)),
    );
  }

  function endDrag() {
    dragRef.current = null;
  }

  const selected = items.find((i) => i.id === selectedId) ?? null;

  if (loading) {
    return <PageLoader label="Завантажуємо розсадку…" />;
  }

  if (needWedding) {
    return (
      <>
        <DashboardNav variant="COUPLE" />
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink">
          Розсадка
        </h1>
        <div className="mt-6 rounded-2xl border border-line bg-mist px-6 py-10">
          <p className="text-ink-soft">
            Спочатку створи весілля і додай гостей — тоді можна розсаджувати.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:bg-sage-deep"
          >
            До огляду
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNav variant="COUPLE" />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-ink md:text-5xl">
            Розсадка
          </h1>
          <p className="mt-2 max-w-xl text-ink-soft">
            План залу з президією, танцполом і декором. Перетягни столи, посади
            гостей на місця.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetWow}
            className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-sage/40"
          >
            Демо-схема
          </button>
          <Link
            href="/guests"
            className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-sage/40"
          >
            Гості
          </Link>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex max-h-[860px] flex-col rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Столи
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(
              [
                { kind: "round" as const, label: "Круглий" },
                { kind: "long" as const, label: "Довгий" },
                { kind: "rect" as const, label: "Квадрат" },
                { kind: "head" as const, label: "Президія" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.kind}
                type="button"
                onClick={() => addTable(opt.kind)}
                className="rounded-xl border border-line px-2 py-2.5 text-xs text-ink-soft hover:border-sage/50 hover:bg-mist"
              >
                {opt.label}
              </button>
            ))}
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Декор і зони
          </p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {(
              [
                { kind: "dance" as const, label: "Танцпол" },
                { kind: "stage" as const, label: "Сцена" },
                { kind: "arch" as const, label: "Арка" },
                { kind: "tree" as const, label: "Дерево" },
                { kind: "piano" as const, label: "Рояль" },
                { kind: "cake" as const, label: "Торт" },
                { kind: "gift" as const, label: "Подарунки" },
                { kind: "wc" as const, label: "WC" },
                { kind: "light" as const, label: "Світло" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.kind}
                type="button"
                onClick={() =>
                  addDecor(
                    opt.kind,
                    opt.kind === "dance"
                      ? "Танцювальна зона"
                      : opt.kind === "stage"
                        ? "Сцена"
                        : opt.kind === "wc"
                          ? "WC"
                          : undefined,
                  )
                }
                className="rounded-lg border border-line px-1 py-2 text-[10px] text-ink-soft hover:border-sage/40 hover:bg-mist"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {selected ? (
            <div className="mt-4 space-y-2 rounded-xl bg-mist p-3">
              <p className="text-xs font-semibold text-ink-soft">
                {selected.kind === "table" ? "Стіл" : "Елемент"}
              </p>
              <input
                value={
                  selected.kind === "table"
                    ? selected.label
                    : (selected.label ?? selected.decorKind)
                }
                onChange={(e) => renameSelected(e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-sage"
              />
              <button
                type="button"
                onClick={removeSelected}
                className="text-sm text-red-700 hover:underline"
              >
                Видалити
              </button>
            </div>
          ) : null}

          <div className="mt-5 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Гості
            </p>
            <div className="flex gap-1 text-xs">
              <button
                type="button"
                onClick={() => setGuestFilter("all")}
                className={
                  guestFilter === "all"
                    ? "rounded-full bg-sage px-2.5 py-1 text-white"
                    : "rounded-full px-2.5 py-1 text-ink-soft"
                }
              >
                Усі
              </button>
              <button
                type="button"
                onClick={() => setGuestFilter("free")}
                className={
                  guestFilter === "free"
                    ? "rounded-full bg-sage px-2.5 py-1 text-white"
                    : "rounded-full px-2.5 py-1 text-ink-soft"
                }
              >
                Вільні
              </button>
            </div>
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук…"
            className="mt-3 rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-sage"
          />

          <ul className="mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto">
            {visibleGuests.length === 0 ? (
              <li className="rounded-xl bg-mist px-3 py-6 text-center text-sm text-ink-soft">
                Додай гостей у списку, потім перетягни на місце.
              </li>
            ) : (
              visibleGuests.map((guest) => {
                const seated = seatedIds.has(guest.id);
                const selectedGuest = selectedGuestId === guest.id;
                return (
                  <li key={guest.id}>
                    <button
                      type="button"
                      draggable
                      onDragStart={(e) => onGuestDragStart(e, guest.id)}
                      onClick={() =>
                        setSelectedGuestId((id) =>
                          id === guest.id ? null : guest.id,
                        )
                      }
                      className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition ${
                        selectedGuest
                          ? "bg-sage/15 ring-1 ring-sage/40"
                          : "hover:bg-mist"
                      }`}
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sage/15 text-xs font-semibold text-sage-deep">
                        {initials(guest.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-ink">
                          {guest.name}
                        </span>
                        <span className="block text-[11px] text-ink-soft">
                          {seated ? "Посаджено" : "Вільний"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </aside>

        <div className="relative overflow-hidden rounded-2xl border border-line bg-[#e8ecf0]">
          <div className="flex items-center justify-end gap-2 border-b border-line/60 bg-white/70 px-3 py-2 backdrop-blur">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.55, z - 0.1))}
              className="size-8 rounded-lg border border-line text-ink-soft hover:bg-mist"
            >
              −
            </button>
            <span className="min-w-12 text-center text-xs tabular-nums text-ink-soft">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.25, z + 0.1))}
              className="size-8 rounded-lg border border-line text-ink-soft hover:bg-mist"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoom(0.85)}
              className="rounded-lg border border-line px-2 py-1.5 text-xs text-ink-soft hover:bg-mist"
            >
              Центр
            </button>
          </div>

          <div className="overflow-auto" style={{ maxHeight: 780 }}>
            <div
              className={`origin-top-left p-4 transition duration-700 ${
                ready ? "opacity-100" : "opacity-0"
              }`}
              style={{
                width: CANVAS_W * zoom + 32,
                height: CANVAS_H * zoom + 32,
              }}
            >
              <div
                ref={canvasRef}
                className="relative shadow-[0_20px_60px_rgba(22,26,23,0.08)]"
                style={{
                  width: CANVAS_W,
                  height: CANVAS_H,
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                  backgroundColor: "#f3f5f7",
                  backgroundImage:
                    "linear-gradient(to right, rgba(22,26,23,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(22,26,23,0.05) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                  animation: ready ? "soft-zoom 0.9s ease-out both" : undefined,
                }}
                onClick={() => setSelectedId(null)}
              >
                {items.map((item) => {
                  const selectedItem = selectedId === item.id;
                  if (item.kind === "decor") {
                    const box = decorBox(item);
                    return (
                      <div
                        key={item.id}
                        className={`absolute touch-none select-none ${
                          selectedItem ? "z-30 ring-2 ring-sage/35" : "z-10"
                        }`}
                        style={{
                          left: item.x,
                          top: item.y,
                          width: box.w,
                          height: box.h,
                          borderRadius: 12,
                          animation: ready
                            ? "rise 0.55s ease-out both"
                            : undefined,
                          animationDelay: ready ? "120ms" : undefined,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(item.id);
                        }}
                        onPointerDown={(e) => startDrag(e, item)}
                        onPointerMove={(e) => moveDrag(e, item.id)}
                        onPointerUp={endDrag}
                        onPointerCancel={endDrag}
                      >
                        <DecorVisual item={item} />
                      </div>
                    );
                  }

                  const box = tableBox(item);
                  const seats = seatPositions(item);
                  return (
                    <div
                      key={item.id}
                      className={`absolute touch-none select-none ${
                        selectedItem ? "z-30 ring-2 ring-sage/40" : "z-20"
                      }`}
                      style={{
                        left: item.x,
                        top: item.y,
                        width: box.w,
                        height: box.h,
                        borderRadius: 12,
                        animation: ready
                          ? "rise 0.6s ease-out both"
                          : undefined,
                        animationDelay: ready ? "180ms" : undefined,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(item.id);
                      }}
                      onPointerDown={(e) => startDrag(e, item)}
                      onPointerMove={(e) => moveDrag(e, item.id)}
                      onPointerUp={endDrag}
                      onPointerCancel={endDrag}
                    >
                      <TableBody table={item} />
                      {seats.map(({ seat, left, top, index }) => {
                        const guest = seat.guestId
                          ? guestById[seat.guestId]
                          : null;
                        return (
                          <button
                            key={seat.id}
                            type="button"
                            data-seat
                            title={guest?.name ?? `Місце ${index}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSeatClick(item.id, seat);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.stopPropagation();
                              onSeatDrop(e, item.id, seat.id);
                            }}
                            className={`absolute flex items-center justify-center overflow-hidden rounded-full border text-[10px] font-semibold shadow-sm transition ${
                              guest
                                ? "border-sage bg-sage text-white"
                                : "border-ink/30 bg-white text-ink-soft hover:border-sage"
                            }`}
                            style={{
                              left,
                              top,
                              width: SEAT_SIZE,
                              height: SEAT_SIZE,
                            }}
                          >
                            {guest ? (
                              <span className="truncate px-0.5">
                                {initials(guest.name)}
                              </span>
                            ) : (
                              index
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function CoupleSeatingPage() {
  return (
    <RequireAuth roles={["COUPLE", "ADMIN"]}>
      <section className="bg-paper px-5 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SeatingInner />
        </div>
      </section>
    </RequireAuth>
  );
}
