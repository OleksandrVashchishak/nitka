export type SmartFeatureId =
  | "coordinator"
  | "racs"
  | "church"
  | "outdoor"
  | "remote_guests"
  | "welcome"
  | "photozone"
  | "first_dance"
  | "decorator"
  | "cake"
  | "candy_bar"
  | "cossack_table";

export type SmartDoneId =
  | "date_chosen"
  | "ceremony_venue"
  | "banquet_venue"
  | "outdoor_done"
  | "coordinator_chosen"
  | "photographer"
  | "videographer"
  | "music"
  | "decorator_found"
  | "host_found"
  | "guest_list"
  | "invitations_sent"
  | "rsvp"
  | "dress"
  | "suit"
  | "makeup"
  | "rings"
  | "cake_ordered"
  | "transport";

export type SmartPlanCategoryId =
  | "ceremony"
  | "coordination"
  | "banquet"
  | "look"
  | "guests"
  | "photo"
  | "style";

export type SmartFeature = { id: SmartFeatureId; label: string };

export type SmartDoneItem = { id: SmartDoneId; label: string };

export type SmartDoneGroup = {
  id: string;
  title: string;
  items: SmartDoneItem[];
};

export type SmartPlanTask = {
  id: string;
  title: string;
  categorySlug: string;
  categoryId: SmartPlanCategoryId;
  /** Днів до дати весілля (0 = у день весілля). Без дати весілля дедлайн не ставимо. */
  daysBefore: number;
  /** Якщо задано — задача з’являється лише коли обрана фіча з кроку 1 */
  requires?: SmartFeatureId[];
  /** Якщо хоча б одна з фіч обрана (OR). Ігнорується якщо є requires. */
  requiresAny?: SmartFeatureId[];
  /** Прибрати, якщо пункт уже зроблений на кроці 2 */
  excludeIfDone?: SmartDoneId[];
};

export type SmartPlanCategory = {
  id: SmartPlanCategoryId;
  title: string;
};

export const SMART_FEATURES: SmartFeature[] = [
  { id: "coordinator", label: "Весільний координатор (організатори)" },
  { id: "racs", label: "Розпис у РАЦСі" },
  { id: "church", label: "Шлюб у церкві" },
  { id: "outdoor", label: "Виїзна церемонія" },
  { id: "remote_guests", label: "Гості здалеку (потрібен трансфер)" },
  { id: "welcome", label: "Welcome-зона" },
  { id: "photozone", label: "Фотозона" },
  { id: "first_dance", label: "Постановка першого танцю" },
  { id: "decorator", label: "Декоратор" },
  { id: "cake", label: "Весільний торт" },
  { id: "candy_bar", label: "Кенді-бар" },
  { id: "cossack_table", label: "Козацький стіл" },
];

export const SMART_DONE_GROUPS: SmartDoneGroup[] = [
  {
    id: "location",
    title: "Локація та дата",
    items: [
      { id: "date_chosen", label: "Обрали дату весілля" },
      { id: "ceremony_venue", label: "Забронювали локацію для церемонії" },
      { id: "banquet_venue", label: "Забронювали локацію для банкету" },
      { id: "outdoor_done", label: "Організували виїзну церемонію" },
    ],
  },
  {
    id: "vendors",
    title: "Підрядники",
    items: [
      { id: "coordinator_chosen", label: "Обрали координатора" },
      { id: "photographer", label: "Забронювали фотографа" },
      { id: "videographer", label: "Забронювали відеографа" },
      { id: "music", label: "Обрали музикантів / DJ" },
      { id: "decorator_found", label: "Знайшли декоратора" },
      { id: "host_found", label: "Знайшли ведучого" },
    ],
  },
  {
    id: "guests",
    title: "Гості",
    items: [
      { id: "guest_list", label: "Склали список гостей" },
      { id: "invitations_sent", label: "Розіслали запрошення" },
      { id: "rsvp", label: "Збираємо RSVP відповіді" },
    ],
  },
  {
    id: "look",
    title: "Образ",
    items: [
      { id: "dress", label: "Обрали весільну сукню" },
      { id: "suit", label: "Обрали костюм нареченого" },
      { id: "makeup", label: "Обрали візажиста" },
      { id: "rings", label: "Купили обручки" },
    ],
  },
  {
    id: "details",
    title: "Деталі",
    items: [
      { id: "cake_ordered", label: "Замовили весільний торт" },
      { id: "transport", label: "Організували транспорт" },
    ],
  },
];

