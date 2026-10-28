export type SeatTableKind =
  | "presidium"
  | "round"
  | "long"
  | "kids"
  | "t-shape"
  | "p-shape";

export type SeatPos = { left: string; top: string };

/** Default seats matching format picker icons (Figma). */
export const DEFAULT_T_SHAPE_SEATS = 18;
export const DEFAULT_P_SHAPE_SEATS = 22;

export function defaultShapedSeatCount(kind: "t-shape" | "p-shape"): number {
  return kind === "t-shape" ? DEFAULT_T_SHAPE_SEATS : DEFAULT_P_SHAPE_SEATS;
}

/** Split `total` seats across edges by relative weights. */
export function splitSeatCounts(total: number, weights: number[]): number[] {
  const safeTotal = Math.max(0, total);
  if (weights.length === 0) return [];
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const raw = weights.map((w) => (safeTotal * w) / sum);
  const counts = raw.map((r) => Math.floor(r));
  let rem = safeTotal - counts.reduce((a, b) => a + b, 0);
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < rem; k += 1) {
    const target = order[k % order.length];
    if (target) counts[target.i] += 1;
  }
  return counts;
}

function along(count: number, index: number): number {
  if (count <= 1) return 0.5;
  return index / (count - 1);
}

/** Min distance between seat centers along a table edge / ring (seat is 26px). */
const SEAT_STEP = 34;

/**
 * Table body size that grows with seat count so seats keep their spacing.
 * `scale` is only set for T/P shapes (their stem/legs scale with the body).
 */
export function tableBodyDims(
  kind: SeatTableKind,
  shape: "round" | "long" | undefined,
  seats: number,
): { w: number; h: number; scale?: number } {
  const n = Math.max(seats, 1);
  if (kind === "t-shape" || kind === "p-shape") {
    const scale = Math.max(1, n / defaultShapedSeatCount(kind));
    return { w: 280 * scale, h: 200 * scale, scale };
  }
  if (kind === "presidium") {
    return { w: Math.max(320, Math.ceil((n - 1) * (SEAT_STEP / 0.8))), h: 56 };
  }
  if (kind === "round") {
    const d = Math.max(120, Math.ceil((n * SEAT_STEP) / 3.3));
    return { w: d, h: d };
  }
  if (kind === "kids" && shape !== "long") {
    const d = Math.max(100, Math.ceil((n * SEAT_STEP) / 3.3));
    return { w: d, h: d };
  }
  const half = Math.ceil(n / 2);
  const base = kind === "kids" ? 240 : 280;
  return {
    w: Math.max(base, Math.ceil((half - 1) * (SEAT_STEP / 0.8))),
    h: 48,
  };
}

/** `n` is already on a 0–100 percentage scale (not 0–1). */
function pct(n: number): string {
  return `${Math.round(n * 10) / 10}%`;
}

/** T: top bar seats + stem left/right. Body ~280×200. Weights 8+5+5. */
export function tShapeSeatPosition(index: number, total: number): SeatPos {
  const [topN = 0, leftN = 0, rightN = 0] = splitSeatCounts(total, [8, 5, 5]);
  if (index < topN) {
    const t = along(topN, index);
    return { left: pct(8 + t * 84), top: "0%" };
  }
  const afterTop = index - topN;
  if (afterTop < leftN) {
    const t = along(leftN, afterTop);
    return { left: "41.4%", top: pct(30 + t * 66) };
  }
  const j = afterTop - leftN;
  const t = along(rightN, j);
  return { left: "58.6%", top: pct(30 + t * 66) };
}

/**
 * П: top outer + left outer/inner + right inner/outer.
 * Body ~280×200, legs ~48px. Weights 4+5+4+4+5 = 22.
 */
export function pShapeSeatPosition(index: number, total: number): SeatPos {
  const [topN = 0, loN = 0, liN = 0, riN = 0, roN = 0] = splitSeatCounts(
    total,
    [4, 5, 4, 4, 5],
  );
  if (index < topN) {
    const t = along(topN, index);
    return { left: pct(22 + t * 56), top: "0%" };
  }
  let i = index - topN;
  if (i < loN) {
    const t = along(loN, i);
    return { left: "0%", top: pct(28 + t * 68) };
  }
  i -= loN;
  if (i < liN) {
    const t = along(liN, i);
    return { left: "17.1%", top: pct(34 + t * 62) };
  }
  i -= liN;
  if (i < riN) {
    const t = along(riN, i);
    return { left: "82.9%", top: pct(34 + t * 62) };
  }
  i -= riN;
  const t = along(roN, i);
  return { left: "100%", top: pct(28 + t * 68) };
}

export function shapedSeatPosition(
  kind: "t-shape" | "p-shape",
  index: number,
  total: number,
): SeatPos {
  return kind === "t-shape"
    ? tShapeSeatPosition(index, total)
    : pShapeSeatPosition(index, total);
}
