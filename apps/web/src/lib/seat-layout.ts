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

function pct(n: number): string {
  return `${Math.round(n * 1000) / 10}%`;
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
