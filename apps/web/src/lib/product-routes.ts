/** Публічні SEO-лендинги ↔ розділи кабінету пари. */
export const PRODUCT_NAV = [
  {
    id: "plan",
    label: "План весілля",
    shortLabel: "План",
    guestHref: "/vesilnyy-plan",
    coupleHref: "/dashboard",
  },
  {
    id: "budget",
    label: "Бюджет весілля",
    shortLabel: "Бюджет",
    guestHref: "/vesilnyy-byudzhet",
    coupleHref: "/budget",
  },
  {
    id: "invitations",
    label: "Онлайн-запрошення",
    shortLabel: "Запрошення",
    guestHref: "/zaprosinnya",
    coupleHref: "/invitations",
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
