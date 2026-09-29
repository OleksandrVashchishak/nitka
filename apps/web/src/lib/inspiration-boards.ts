export type InspirationBoard = {
  id: string;
  title: string;
  images: string[];
};

export const DEFAULT_INSPIRATION_BOARDS: InspirationBoard[] = [
  { id: "bouquets", title: "Букети", images: [] },
  { id: "tables", title: "Столи", images: [] },
  { id: "arch", title: "Арка", images: [] },
  { id: "other", title: "Інше", images: [] },
];

export function inspirationBoardsStorageKey(weddingId: string) {
  return `fata-inspiration-boards:v2:${weddingId}`;
}

export function imageCountLabel(count: number) {
  const n = Math.max(0, Math.round(count));
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return `${n} зображень`;
  if (mod10 === 1) return `${n} зображення`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} зображення`;
  return `${n} зображень`;
}

export function loadInspirationBoards(weddingId: string): InspirationBoard[] {
  try {
    const raw = localStorage.getItem(inspirationBoardsStorageKey(weddingId));
    if (!raw) {
      return DEFAULT_INSPIRATION_BOARDS.map((b) => ({
        ...b,
        images: [...b.images],
      }));
    }
    const parsed = JSON.parse(raw) as InspirationBoard[];
    if (!Array.isArray(parsed)) {
      return DEFAULT_INSPIRATION_BOARDS.map((b) => ({
        ...b,
        images: [...b.images],
      }));
    }
    return parsed
      .filter(
        (b) =>
          b &&
          typeof b.id === "string" &&
          typeof b.title === "string" &&
          Array.isArray(b.images),
      )
      .map((b) => ({
        id: b.id,
        title: b.title,
        images: b.images.filter((src): src is string => typeof src === "string"),
      }));
  } catch {
    return DEFAULT_INSPIRATION_BOARDS.map((b) => ({
      ...b,
      images: [...b.images],
    }));
  }
}

export function saveInspirationBoards(
  weddingId: string,
  boards: InspirationBoard[],
) {
  localStorage.setItem(
    inspirationBoardsStorageKey(weddingId),
    JSON.stringify(boards),
  );
}

/** Tile aspect ratios from the board-card collage (same grid language). */
export const INSPIRATION_TILE_ASPECTS = [
  119 / 117,
  119 / 153,
  119 / 124,
  119 / 88,
] as const;

export function inspirationTileAspect(index: number) {
  return INSPIRATION_TILE_ASPECTS[index % INSPIRATION_TILE_ASPECTS.length];
}