export const SMART_PLAN_CATEGORIES: SmartPlanCategory[] = [
  { id: "ceremony", title: "Церемонія" },
  { id: "coordination", title: "Координація" },
  { id: "banquet", title: "Банкет та розваги" },
  { id: "look", title: "Образ" },
  { id: "guests", title: "Гості" },
  { id: "photo", title: "Фото та відео" },
  { id: "style", title: "Стиль та декор" },
];

/** Повний каталог задач персонального плану. */
export const SMART_PLAN_CATALOG: SmartPlanTask[] = [
  // Церемонія
  {
    id: "ceremony-racs",
    title: "Знайти та забронювати РАЦС",
    categorySlug: "officiant",
    categoryId: "ceremony",
    daysBefore: 60,
    requires: ["racs"],
  },
  {
    id: "ceremony-church",
    title: "Організувати вінчання в церкві",
    categorySlug: "officiant",
    categoryId: "ceremony",
    daysBefore: 60,
    requires: ["church"],
  },
  {
    id: "ceremony-outdoor-place",
    title: "Обрати місце для виїзної церемонії",
    categorySlug: "venue",
    categoryId: "ceremony",
    daysBefore: 60,
    requires: ["outdoor"],
    excludeIfDone: ["outdoor_done", "ceremony_venue"],
  },
  {
    id: "ceremony-script",
    title: "Узгодити сценарій церемонії",
    categorySlug: "requests",
    categoryId: "ceremony",
    daysBefore: 14,
    requiresAny: ["outdoor", "racs", "church"],
  },
  {
    id: "ceremony-arch",
    title: "Замовити арку / декор церемонії",
    categorySlug: "decor",
    categoryId: "ceremony",
    daysBefore: 30,
    requires: ["outdoor"],
    excludeIfDone: ["outdoor_done"],
  },

  // Координація
  {
    id: "coord-hire",
    title: "Найняти весільного координатора",
    categorySlug: "planner",
    categoryId: "coordination",
    daysBefore: 60,
    requires: ["coordinator"],
    excludeIfDone: ["coordinator_chosen"],
  },
  {
    id: "coord-transport-couple",
    title: "Замовити транспорт для молодят",
    categorySlug: "requests",
    categoryId: "coordination",
    daysBefore: 30,
    excludeIfDone: ["transport"],
  },
  {
    id: "coord-transport-guests",
    title: "Замовити транспорт для гостей",
    categorySlug: "guests",
    categoryId: "coordination",
    daysBefore: 30,
    requires: ["remote_guests"],
    excludeIfDone: ["transport"],
  },
  {
    id: "coord-timeline",
    title: "Скласти тайм-лайн дня весілля",
    categorySlug: "requests",
    categoryId: "coordination",
    daysBefore: 14,
  },

  // Банкет
  {
    id: "banquet-venue",
    title: "Забронювати локацію для банкету",
    categorySlug: "venue",
    categoryId: "banquet",
    daysBefore: 60,
    excludeIfDone: ["banquet_venue"],
  },
  {
    id: "banquet-host",
    title: "Обрати та забронювати ведучого",
    categorySlug: "officiant",
    categoryId: "banquet",
    daysBefore: 45,
    excludeIfDone: ["host_found"],
  },
  {
    id: "banquet-music",
    title: "Забронювати музикантів / DJ",
    categorySlug: "music",
    categoryId: "banquet",
    daysBefore: 45,
    excludeIfDone: ["music"],
  },
  {
    id: "banquet-dance",
    title: "Знайти хореографа для першого танцю",
    categorySlug: "requests",
    categoryId: "banquet",
    daysBefore: 45,
    requires: ["first_dance"],
  },
  {
    id: "banquet-photozone",
    title: "Організувати фотозону",
    categorySlug: "decor",
    categoryId: "banquet",
    daysBefore: 21,
    requires: ["photozone"],
  },
  {
    id: "banquet-program",
    title: "Скласти програму вечора",
    categorySlug: "requests",
    categoryId: "banquet",
    daysBefore: 14,
  },
  {
    id: "banquet-cossack",
    title: "Організувати козацький стіл",
    categorySlug: "catering",
    categoryId: "banquet",
    daysBefore: 21,
    requires: ["cossack_table"],
  },

  // Образ
  {
    id: "look-dress",
    title: "Обрати весільну сукню",
    categorySlug: "attire",
    categoryId: "look",
    daysBefore: 60,
    excludeIfDone: ["dress"],
  },
  {
    id: "look-suit",
    title: "Обрати костюм нареченого",
    categorySlug: "attire",
    categoryId: "look",
    daysBefore: 45,
    excludeIfDone: ["suit"],
  },
  {
    id: "look-makeup",
    title: "Забронювати стиліста / візажиста",
    categorySlug: "beauty",
    categoryId: "look",
    daysBefore: 30,
    excludeIfDone: ["makeup"],
  },
  {
    id: "look-rings",
    title: "Замовити обручки",
    categorySlug: "attire",
    categoryId: "look",
    daysBefore: 30,
    excludeIfDone: ["rings"],
  },
  {
    id: "look-fitting",
    title: "Організувати фінальну примірку",
    categorySlug: "attire",
    categoryId: "look",
    daysBefore: 7,
  },

  // Гості
  {
    id: "guests-list",
    title: "Скласти список гостей",
    categorySlug: "guests",
    categoryId: "guests",
    daysBefore: 60,
    excludeIfDone: ["guest_list"],
  },
  {
    id: "guests-transfer",
    title: "Організувати трансфер для гостей здалеку",
    categorySlug: "guests",
    categoryId: "guests",
    daysBefore: 21,
    requires: ["remote_guests"],
    excludeIfDone: ["transport"],
  },
  {
    id: "guests-welcome",
    title: "Підготувати welcome-зону",
    categorySlug: "guests",
    categoryId: "guests",
    daysBefore: 14,
    requires: ["welcome"],
  },
  {
    id: "guests-kids",
    title: "Організувати дитячий куточок",
    categorySlug: "guests",
    categoryId: "guests",
    daysBefore: 21,
  },
  {
    id: "guests-invites",
    title: "Замовити друк запрошень",
    categorySlug: "invitations",
    categoryId: "style",
    daysBefore: 45,
    excludeIfDone: ["invitations_sent"],
  },
  {
    id: "guests-rsvp",
    title: "Зібрати RSVP відповіді",
    categorySlug: "rsvp",
    categoryId: "guests",
    daysBefore: 21,
    excludeIfDone: ["rsvp"],
  },

  // Фото
  {
    id: "photo-photographer",
    title: "Забронювати фотографа",
    categorySlug: "photo",
    categoryId: "photo",
    daysBefore: 60,
    excludeIfDone: ["photographer"],
  },
  {
    id: "photo-videographer",
    title: "Забронювати відеографа",
    categorySlug: "photo",
    categoryId: "photo",
    daysBefore: 60,
    excludeIfDone: ["videographer"],
  },
  {
    id: "photo-shots",
    title: "Обговорити список обов’язкових кадрів",
    categorySlug: "photo",
    categoryId: "photo",
    daysBefore: 14,
  },
  {
    id: "photo-pre",
    title: "Організувати pre-wedding зйомку",
    categorySlug: "photo",
    categoryId: "photo",
    daysBefore: 30,
  },
  {
    id: "photo-locations",
    title: "Узгодити локації для фотосесії",
    categorySlug: "photo",
    categoryId: "photo",
    daysBefore: 21,
  },

  // Стиль
  {
    id: "style-decorator",
    title: "Обрати та забронювати декоратора",
    categorySlug: "decor",
    categoryId: "style",
    daysBefore: 45,
    requires: ["decorator"],
    excludeIfDone: ["decorator_found"],
  },
  {
    id: "style-florist",
    title: "Обрати флориста",
    categorySlug: "decor",
    categoryId: "style",
    daysBefore: 30,
    requiresAny: ["decorator", "outdoor"],
  },
  {
    id: "style-cake",
    title: "Замовити весільний торт",
    categorySlug: "cake",
    categoryId: "style",
    daysBefore: 30,
    requires: ["cake"],
    excludeIfDone: ["cake_ordered"],
  },
  {
    id: "style-candy",
    title: "Організувати кенді-бар",
    categorySlug: "cake",
    categoryId: "style",
    daysBefore: 21,
    requires: ["candy_bar"],
  },
];

