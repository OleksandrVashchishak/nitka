export const NAME_CARD_DESIGNS = [
  {
    id: "simple",
    name: "Простий",
    description: "Чистий текст без декору — зручно різати",
  },
  {
    id: "minimal",
    name: "Мінімалістичний",
    description: "Легка типографіка й більше повітря",
    soon: true,
  },
  {
    id: "romantic",
    name: "Романтичний",
    description: "М’який шрифт із романтичним вайбом",
    soon: true,
  },
  {
    id: "botanical",
    name: "Ботанічний",
    description: "Флоральні акценти навколо імені",
    soon: true,
  },
  {
    id: "modern",
    name: "Сучасний",
    description: "Контраст і сучасна композиція",
    soon: true,
  },
  {
    id: "elegant",
    name: "Елегантний",
    description: "Стримана елегантна типографіка",
    soon: true,
  },
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
