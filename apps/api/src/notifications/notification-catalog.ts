/**
 * Каталог типів сповіщень — єдине джерело правди (notifications-spec.md, розділи 4 і 9).
 * Тут: типи, категорії, налаштування за замовчуванням, тексти, іконки, CTA.
 * Чисті функції без доступу до БД.
 */

export const NOTIFICATION_TYPES = [
  // partner
  'partner_guests_added',
  'partner_guests_removed',
  'partner_tasks_added',
  'partner_tasks_done',
  'partner_vendor_booked',
  'partner_vendor_added',
  'partner_expenses_added',
  'partner_seating_updated',
  'partner_site_published',
  'partner_dayplan_updated',
  'partner_inspo_added',
  // tasks
  'task_assigned',
  'deadline_early',
  'deadline_late',
  'deadline_today',
  'task_overdue',
  'deadline_digest',
  'urgent_digest',
  // guests / invitation / day plan
  'guests_no_response',
  'guests_no_response_deadline',
  'seating_unassigned',
  'invitation_unpublished',
  'dayplan_share',
  'dayplan_tomorrow',
  // milestones / tips
  'countdown',
  'countdown_tomorrow',
  'progress',
  'setup_date',
  'setup_partner',
  'setup_smart_planning',
  'setup_smart_planning_date',
  'post_wedding_feedback',
  // system
  'partner_joined',
  'partner_invite_declined',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationCategory =
  | 'tasks'
  | 'guests'
  | 'partnerActivity'
  | 'invitationAndDayPlan'
  | 'milestones'
  | 'tips'
  | 'system';

export const CATEGORY_BY_TYPE: Record<NotificationType, NotificationCategory> = {
  partner_guests_added: 'partnerActivity',
  partner_guests_removed: 'partnerActivity',
  partner_tasks_added: 'partnerActivity',
  partner_tasks_done: 'partnerActivity',
  partner_vendor_booked: 'partnerActivity',
  partner_vendor_added: 'partnerActivity',
  partner_expenses_added: 'partnerActivity',
  partner_seating_updated: 'partnerActivity',
  partner_site_published: 'partnerActivity',
  partner_dayplan_updated: 'partnerActivity',
  partner_inspo_added: 'partnerActivity',
  task_assigned: 'tasks',
  deadline_early: 'tasks',
  deadline_late: 'tasks',
  deadline_today: 'tasks',
  task_overdue: 'tasks',
  deadline_digest: 'tasks',
  urgent_digest: 'tasks',
  guests_no_response: 'guests',
  guests_no_response_deadline: 'guests',
  seating_unassigned: 'guests',
  invitation_unpublished: 'invitationAndDayPlan',
  dayplan_share: 'invitationAndDayPlan',
  dayplan_tomorrow: 'invitationAndDayPlan',
  countdown: 'milestones',
  countdown_tomorrow: 'milestones',
  progress: 'milestones',
  setup_date: 'tips',
  setup_partner: 'tips',
  setup_smart_planning: 'tips',
  setup_smart_planning_date: 'tips',
  post_wedding_feedback: 'tips',
  partner_joined: 'system',
  partner_invite_declined: 'system',
};

/** Нагадування (щоденна задача) — на них діє ліміт 3/день. */
export const REMINDER_TYPES: ReadonlySet<NotificationType> = new Set([
  'deadline_early',
  'deadline_late',
  'deadline_today',
  'task_overdue',
  'urgent_digest',
  'guests_no_response',
  'guests_no_response_deadline',
  'seating_unassigned',
  'invitation_unpublished',
  'dayplan_share',
  'dayplan_tomorrow',
  'countdown',
  'countdown_tomorrow',
  'progress',
  'setup_date',
  'setup_partner',
  'setup_smart_planning',
  'setup_smart_planning_date',
  'post_wedding_feedback',
]);

/** Нагадування про дедлайни, які замінюються одним `deadline_digest`, якщо їх > 3. */
export const DEADLINE_TYPES: ReadonlySet<NotificationType> = new Set([
  'deadline_early',
  'deadline_late',
  'deadline_today',
  'task_overdue',
]);

export type TaskFrequency = 'normal' | 'less';

export type NotificationSettings = {
  tasks: boolean;
  taskFrequency: TaskFrequency;
  guests: boolean;
  partnerActivity: boolean;
  invitationAndDayPlan: boolean;
  milestones: boolean;
  tips: boolean;
  channels: { push: boolean; email: boolean };
};

export const DEFAULT_SETTINGS: NotificationSettings = {
  tasks: true,
  taskFrequency: 'normal',
  guests: true,
  partnerActivity: true,
  invitationAndDayPlan: true,
  milestones: true,
  tips: true,
  channels: { push: true, email: true },
};

export function isTypeEnabled(
  settings: NotificationSettings,
  type: NotificationType,
): boolean {
  const category = CATEGORY_BY_TYPE[type];
  if (category === 'system') return true;
  return settings[category];
}

// ───────────────────────── Відмінювання

const pluralRules = new Intl.PluralRules('uk');

/** forms: [one, few, many] — 1 / 2–4 / 0, 5–20. */
export function pluralUk(n: number, forms: [string, string, string]): string {
  const rule = pluralRules.select(Math.abs(Math.trunc(n)));
  if (rule === 'one') return forms[0];
  if (rule === 'few') return forms[1];
  return forms[2];
}

export function countWord(n: number, forms: [string, string, string]) {
  return `${n} ${pluralUk(n, forms)}`;
}

export const WORDS = {
  guestGen: ['гостя', 'гостей', 'гостей'],
  guestNom: ['гість', 'гості', 'гостей'],
  task: ['завдання', 'завдання', 'завдань'],
  urgentTask: ['термінове завдання', 'термінові завдання', 'термінових завдань'],
  vendor: ['підрядника', 'підрядників', 'підрядників'],
  expense: ['витрату', 'витрати', 'витрат'],
  event: ['подію', 'події', 'подій'],
  photo: ['фото', 'фото', 'фото'],
  day: ['день', 'дні', 'днів'],
} satisfies Record<string, [string, string, string]>;

// ───────────────────────── Рід

export type Gender = 'female' | 'male' | null;

/** Дієслово минулого часу з урахуванням роду; без роду — «додав(ла)». */
export function verb(gender: Gender, masc: string, fem: string, neutral?: string) {
  if (gender === 'female') return fem;
  if (gender === 'male') return masc;
  return neutral ?? `${masc}(ла)`;
}

// ───────────────────────── Рендер

export type Segment = { text: string; bold?: boolean };

export type IconKind =
  | 'partner'
  | 'partner_muted'
  | 'deadline'
  | 'overdue'
  | 'digest'
  | 'guests'
  | 'seating'
  | 'site'
  | 'dayplan'
  | 'countdown'
  | 'progress'
  | 'tip'
  | 'setup';

export type NotificationAction = {
  label: string;
  variant: 'primary' | 'secondary';
  /** Перехід. */
  href?: string;
  /** Дія без переходу: позначити завдання виконаним. */
  action?: 'complete_task';
};

export type RenderedNotification = {
  segments: Segment[];
  icon: IconKind;
  /** Літера в колі для іконок партнера. */
  iconLetter?: string;
  /** Куди веде клік по картці (= головна CTA або єдина кнопка). */
  href: string;
  actions: NotificationAction[];
};

export type NotificationPayload = {
  actorId?: string;
  taskId?: string;
  taskTitle?: string;
  entityIds?: string[];
  amount?: number;
  days?: number;
  dueDate?: string;
  /** Текст nudge (з шаблону розумного планування). */
  nudge?: string;
  /** Індекс загального шаблону для ручних завдань. */
  variant?: number;
  vendorId?: string;
  vendorLabel?: string;
  threshold?: number;
  done?: number;
  total?: number;
  /** Для guests_no_response_deadline: 'seating' | 'guests_confirm'. */
  milestone?: string;
  siteUrl?: string;
  [k: string]: unknown;
};

export type RenderInput = {
  type: NotificationType;
  count: number;
  payload: NotificationPayload;
  actor?: { name: string; gender: Gender } | null;
};

const ROUTES = {
  dashboard: '/dashboard',
  guests: '/guests',
  guestsNoResponse: '/guests?status=no_response',
  tasks: '/checklist',
  tasksDone: '/checklist?status=done',
  tasksThisWeek: '/checklist?due=this_week',
  tasksUrgent: '/checklist?due=overdue,this_week',
  task: (id?: string) => (id ? `/checklist?edit=${encodeURIComponent(id)}` : '/checklist'),
  vendors: '/my-vendors',
  vendor: (id?: string) => (id ? `/my-vendors?vendor=${encodeURIComponent(id)}` : '/my-vendors'),
  budget: '/budget',
  seating: '/seating',
  dayPlan: '/day-plan',
  dayPlanShare: '/day-plan?share=1',
  inspiration: '/inspiration',
  siteEditor: '/website/edit',
  site: '/website',
  smartPlanning: '/checklist?smart=1',
  profile: '/settings?tab=profile',
  profileDate: '/settings?tab=profile&focus=date',
  profilePartner: '/settings?tab=profile&focus=partner',
  feedback: '/feedback',
} as const;

const b = (text: string): Segment => ({ text, bold: true });
const t = (text: string): Segment => ({ text });

const UA_MONTHS_GEN = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
];

