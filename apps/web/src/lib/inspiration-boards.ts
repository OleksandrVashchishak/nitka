export type InspirationBoard = {
  id: string;
  title: string;
  images: string[];
};

/** Lightweight starter photos so empty boards don't feel dead. */
export const DEFAULT_INSPIRATION_BOARDS: InspirationBoard[] = [
  {
    id: "bouquets",
    title: "Букети",
    images: [
      "/landing/prefooter/footer-placeholder-2.jpg",
      "/landing/prefooter/footer-placeholder-7.jpg",
      "/landing/prefooter/footer-placeholder-14.jpg",
      "/landing/couple.jpg",
    ],
  },
  {
    id: "tables",
    title: "Столи",
    images: [
      "/landing/prefooter/footer-placeholder-4.jpg",
      "/landing/feat-3.jpg",
      "/landing/prefooter/footer-placeholder-10.jpg",
      "/landing/feat-4.jpg",
    ],
  },
  {
    id: "arch",
    title: "Арка",
    images: [
      "/wedding-site/story.jpg",
      "/landing/prefooter/footer-placeholder-3.jpg",
      "/landing/prefooter/footer-placeholder-18.jpg",
      "/wedding-site/hero.jpg",
    ],
  },
  {
    id: "other",
    title: "Інше",
    images: [
      "/landing/hero-photo.jpg",
      "/landing/prefooter/footer-placeholder-11.jpg",
      "/landing/prefooter/footer-placeholder-1.jpg",
      "/landing/prefooter/footer-placeholder-6.jpg",
    ],
  },
];

export function inspirationBoardsStorageKey(weddingId: string) {
  return `fata-inspiration-boards:v4:${weddingId}`;
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

const DEFAULT_INSPIRATION_IMAGE_SET = new Set(
  DEFAULT_INSPIRATION_BOARDS.flatMap((b) => b.images),
);

/** Images the couple uploaded themselves (starter photos excluded). */
export function userInspirationImages(weddingId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(inspirationBoardsStorageKey(weddingId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InspirationBoard[];
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((b) =>
      b && Array.isArray(b.images)
        ? b.images.filter(
            (src): src is string =>
              typeof src === "string" && !DEFAULT_INSPIRATION_IMAGE_SET.has(src),
          )
        : [],
    );
  } catch {
    return [];
  }
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
