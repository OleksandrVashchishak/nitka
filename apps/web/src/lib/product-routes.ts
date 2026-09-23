/** Публічні SEO-лендинги ↔ розділи кабінету пари. */
export const PRODUCT_NAV = [
  {
    id: "plan",
    label: "План весілля",
    shortLabel: "План",
    guestHref: "/vesilnyy-plan",
    coupleHref: "/checklist",
  },
  {
    id: "dayPlan",
    label: "План дня весілля",
    shortLabel: "План дня",
    guestHref: "/plan-dnya-vesillya",
    coupleHref: "/day-plan",
  },
  {
    id: "budget",
    label: "Бюджет весілля",
    shortLabel: "Бюджет",
    guestHref: "/vesilnyy-byudzhet",
    coupleHref: "/budget",
  },
  {
    id: "guests",
    label: "Гості та запрошення",
    shortLabel: "Гості",
    guestHref: "/spysok-gostey",
    coupleHref: "/guests",
  },
  {
    id: "website",
    label: "Весільний сайт",
    shortLabel: "Сайт",
    guestHref: "/vesilnyy-sayt",
    coupleHref: "/website",
  },
] as const;

export type ProductNavItem = (typeof PRODUCT_NAV)[number];
