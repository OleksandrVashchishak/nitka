import type { SeatTableKind } from "@/lib/seat-layout";

/**
 * Посадка гостя на конкретне місце плану (тап, drag, модалка «Посадити»).
 * Чиста логіка без React — щоб правила (обмін, «поруч», ланцюжок) були в одному місці.
 */
export type PlaceSeat = { id: string; guestKey: string | null };
export type PlaceTable = {
  id: string;
  kind: SeatTableKind;
  shape?: "round" | "long";
  seats: PlaceSeat[];
};

function isRoundLike(table: PlaceTable) {
  return table.kind === "round" || (table.kind === "kids" && table.shape !== "long");
}

/** Відстань між місцями в «кроках» місць: сусід = 1, навпроти через стіл трохи далі. */
export function seatDistance(table: PlaceTable, a: number, b: number): number {
  const n = table.seats.length;
  if (a === b) return 0;
  if (isRoundLike(table)) {
    const d = Math.abs(a - b) % n;
    return Math.min(d, n - d);
  }
  if (table.kind === "long" || table.kind === "kids") {
    // Як у seatPosition: верхній ряд зліва направо, потім нижній зліва направо.
    const half = Math.ceil(n / 2);
    const bottom = Math.max(n - half, 1);
    const pos = (i: number) =>
      i < half
        ? { row: 0, x: half <= 1 ? 0.5 : i / (half - 1), steps: Math.max(half - 1, 1) }
        : {
            row: 1,
            x: bottom <= 1 ? 0.5 : (i - half) / (bottom - 1),
            steps: Math.max(bottom - 1, 1),
          };
    const pa = pos(a);
    const pb = pos(b);
    const steps = Math.max(pa.steps, pb.steps);
    return Math.abs(pa.x - pb.x) * steps + (pa.row === pb.row ? 0 : 1.5);
  }
  return Math.abs(a - b);
}

/** Найближчі до `fromSeatId` місця з `candidates` (по черзі, без повторів). */
export function nearestSeats(
  table: PlaceTable,
  fromSeatId: string,
  candidates: string[],
  count: number,
): string[] {
  const from = table.seats.findIndex((s) => s.id === fromSeatId);
  const indexOf = new Map(table.seats.map((s, i) => [s.id, i]));
  return [...candidates]
    .sort((x, y) => {
      const ix = indexOf.get(x) ?? 0;
      const iy = indexOf.get(y) ?? 0;
      return seatDistance(table, from, ix) - seatDistance(table, from, iy) || ix - iy;
    })
    .slice(0, Math.max(0, count));
}

export function locateGuest(
  tables: PlaceTable[],
  guestKey: string,
): { tableId: string; seatId: string } | null {
  for (const t of tables) {
    for (const s of t.seats) {
      if (s.guestKey === guestKey) return { tableId: t.id, seatId: s.id };
    }
  }
  return null;
}

export type PlaceOutcome<T extends PlaceTable> =
  | {
      status: "placed";
      tables: T[];
      /** Хто сидів на цьому місці й тепер без місця. */
      evicted: string | null;
      /** З ким гість помінявся місцями. */
      swappedWith: string | null;
      /** Хто з ланцюжка не вмістився (лише з allowSplit). */
      leftOut: string[];
    }
  | {
      status: "conflict";
      /** Скільки місць є для гостя й ланцюжка (разом із цим місцем). */
      available: number;
      /** Хто з ланцюжка мав би пересісти разом із гостем. */
      mates: string[];
    };

/**
 * Садить `guestKey` на `seatId`.
 * - Місце зайняте, а гість уже сидить → міняються місцями (ланцюжок не чіпаємо).
 * - Місце зайняте, гість без місця → той, хто сидів, стає без місця (`evicted`).
 * - `mates` (ланцюжок) сідають за той самий стіл на найближчі вільні місця.
 *   За дитячий стіл ланцюжок не йде. Не вистачає місць → `conflict`
 *   (або садимо скільки влізе, якщо `allowSplit`).
 */
export function placeGuest<T extends PlaceTable>(
  tables: T[],
  tableId: string,
  seatId: string,
  guestKey: string,
  mates: string[],
  opts: { allowSplit?: boolean } = {},
): PlaceOutcome<T> {
  const unchanged: PlaceOutcome<T> = {
    status: "placed",
    tables,
    evicted: null,
    swappedWith: null,
    leftOut: [],
  };
  const table = tables.find((t) => t.id === tableId);
  const target = table?.seats.find((s) => s.id === seatId);
  if (!table || !target) return unchanged;

  const from = locateGuest(tables, guestKey);
  const occupant =
    target.guestKey && target.guestKey !== guestKey ? target.guestKey : null;

  if (occupant && from) {
    return {
      status: "placed",
      tables: tables.map((t) => ({
        ...t,
        seats: t.seats.map((s) => {
          if (t.id === tableId && s.id === seatId) return { ...s, guestKey };
          if (t.id === from.tableId && s.id === from.seatId) {
            return { ...s, guestKey: occupant };
          }
          return s;
        }),
      })),
      evicted: null,
      swappedWith: occupant,
      leftOut: [],
    };
  }

  const moving =
    table.kind === "kids"
      ? []
      : mates.filter(
          (m) =>
            m !== guestKey &&
            m !== occupant &&
            !table.seats.some((s) => s.guestKey === m),
        );
  const free = table.seats
    .filter((s) => s.id !== seatId && (!s.guestKey || s.guestKey === guestKey))
    .map((s) => s.id);

  if (moving.length > free.length && !opts.allowSplit) {
    return { status: "conflict", available: free.length + 1, mates: moving };
  }

  const chosen = nearestSeats(table, seatId, free, moving.length);
  const placed = new Map<string, string>([[seatId, guestKey]]);
  chosen.forEach((id, i) => placed.set(id, moving[i]));
  const relocated = new Set<string>([guestKey, ...moving.slice(0, chosen.length)]);

  return {
    status: "placed",
    tables: tables.map((t) => ({
      ...t,
      seats: t.seats.map((s) => {
        const next = t.id === tableId ? placed.get(s.id) : undefined;
        if (next) return { ...s, guestKey: next };
        if (s.guestKey && relocated.has(s.guestKey)) return { ...s, guestKey: null };
        return s;
      }),
    })),
    evicted: occupant,
    swappedWith: null,
    leftOut: moving.slice(chosen.length),
  };
}
