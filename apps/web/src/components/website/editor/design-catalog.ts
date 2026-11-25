export type DesignOption = {
  id: string;
  templateId: string;
  name: string;
  description: string;
  thumb: string;
};

/** UI catalog for Design tab. templateId maps to API-supported themes. */
export const DESIGN_OPTIONS: DesignOption[] = [
  {
    id: "modern",
    templateId: "classic-white",
    name: "Сучасний",
    description: "Елегантна типографія з круглими зображеннями",
    thumb: "/landing/couple.jpg",
  },
  {
    id: "gentle",
    templateId: "navy-gold",
    name: "Ніжний",
    description: "М’які тони та квіткові візерунки",
    thumb: "/landing/compare-1.jpg",
  },
  {
    id: "botanical",
    templateId: "botanical",
    name: "Ботанічний",
    description: "Елегантні органічні лінії листя та мінімалізм",
    thumb: "/landing/feat-1.jpg",
  },
  {
    id: "fashionable",
    templateId: "navy-gold",
    name: "Фешенебельний",
    description: "Вишуканий дизайн у червоному кольорі",
    thumb: "/landing/feat-2.jpg",
  },
];

/** Не тема, а замовлення: замість превʼю показуємо форму заявки. */
export const CUSTOM_DESIGN = {
  id: "custom",
  name: "Кастомний дизайн",
  description: "Ви можете замовити у нас оригінальний дизайн сайту саме для вас",
  thumb: "/landing/hero-photo.jpg",
};

export function designIdFromTemplate(templateId: string) {
  return (
    DESIGN_OPTIONS.find((d) => d.templateId === templateId)?.id ??
    DESIGN_OPTIONS[0].id
  );
}