/** Дедлайн відносно дати весілля. Без дати — null. */
export function dueDateBeforeWedding(
  weddingDateIso: string | null | undefined,
  daysBefore: number,
): string | null {
  const iso = weddingDateIso?.trim().slice(0, 10);
  if (!iso) return null;
  const wedding = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(wedding.getTime())) return null;
  const due = new Date(wedding);
  due.setDate(due.getDate() - Math.max(0, daysBefore));
  return due.toISOString().slice(0, 10);
}

export function smartPlanDueDate(
  weddingDateIso: string | null | undefined,
  task: Pick<SmartPlanTask, "daysBefore" | "title">,
): string | null {
  return dueDateBeforeWedding(weddingDateIso, task.daysBefore);
}

/** Стартові задачі API — ті самі офсети, що й для бекфілу на клієнті. */
export const STARTER_TASK_DEADLINES: Array<{
  title: string;
  categorySlug: string;
  daysBefore: number;
}> = [
  {
    title: "Побудувати список завдань",
    categorySlug: "starter-plan",
    daysBefore: 60,
  },
  {
    title: "Додати гостей",
    categorySlug: "starter-guests",
    daysBefore: 45,
  },
  {
    title: "Внести витрати",
    categorySlug: "starter-budget",
    daysBefore: 30,
  },
];

