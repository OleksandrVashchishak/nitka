export const NAME_CARD_DESIGNS = [
  { id: "botanical", name: "Ботанічний" },
  { id: "minimal", name: "Мінімалістичний" },
  { id: "modern", name: "Сучасний" },
  { id: "simple", name: "Простий" },
  { id: "elegant", name: "Елегантний" },
  { id: "magazine", name: "Журнальний" },
] as const;

export type NameCardDesignId = (typeof NAME_CARD_DESIGNS)[number]["id"];

export const NAME_CARDS_PER_PAGE = 8;

/** Demo names for empty guest list preview (matches Figma). */
export const NAME_CARD_DEMO_NAMES = [
  "Марія Левченко",
  "Анна Грищенко",
  "Іван Петров",
  "Олена Ткаченко",
  "Сергій Шевченко",
  "Андрій Бондаренко",
  "Катерина Мельник",
  "Дмитро Кравченко",
];

/** Date shown on demo cards when the wedding date is not set yet. */
export const NAME_CARD_DEMO_DATE = "28.07.27";

/** ISO date → `ДД.ММ.РР` (як на картках). */
export function formatNameCardDate(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
}

const MONTHS_GENITIVE = [
  "січня", "лютого", "березня", "квітня", "травня", "червня",
  "липня", "серпня", "вересня", "жовтня", "листопада", "грудня",
];

/** ISO date → `28 липня 2027`. */
export function formatNameCardDateLong(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MONTHS_GENITIVE[d.getMonth()]} ${d.getFullYear()}`;
}

export const NAME_CARD_DEMO_DATE_LONG = "28 липня 2027";

export function isNameCardDesignReady(id: NameCardDesignId) {
  const design = NAME_CARD_DESIGNS.find((d) => d.id === id);
  return Boolean(design && !("soon" in design && design.soon));
}

export function chunkNames(names: string[], size = NAME_CARDS_PER_PAGE) {
  const pages: string[][] = [];
  for (let i = 0; i < names.length; i += size) {
    pages.push(names.slice(i, i + size));
  }
  if (pages.length === 0) pages.push([]);
  return pages;
}

export function extraPagesLabel(extra: number) {
  if (extra <= 0) return null;
  const abs = Math.abs(extra) % 100;
  const last = abs % 10;
  let word = "сторінок";
  if (!(abs > 10 && abs < 20)) {
    if (last === 1) word = "сторінка";
    else if (last >= 2 && last <= 4) word = "сторінки";
  }
  return `+${extra} ${word} з іменами ваших гостей`;
}
