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
    id: "editorial",
    templateId: "classic-white",
    name: "Редакційний",
    description: "Класична типографія з динамічними сітками",
    thumb: "/landing/couple.jpg",
  },
  {
    id: "minimal",
    templateId: "classic-white",
    name: "Мінімалістичний",
    description: "Чисті лінії, багато повітря і спокій",
    thumb: "/landing/hero-photo.jpg",
  },
  {
    id: "romantic",
    templateId: "navy-gold",
    name: "Романтичний",
    description: "М’які акценти й тепло фото-героя",
    thumb: "/landing/compare-1.jpg",
  },
  {
    id: "botanical",
    templateId: "dark-botanical",
    name: "Ботанічний",
    description: "Темний фон із флоральними деталями",
    thumb: "/landing/feat-1.jpg",
  },
  {
    id: "modern",
    templateId: "navy-gold",
    name: "Сучасний",
    description: "Контраст, ритм і сучасна композиція",
    thumb: "/landing/feat-2.jpg",
  },
  {
    id: "elegant",
    templateId: "classic-white",
    name: "Елегантний",
    description: "Стриманий тон і витончена типографіка",
    thumb: "/landing/feat-3.jpg",
  },
];

export function designIdFromTemplate(templateId: string) {
  return (
    DESIGN_OPTIONS.find((d) => d.templateId === templateId)?.id ??
    DESIGN_OPTIONS[0].id
  );
}
