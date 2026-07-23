export type PlanPhase = {
  id: number;
  label: string;
  hint: string;
};

export type PlanItemMeta = {
  /** matches Task.categorySlug */
  key: string;
  phase: number;
  title: string;
  icon: string;
  href: string | null;
  ctaLabel: string;
  thingsToDo: string[];
  advice: Array<{ title: string; blurb: string }>;
};

export const PLAN_PHASES: PlanPhase[] = [
  { id: 1, label: "Основа", hint: "Починаємо" },
  { id: 2, label: "Команда", hint: "Бронюємо" },
  { id: 3, label: "Деталі", hint: "Збираємо" },
  { id: 4, label: "Фініш", hint: "Завершуємо" },
];

function item(
  key: string,
  phase: number,
  title: string,
  icon: string,
  href: string | null,
  ctaLabel: string,
  thingsToDo: string[],
  adviceTitle: string,
  adviceBlurb: string,
): PlanItemMeta {
  return {
    key,
    phase,
    title,
    icon,
    href,
    ctaLabel,
    thingsToDo,
    advice: [{ title: adviceTitle, blurb: adviceBlurb }],
  };
}

export const PLAN_ITEMS: PlanItemMeta[] = [
  item(
    "date",
    1,
    "Обрати дату весілля",
    "📅",
    null,
    "Зберегти дату",
    [
      "Обери день у календарі",
      "Вкажи місто й орієнтовну кількість гостей",
      "Перевір сезонність цін",
    ],
    "Залиш запас",
    "Популярні літні й вересневі дати бронюють за 9–12 місяців.",
  ),
  item(
    "venue",
    1,
    "Знайти та зберегти локації",
    "🏛",
    "/budget",
    "Закласти бюджет на локацію",
    [
      "Оціни потрібну місткість",
      "Збережи 3–5 варіантів поза платформою",
      "Заплануй перегляди наживо",
    ],
    "Порівнюй повну ціну",
    "Уточнюй кейтеринг, оренду, сервісний збір, генератор і час завершення.",
  ),
  item(
    "vibe",
    1,
    "Визначити вайб весілля",
    "✨",
    null,
    "Зафіксувати вайб",
    [
      "Обери 3 слова про атмосферу",
      "Збери палітру й референси",
      "Узгодь стиль із партнером",
    ],
    "Не копіюй усе",
    "Вибери кілька головних деталей — так концепція буде цілісною, а не перевантаженою.",
  ),
  item(
    "guests",
    1,
    "Почати список гостей",
    "👥",
    "/guests",
    "Відкрити список гостей",
    [
      "Додай найближчих гостей",
      "Розділи список по сторонах",
      "Оціни плюс-один і дітей",
    ],
    "Спочатку A-list",
    "Почни з людей, без яких не уявляєш день — бюджет одразу стане реалістичнішим.",
  ),
  item(
    "budget",
    1,
    "Скласти бюджет",
    "₴",
    "/budget",
    "Відкрити бюджет",
    [
      "Розбий бюджет по категоріях",
      "Внеси очікувані та фактичні суми",
      "Залиш резерв 10%",
    ],
    "Пріоритети важливіші",
    "Оберіть 2–3 речі, на яких не економите, і скорочуйте решту.",
  ),
  item(
    "photo",
    1,
    "Знайти фотографа",
    "📷",
    "/budget",
    "Закласти бюджет на фото",
    [
      "Обери стиль зйомки",
      "Переглянь повні весільні серії",
      "Порівняй пакети й терміни",
    ],
    "Дивись не лише Instagram",
    "Повна галерея покаже, як фотограф працює зі світлом, гостями й репортажем.",
  ),

  item(
    "invitations",
    2,
    "Обрати запрошення",
    "💌",
    "/invitations",
    "Відкрити запрошення",
    [
      "Обери цифровий або друкований формат",
      "Підготуй текст і дедлайн RSVP",
      "Звір дизайн із вайбом весілля",
    ],
    "Дай гостям конкретику",
    "Дата, локація, дрескод і спосіб відповіді мають читатися за кілька секунд.",
  ),
  item(
    "music",
    2,
    "Знайти музику / DJ",
    "🎧",
    "/budget",
    "Закласти бюджет на музику",
    [
      "Визнач формат: DJ, гурт або обидва",
      "Склади must-play і do-not-play",
      "Уточни техніку на локації",
    ],
    "Церемонія ≠ вечірка",
    "Окремо продумайте музику для виходу, вечері й танцполу.",
  ),
  item(
    "catering",
    2,
    "Знайти кейтеринг",
    "🍽",
    "/budget",
    "Закласти бюджет на банкет",
    [
      "Оціни формат подачі",
      "Заплануй дегустацію",
      "Збери алергії й особливі меню",
    ],
    "Рахуй на гостя",
    "Порівнюй пропозиції за однаковою кількістю гостей, напоями та сервісом.",
  ),
  item(
    "website",
    2,
    "Почати весільний сайт",
    "🌐",
    "/website",
    "Відкрити сайт",
    [
      "Підготуй вашу історію та фото",
      "Додай програму й логістику",
      "Збери в одному місці RSVP та контакти",
    ],
    "Одна точка правди",
    "Сайт зменшує десятки однакових питань від гостей у месенджерах.",
  ),
  item(
    "registry",
    2,
    "Скласти список подарунків",
    "🎁",
    null,
    "Створити список",
    [
      "Обговоріть, що вам справді потрібно",
      "Додайте подарунки різного бюджету",
      "Поділіться списком делікатно",
    ],
    "Залиш вибір",
    "Різні цінові рівні допоможуть гостям обрати комфортний варіант.",
  ),
  item(
    "decor",
    2,
    "Обрати флористику та декор",
    "💐",
    "/budget",
    "Закласти бюджет на декор",
    [
      "Збери палітру й референси",
      "Визнач ключові зони декору",
      "Узгодь доставку та демонтаж",
    ],
    "Сезонні квіти",
    "Вони свіжіші, природніше виглядають і часто дешевші.",
  ),
  item(
    "officiant",
    2,
    "Знайти ведучого церемонії",
    "🎙",
    "/budget",
    "Закласти бюджет на ведучого",
    [
      "Визнач тон церемонії",
      "Обговори вашу історію",
      "Підготуй клятви й таймінг",
    ],
    "Хімія вирішує",
    "Зустріньтесь наживо або онлайн — голос і подача мають бути вашими.",
  ),

  item(
    "beauty",
    3,
    "Запланувати beauty-проби",
    "💄",
    "/budget",
    "Закласти бюджет на beauty",
    [
      "Збережи референси образу",
      "Запиши пробний макіяж і зачіску",
      "Склади таймінг ранку",
    ],
    "Проба за 4–6 тижнів",
    "Цього достатньо, щоб скоригувати образ під сукню та аксесуари.",
  ),
  item(
    "planner",
    3,
    "Познайомитись з організаторами",
    "📋",
    null,
    "Зафіксувати формат допомоги",
    [
      "Визнач потрібний формат допомоги",
      "Обговори бюджет і складність дня",
      "Порівняй підхід кількох команд",
    ],
    "Координатор теж рятує",
    "Якщо повна організація не потрібна, візьми координацію хоча б на день весілля.",
  ),
  item(
    "attire",
    3,
    "Обрати образи та обручки",
    "💍",
    "/budget",
    "Закласти бюджет на образи",
    [
      "Заплануй примірки",
      "Заклади час на пошив і корекції",
      "Обери обручки та гравіювання",
    ],
    "Комфорт видно на фото",
    "Образ має витримати церемонію, вечерю й танці — не лише примірочну.",
  ),
  item(
    "invite-guests",
    3,
    "Надіслати запрошення гостям",
    "📨",
    "/guests",
    "Перейти до гостей",
    [
      "Перевір адреси й контакти",
      "Надішли запрошення",
      "Постав зрозумілий дедлайн RSVP",
    ],
    "Надішли завчасно",
    "Для локального весілля орієнтуйся на 2–3 місяці, для destination — раніше.",
  ),
  item(
    "cake",
    3,
    "Спробувати й обрати торт",
    "🍰",
    "/budget",
    "Закласти бюджет на торт",
    [
      "Обери смаки й вагу",
      "Заплануй дегустацію",
      "Узгодь доставку та зберігання",
    ],
    "Не тільки зовнішність",
    "Смак, стійкість крему й логістика важливіші за складний декор.",
  ),
  item(
    "favorites",
    3,
    "Скласти фінальний шортліст",
    "♥",
    "/dashboard",
    "Повернутись до плану",
    [
      "Залиш до трьох варіантів на категорію",
      "Порівняй пакети й відгуки",
      "Зафіксуй фінальні рішення",
    ],
    "Менше варіантів — легше рішення",
    "Після трьох сильних кандидатів додатковий пошук зазвичай лише додає шуму.",
  ),

  item(
    "rsvp",
    4,
    "Зібрати всі RSVP",
    "✅",
    "/guests",
    "Перевірити RSVP",
    [
      "Перевір, хто ще не відповів",
      "Делікатно нагадай гостям",
      "Передай фінальну кількість локації",
    ],
    "Постав внутрішній дедлайн",
    "Заверши RSVP на тиждень раніше дедлайну кейтерингу — буде запас на запізнілі відповіді.",
  ),
  item(
    "requests",
    4,
    "Фіналізувати деталі дня",
    "🗓",
    "/dashboard",
    "Відкрити план дня",
    [
      "Підтвердь час і контакти всіх підрядників",
      "Склади детальний таймінг",
      "Передай план координатору й близьким",
    ],
    "Один фінальний документ",
    "Збери телефони, адреси, таймінг і відповідальних в одному файлі.",
  ),
  item(
    "married",
    4,
    "Одружитися!",
    "🥂",
    null,
    "Святкувати",
    [
      "Віддай контроль координатору",
      "Не перевіряй робочі чати",
      "Будь у моменті й святкуй",
    ],
    "План уже зробив свою роботу",
    "У день весілля нічого не оптимізуй — проживи його разом із вашими людьми.",
  ),
];