export function defaultTaskDaysBefore(
  title: string,
  categorySlug?: string | null,
): number | null {
  const bySlug = STARTER_TASK_DEADLINES.find(
    (t) => categorySlug && t.categorySlug === categorySlug,
  );
  if (bySlug) return bySlug.daysBefore;
  const byTitle = SMART_PLAN_CATALOG.find((t) => t.title === title);
  if (byTitle) return byTitle.daysBefore;
  const starterByTitle = STARTER_TASK_DEADLINES.find((t) => t.title === title);
  return starterByTitle?.daysBefore ?? null;
}

function featureOk(
  task: SmartPlanTask,
  features: Set<SmartFeatureId>,
): boolean {
  if (task.requires?.length) {
    return task.requires.every((id) => features.has(id));
  }
  if (task.requiresAny?.length) {
    return task.requiresAny.some((id) => features.has(id));
  }
  return true;
}

function doneBlocks(task: SmartPlanTask, done: Set<SmartDoneId>): boolean {
  if (!task.excludeIfDone?.length) return false;
  return task.excludeIfDone.some((id) => done.has(id));
}

export function buildSmartPlan(
  features: Iterable<SmartFeatureId>,
  done: Iterable<SmartDoneId>,
): Array<{
  categoryId: SmartPlanCategoryId;
  title: string;
  tasks: SmartPlanTask[];
}> {
  const featureSet = new Set(features);
  const doneSet = new Set(done);

  const filtered = SMART_PLAN_CATALOG.filter(
    (task) => featureOk(task, featureSet) && !doneBlocks(task, doneSet),
  );

  return SMART_PLAN_CATEGORIES.map((cat) => ({
    categoryId: cat.id,
    title: cat.title,
    tasks: filtered.filter((t) => t.categoryId === cat.id),
  })).filter((group) => group.tasks.length > 0);
}

export function smartBannerKey(weddingId: string) {
  return `fata-smart-plan-banner:${weddingId}`;
}

export function smartPlanDoneKey(weddingId: string) {
  return `fata-smart-plan-done:${weddingId}`;
}