export function formatDayMonth(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getUTCDate()} ${UA_MONTHS_GEN[d.getUTCMonth()]}`;
}

export function formatUah(amount: number): string {
  const rounded = Math.round(amount);
  const grouped = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${rounded < 0 ? '−' : ''}${grouped} ₴`;
}

/** Загальні шаблони для ручних завдань (розділ 5.5). */
export const GENERIC_EARLY = [
  'Не забудьте: {title} — до {date}',
  'До дедлайну {title} {N}',
  'Як справи з {title}? Дедлайн {date}',
];
export const GENERIC_LATE = [
  'Залишилось {N}, щоб {title}',
  'Дедлайн {title} вже {date}',
];

function fillTemplate(
  template: string,
  vars: { title: string; days: number; date: string },
): Segment[] {
  const out: Segment[] = [];
  const parts = template.split(/(\{title\}|\{N\}|\{date\})/);
  for (const part of parts) {
    if (!part) continue;
    if (part === '{title}') out.push(b(`«${vars.title}»`));
    else if (part === '{N}') out.push(b(countWord(vars.days, WORDS.day)));
    else if (part === '{date}') out.push(t(vars.date));
    else out.push(t(part));
  }
  return out;
}

/** Детермінований вибір варіанту: hash(taskId + reminderNo) % n. */
export function pickVariant(seed: string, n: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % n;
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || 'Партнер';
}