export function getPhaseWindowLabel(date: string, phase: number): string {
  const target = new Date(`${date.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(target.getTime())) return "за планом";

  const now = new Date();
  const days = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (days <= 0) return "зараз";

  const months = Math.max(1, Math.ceil(days / 30.44));
  if (months === 1) return "0–1 міс.";

  const boundaries = [
    months,
    Math.round(months * 0.75),
    Math.round(months * 0.5),
    Math.round(months * 0.25),
    0,
  ];
  const high = boundaries[phase - 1];
  const low = boundaries[phase];

  return low === high ? `${high} міс.` : `${low}–${high} міс.`;
}

export function hrefForPlanKey(key: string): string | null {
  return PLAN_ITEMS.find((planItem) => planItem.key === key)?.href ?? null;
}

/** Місяці до весілля для фаз плану (орієнтовні дедлайни). */
const PHASE_MONTHS_BEFORE = [10, 7, 4, 1] as const;

export function suggestedDueDateForPlanItem(
  weddingDateIso: string,
  categorySlug: string | null | undefined,
  sortOrder = 0,
): string | null {
  const wedding = new Date(`${weddingDateIso.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(wedding.getTime())) return null;

  const meta = PLAN_ITEMS.find((item) => item.key === categorySlug);
  const phase = meta?.phase ?? 2;
  const monthsBefore = PHASE_MONTHS_BEFORE[phase - 1] ?? 4;
  const due = new Date(wedding);
  due.setMonth(due.getMonth() - monthsBefore);
  // Розкидаємо задачі в межах місяця, щоб не всі в один день
  const day = Math.min(28, 2 + (sortOrder % 12) * 2);
  due.setDate(day);
  return due.toISOString().slice(0, 10);
}

export function planCategoryLabel(categorySlug: string | null | undefined): string {
  if (!categorySlug) return "Інше";
  if (categorySlug.startsWith("phase-")) return "Своє";
  const meta = PLAN_ITEMS.find((item) => item.key === categorySlug);
  if (!meta) return "Інше";
  return PLAN_PHASES.find((p) => p.id === meta.phase)?.label ?? "План";
}

export function monthKeyFromIso(iso: string): string {
  return iso.slice(0, 7);
}

export function formatMonthYearUk(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  if (!y || !m) return monthKey;
  const label = new Intl.DateTimeFormat("uk-UA", {
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatDayMonthUk(iso: string): string {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
  }).format(new Date(`${iso.slice(0, 10)}T12:00:00`));
}