const PROGRESS_TITLE: Record<number, string> = {
  25: 'Чверть плану виконана',
  50: 'Половина плану виконана',
  75: 'Три чверті плану виконано',
  100: 'Увесь план виконано!',
};

export function renderNotification(input: RenderInput): RenderedNotification {
  const { type, payload } = input;
  const n = Math.max(1, input.count || 1);
  const actorName = firstName(input.actor?.name ?? '');
  const g = input.actor?.gender ?? null;
  const letter = actorName.charAt(0).toUpperCase();
  const partner = (segments: Segment[], action: NotificationAction): RenderedNotification => ({
    segments: [b(actorName), ...segments],
    icon: 'partner',
    iconLetter: letter,
    href: action.href ?? ROUTES.dashboard,
    actions: [action],
  });
  const view = (href: string, label = 'Переглянути'): NotificationAction => ({
    label,
    variant: 'secondary',
    href,
  });
  const goTask: NotificationAction = {
    label: 'Перейти до завдання',
    variant: 'primary',
    href: ROUTES.task(payload.taskId),
  };
  const days = payload.days ?? 0;
  const title = payload.taskTitle ?? 'завдання';

  switch (type) {
    // ── Дії партнера
    case 'partner_guests_added':
      return partner(
        [t(` ${verb(g, 'додав', 'додала')} `), b(countWord(n, WORDS.guestGen))],
        view(ROUTES.guests),
      );
    case 'partner_guests_removed':
      return partner(
        [t(` ${verb(g, 'видалив', 'видалила')} `), b(countWord(n, WORDS.guestGen))],
        view(ROUTES.guests, 'Переглянути гостей'),
      );
    case 'partner_tasks_added':
      return partner(
        [t(` ${verb(g, 'додав', 'додала')} `), b(countWord(n, WORDS.task))],
        view(ROUTES.tasks),
      );
    case 'partner_tasks_done':
      return partner(
        [t(` ${verb(g, 'виконав', 'виконала')} `), b(countWord(n, WORDS.task))],
        view(ROUTES.tasksDone),
      );
    case 'partner_vendor_booked': {
      const booked = verb(g, 'забронював', 'забронювала');
      if (n > 1) {
        return partner(
          [t(` ${booked} `), b(countWord(n, WORDS.vendor))],
          view(ROUTES.vendors),
        );
      }
      return partner(
        [t(` ${booked} ${payload.vendorLabel || 'підрядника'}`)],
        view(ROUTES.vendor(payload.vendorId), 'Перейти до підрядника'),
      );
    }
    case 'partner_vendor_added':
      return partner(
        [t(` ${verb(g, 'додав', 'додала')} `), b(countWord(n, WORDS.vendor))],
        view(ROUTES.vendors),
      );
    case 'partner_expenses_added':
      return partner(
        [
          t(` ${verb(g, 'додав', 'додала')} ${countWord(n, WORDS.expense)} на `),
          b(formatUah(payload.amount ?? 0)),
        ],
        view(ROUTES.budget, 'Перейти до бюджету'),
      );
    case 'partner_seating_updated':
      return partner(
        [t(` ${verb(g, 'оновив', 'оновила')} розсадку`)],
        view(ROUTES.seating, 'Відкрити розсадку'),
      );
    case 'partner_site_published':
      return partner(
        [t(` ${verb(g, 'опублікував', 'опублікувала')} сайт-запрошення`)],
        view(payload.siteUrl || ROUTES.site, 'Переглянути сайт'),
      );
    case 'partner_dayplan_updated':
      return partner(
        [t(` ${verb(g, 'додав', 'додала')} `), b(countWord(n, WORDS.event)), t(' в план дня')],
        view(ROUTES.dayPlan, 'Відкрити план дня'),
      );
    case 'partner_inspo_added':
      return partner(
        [t(` ${verb(g, 'додав', 'додала')} `), b(countWord(n, WORDS.photo)), t(' на дошку натхнення')],
        view(ROUTES.inspiration),
      );

    // ── Завдання
    case 'task_assigned':
      return {
        segments: [
          b(actorName),
          t(` ${verb(g, 'призначив', 'призначила')} вам завдання `),
          b(`«${title}»`),
        ],
        icon: 'partner',
        iconLetter: letter,
        href: goTask.href!,
        actions: [goTask],
      };
    case 'deadline_early': {
      const segments = payload.nudge
        ? [t(`${payload.nudge} До дедлайну `), b(countWord(days, WORDS.day)), t('.')]
        : fillTemplate(GENERIC_EARLY[(payload.variant ?? 0) % GENERIC_EARLY.length], {
            title,
            days,
            date: formatDayMonth(payload.dueDate),
          });
      return {
        segments,
        icon: 'deadline',
        href: goTask.href!,
        actions: [goTask, { label: 'Вже зроблено', variant: 'secondary', action: 'complete_task' }],
      };
    }
    case 'deadline_late': {
      const segments = payload.nudge
        ? [t(`${payload.nudge} — дедлайн `), b(`за ${countWord(days, WORDS.day)}`)]
        : fillTemplate(GENERIC_LATE[(payload.variant ?? 0) % GENERIC_LATE.length], {
            title,
            days,
            date: formatDayMonth(payload.dueDate),
          });
      return {
        segments,
        icon: 'deadline',
        href: goTask.href!,
        actions: [goTask, { label: 'Вже зроблено', variant: 'secondary', action: 'complete_task' }],
      };
    }
    case 'deadline_today':
      return {
        segments: [t('Сьогодні дедлайн: '), b(`«${title}»`)],
        icon: 'deadline',
        href: goTask.href!,
        actions: [goTask, { label: 'Вже зроблено', variant: 'secondary', action: 'complete_task' }],
      };
    case 'task_overdue': {
      const ago = days <= 1 ? 'учора' : `${countWord(days, WORDS.day)} тому`;
      return {
        segments: [t('Дедлайн '), b(`«${title}»`), t(` минув ${ago}. Вже зробили?`)],
        icon: 'overdue',
        href: goTask.href!,
        actions: [
          goTask,
          { label: 'Позначити виконаним', variant: 'secondary', action: 'complete_task' },
        ],
      };
    }
    case 'deadline_digest':
      return {
        segments: [t('Цього тижня дедлайн у '), b(countWord(n, WORDS.task))],
        icon: 'digest',
        href: ROUTES.tasksThisWeek,
        actions: [{ label: 'Переглянути завдання', variant: 'primary', href: ROUTES.tasksThisWeek }],
      };
    case 'urgent_digest':
      return {
        segments: [
          t('У вашому плані '),
          b(countWord(n, WORDS.urgentTask)),
          t('. Почніть з найважливіших'),
        ],
        icon: 'overdue',
        href: ROUTES.tasksUrgent,
        actions: [{ label: 'Переглянути завдання', variant: 'primary', href: ROUTES.tasksUrgent }],
      };

    // ── Гості · Сайт · План дня
    case 'guests_no_response': {
      const segments =
        pluralUk(n, ['one', 'few', 'many']) === 'one'
          ? [b(countWord(n, WORDS.guestNom)), t(' ще не повідомив, чи прийде')]
          : [b(countWord(n, WORDS.guestNom)), t(' ще не повідомили, чи прийдуть')];
      return {
        segments,
        icon: 'guests',
        href: ROUTES.guestsNoResponse,
        actions: [{ label: 'Переглянути гостей', variant: 'primary', href: ROUTES.guestsNoResponse }],
      };
    }
    case 'guests_no_response_deadline': {
      const what =
        payload.milestone === 'guests_confirm'
          ? 'Через 3 дні дедлайн «Дізнатися, хто з гостей точно прийде», а '
          : 'Через 3 дні час складати розсадку, а ';
      const one = pluralUk(n, ['one', 'few', 'many']) === 'one';
      return {
        segments: [
          t(what),
          b(countWord(n, WORDS.guestNom)),
          t(one ? ' ще не відповів' : ' ще не відповіли'),
        ],
        icon: 'guests',
        href: ROUTES.guestsNoResponse,
        actions: [{ label: 'Переглянути гостей', variant: 'primary', href: ROUTES.guestsNoResponse }],
      };
    }
    case 'seating_unassigned': {
      const one = pluralUk(n, ['one', 'few', 'many']) === 'one';
      return {
        segments: [
          b(countWord(n, WORDS.guestNom)),
          t(
            one
              ? ', який підтвердив участь, ще не має місця'
              : ', які підтвердили участь, ще не мають місця',
          ),
        ],
        icon: 'seating',
        href: ROUTES.seating,
        actions: [{ label: 'Відкрити розсадку', variant: 'primary', href: ROUTES.seating }],
      };
    }
    case 'invitation_unpublished':
      return {
        segments: [
          t('Ваш сайт-запрошення ще не опубліковано, а розсилка — '),
          b(`за ${countWord(days, WORDS.day)}`),
        ],
        icon: 'site',
        href: ROUTES.siteEditor,
        actions: [{ label: 'Відкрити редактор', variant: 'primary', href: ROUTES.siteEditor }],
      };
    case 'dayplan_share':
      return {
        segments: [b('Тиждень до весілля!'), t(' Поділіться планом дня з підрядниками')],
        icon: 'dayplan',
        href: ROUTES.dayPlanShare,
        actions: [{ label: 'Поділитися планом', variant: 'primary', href: ROUTES.dayPlanShare }],
      };
    case 'dayplan_tomorrow':
      return {
        segments: [b('Завтра ваш день.'), t(' Ось план, щоб нічого не забути')],
        icon: 'dayplan',
        href: ROUTES.dayPlan,
        actions: [{ label: 'Відкрити план дня', variant: 'primary', href: ROUTES.dayPlan }],
      };

    // ── Відлік · Прогрес · Підказки
    case 'countdown':
      return {
        segments: [t('До весілля '), b(`${countWord(days, WORDS.day)}!`)],
        icon: 'countdown',
        href: ROUTES.dashboard,
        actions: [],
      };
    case 'countdown_tomorrow':
      return {
        segments: [b('Завтра ваше весілля!'), t(' Ми вами пишаємося')],
        icon: 'countdown',
        href: ROUTES.dashboard,
        actions: [],
      };
    case 'progress': {
      const threshold = payload.threshold ?? 50;
      return {
        segments: [
          b(PROGRESS_TITLE[threshold] ?? `Виконано ${threshold}% плану`),
          t(` — ${payload.done ?? 0} з ${countWord(payload.total ?? 0, WORDS.task)}`),
        ],
        icon: 'progress',
        href: ROUTES.tasks,
        actions: [view(ROUTES.tasks, 'Переглянути завдання')],
      };
    }
    case 'setup_date':
      return {
        segments: [t('Вкажіть дату весілля, щоб ми розставили дедлайни')],
        icon: 'setup',
        href: ROUTES.profileDate,
        actions: [{ label: 'Вказати дату', variant: 'primary', href: ROUTES.profileDate }],
      };
    case 'setup_partner':
      return {
        segments: [t('Запросіть партнера, щоб планувати разом')],
        icon: 'setup',
        href: ROUTES.profilePartner,
        actions: [{ label: 'Запросити', variant: 'primary', href: ROUTES.profilePartner }],
      };
    case 'setup_smart_planning':
      return {
        segments: [
          t('Зараз у вас загальний список. Складіть персональний план під ваше весілля — це 2 хвилини'),
        ],
        icon: 'tip',
        href: ROUTES.smartPlanning,
        actions: [{ label: 'Скласти план', variant: 'primary', href: ROUTES.smartPlanning }],
      };
    case 'setup_smart_planning_date':
      return {
        segments: [t('Тепер, коли є дата, можемо розставити дедлайни під ваше весілля')],
        icon: 'tip',
        href: ROUTES.smartPlanning,
        actions: [{ label: 'Скласти план', variant: 'primary', href: ROUTES.smartPlanning }],
      };
    case 'post_wedding_feedback':
      return {
        segments: [b('Вітаємо з весіллям!'), t(' Розкажіть, як вам було з fata.studio')],
        icon: 'tip',
        href: ROUTES.feedback,
        actions: [{ label: 'Залишити відгук', variant: 'primary', href: ROUTES.feedback }],
      };

    // ── Системні
    case 'partner_joined':
      return {
        segments: [
          b(actorName),
          t(` ${verb(g, 'приєднався', 'приєдналася', 'приєднався(лася)')} до планування`),
        ],
        icon: 'partner',
        iconLetter: letter,
        href: ROUTES.dashboard,
        actions: [],
      };
    case 'partner_invite_declined':
      return {
        segments: [
          b(actorName),
          t(` ${verb(g, 'відхилив', 'відхилила')} запрошення до спільного доступу`),
        ],
        icon: 'partner_muted',
        iconLetter: letter,
        href: ROUTES.profilePartner,
        actions: [{ label: 'Надіслати ще раз', variant: 'primary', href: ROUTES.profilePartner }],
      };
  }
}

/** Текст без розмітки — для push / email. */
export function plainText(segments: Segment[]): string {
  return segments.map((s) => s.text).join('');
}

/** Знахідний відмінок категорій підрядників (vendor-manager.ts на вебі). */
export const VENDOR_CATEGORY_ACC: Record<string, string> = {
  venue: 'локацію',
  host: 'ведучого',
  photo: 'фотографа',
  video: 'відеографа',
  band: 'музикантів',
  dj: 'DJ',
  planner: 'організатора',
  decor: 'декоратора',
  florist: 'флориста',
  hair: 'стиліста зачіски',
  makeup: 'візажиста',
  attire: 'весільний салон',
  catering: 'кейтеринг',
  'ceremony-venue': 'локацію для церемонії',
  officiant: 'церемоніймейстера',
  transport: 'транспорт',
  choreographer: 'хореографа',
  cake: 'весільний торт',
  pastry: 'пекаря',
  candybar: 'кенді-бар',
  hotel: 'проживання для гостей',
};
