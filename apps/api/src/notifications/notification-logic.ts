/**
 * Чиста логіка сповіщень (notifications-spec.md, розділи 2, 5–7).
 * Без БД і без Nest — легко тестується (notification-logic.spec.ts).
 *
 * Дні — рядки 'YYYY-MM-DD'. «Сьогодні» рахуємо за Києвом; дедлайни й дата
 * весілля зберігаються як опівніч UTC, тож беремо їхню UTC-дату.
 */
import {
  CATEGORY_BY_TYPE,
  DEADLINE_TYPES,
  type NotificationType,
  type TaskFrequency,
} from './notification-catalog';
import { SMART_PLAN_NUDGES } from './smart-plan-nudges';

export const KYIV_TZ = 'Europe/Kyiv';
export const DAILY_HOUR_KYIV = 10;
export const DAILY_REMINDER_LIMIT = 3;
export const GROUP_WINDOW_MS = 24 * 60 * 60 * 1000;
export const HISTORY_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

// ───────────────────────── Дати

export function kyivDay(now: Date): string {
  // en-CA → YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: KYIV_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function kyivHour(now: Date): number {
  const h = new Intl.DateTimeFormat('en-GB', {
    timeZone: KYIV_TZ,
    hour: '2-digit',
    hour12: false,
  }).format(now);
  return Number(h) % 24;
}

export function utcDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Скільки днів від `from` до `to` (to − from). */
export function daysBetween(from: string, to: string): number {
  return Math.round(
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS,
  );
}

export function addDays(day: string, n: number): string {
  return utcDay(new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY_MS));
}

// ───────────────────────── Групування (розділ 2.2)

export type GroupCandidate = {
  readAt: Date | null;
  resolvedAt: Date | null;
  createdAt: Date;
};

/** Чи можна дописати дію в існуюче сповіщення замість створення нового. */
export function canMergeInto(existing: GroupCandidate | null, now: Date): boolean {
  if (!existing) return false;
  if (existing.readAt || existing.resolvedAt) return false;
  return now.getTime() - existing.createdAt.getTime() <= GROUP_WINDOW_MS;
}

export function mergeEntityIds(prev: unknown, next: string[] | undefined, cap = 200) {
  const out = Array.isArray(prev) ? prev.filter((v): v is string => typeof v === 'string') : [];
  for (const id of next ?? []) if (!out.includes(id)) out.push(id);
  return out.slice(-cap);
}

// ───────────────────────── Кому (розділ 2.6)

export type Members = { ownerId: string; partnerId: string | null };

/** Повертає отримувачів нагадувань про завдання + чи це «Не наші». */
export function taskRecipients(
  assigneeRaw: string | null,
  members: Members,
): { recipients: string[]; isOther: boolean } {
  const all = [members.ownerId, ...(members.partnerId ? [members.partnerId] : [])];
  if (assigneeRaw === 'owner') return { recipients: [members.ownerId], isOther: false };
  if (assigneeRaw === 'partner') {
    // Партнер ще не приєднався — нагадуємо власнику, щоб завдання не загубилось.
    return { recipients: [members.partnerId ?? members.ownerId], isOther: false };
  }
  if (assigneeRaw && (assigneeRaw === 'other' || assigneeRaw.startsWith('other:'))) {
    return { recipients: all, isOther: true };
  }
  return { recipients: all, isOther: false };
}

/** Хто з учасників є виконавцем (для task_assigned). */
export function assigneeUserId(assigneeRaw: string | null, members: Members): string | null {
  if (assigneeRaw === 'owner') return members.ownerId;
  if (assigneeRaw === 'partner') return members.partnerId;
  return null;
}

// ───────────────────────── Рівні дедлайнів (розділ 5.1)

export type ReminderLevel = 'long' | 'mid' | 'short';

export const LEVELS: Record<ReminderLevel, { early: number; late: number }> = {
  long: { early: 14, late: 3 },
  mid: { early: 7, late: 2 },
  short: { early: 3, late: 0 },
};

export type ReminderTask = {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDay: string | null;
  createdAt: Date;
  templateId: string | null;
  source: string | null;
  isUrgent: boolean;
  assignee: string | null;
};

export function reminderLevel(task: ReminderTask): ReminderLevel {
  const tpl = task.templateId ? SMART_PLAN_NUDGES[task.templateId] : undefined;
  if (task.source === 'smart_planning' && tpl) {
    if (tpl.dueDays >= 180) return 'long';
    if (tpl.dueDays >= 60) return 'mid';
    return 'short';
  }
  if (!task.dueDay) return 'short';
  const gap = daysBetween(utcDay(task.createdAt), task.dueDay);
  if (gap > 60) return 'long';
  if (gap >= 14) return 'mid';
  return 'short';
}

export type PlannedReminder = {
  type: Extract<
    NotificationType,
    'deadline_early' | 'deadline_late' | 'deadline_today' | 'task_overdue'
  >;
  dedupKey: string;
  reminderNo: number;
  days: number;
};

export type ReminderHistory = {
  /** Чи надсилали (або придушували) вже цей ключ цьому отримувачу. */
  sent: (dedupKey: string) => boolean;
  /** Скільки разів і коли востаннє надсилали прострочку для цього дедлайну. */
  overdue: { count: number; lastDay: string | null };
};

export const OVERDUE_MAX = 3;
export const OVERDUE_REPEAT_DAYS = 7;
export const MIN_TASK_AGE_MS = 48 * 60 * 60 * 1000;

export function taskKeyBase(task: Pick<ReminderTask, 'id' | 'dueDay'>) {
  return `task:${task.id}:${task.dueDay}`;
}

/**
 * Яке нагадування про завдання треба надіслати сьогодні цьому отримувачу (або null).
 * Розділи 2.6, 5.1–5.4.
 */
export function planTaskReminder(
  task: ReminderTask,
  opts: {
    today: string;
    now: Date;
    frequency: TaskFrequency;
    isOther: boolean;
    history: ReminderHistory;
  },
): PlannedReminder | null {
  const { today, now, frequency, isOther, history } = opts;
  if (task.status === 'DONE' || !task.dueDay) return null;
  if (now.getTime() - task.createdAt.getTime() < MIN_TASK_AGE_MS) return null;

  const base = taskKeyBase(task);
  const r1 = `${base}:r1`;
  const r2 = `${base}:r2`;
  const daysLeft = daysBetween(today, task.dueDay);

  // «Не наші» — рівно одне нагадування, без повторів прострочки.
  if (isOther && (history.sent(r1) || history.sent(r2))) return null;

  if (daysLeft < 0) {
    if (isOther) return null;
    const max = frequency === 'less' ? 1 : OVERDUE_MAX;
    const { count, lastDay } = history.overdue;
    if (count >= max) return null;
    if (lastDay && daysBetween(lastDay, today) < OVERDUE_REPEAT_DAYS) return null;
    return {
      type: 'task_overdue',
      dedupKey: `${base}:overdue:${count + 1}`,
      reminderNo: count + 1,
      days: -daysLeft,
    };
  }

  // Термінові з розумного планування — тільки через urgent_digest.
  if (task.isUrgent) return null;

  const level = LEVELS[reminderLevel(task)];
  // «Рідше» — лише друге нагадування. «Не наші» отримують друге, тільки якщо
  // перше не встигло (вище вже відсічено випадок, коли щось надсилали).
  const wantFirst = frequency === 'normal';

  if (daysLeft <= level.late) {
    if (history.sent(r2)) return null;
    if (level.late === 0 && daysLeft !== 0) return null;
    return {
      type: daysLeft === 0 ? 'deadline_today' : 'deadline_late',
      dedupKey: r2,
      reminderNo: 2,
      days: daysLeft,
    };
  }

  if (daysLeft <= level.early) {
    if (!wantFirst || history.sent(r1) || history.sent(r2)) return null;
    return { type: 'deadline_early', dedupKey: r1, reminderNo: 1, days: daysLeft };
  }

  return null;
}

/** Текст nudge або індекс загального шаблону (розділ 5.5). */
export function nudgeFor(task: ReminderTask, reminderNo: number) {
  const tpl = task.templateId ? SMART_PLAN_NUDGES[task.templateId] : undefined;
  if (tpl) return { nudge: reminderNo === 1 ? tpl.early : tpl.late };
  const n = reminderNo === 1 ? 3 : 2;
  return { variant: pickVariantIndex(`${task.id}${reminderNo}`, n) };
}

function pickVariantIndex(seed: string, n: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % n;
}

// ───────────────────────── Ліміт 3/день (розділ 2.5)

const PRIORITY: Record<string, number> = {
  tasks: 0,
  guests: 1,
  invitationAndDayPlan: 2,
  milestones: 3,
  tips: 4,
  system: 5,
  partnerActivity: 6,
};

export type DailyCandidate = { type: NotificationType; dedupKey: string };

export type DailyPlan<T extends DailyCandidate> = {
  send: T[];
  /** Замінені зведенням — записуємо як «придушені», щоб не повторювались. */
  digested: T[];
  /** Кількість для deadline_digest (0 — зведення не потрібне). */
  digestCount: number;
  /** Не влізли в ліміт — спробуємо наступного дня. */
  deferred: T[];
};

/**
 * Застосовує ліміт до вже відфільтрованих за налаштуваннями нагадувань одного отримувача.
 * Якщо їх > limit — дедлайни згортаються в одне `deadline_digest`; якщо й далі
 * забагато — лишаються найважливіші, решта переноситься.
 */
export function applyDailyLimit<T extends DailyCandidate>(
  candidates: T[],
  limit = DAILY_REMINDER_LIMIT,
): DailyPlan<T> {
  if (candidates.length <= limit) {
    return { send: candidates, digested: [], digestCount: 0, deferred: [] };
  }
  const deadlines = candidates.filter((c) => DEADLINE_TYPES.has(c.type));
  const rest = candidates.filter((c) => !DEADLINE_TYPES.has(c.type));
  const useDigest = deadlines.length >= 2;
  const digestSlots = useDigest ? 1 : 0;
  const pool = useDigest ? rest : candidates;
  const sorted = [...pool].sort(
    (a, b) => PRIORITY[CATEGORY_BY_TYPE[a.type]] - PRIORITY[CATEGORY_BY_TYPE[b.type]],
  );
  const room = Math.max(0, limit - digestSlots);
  return {
    send: sorted.slice(0, room),
    digested: useDigest ? deadlines : [],
    digestCount: useDigest ? deadlines.length : 0,
    deferred: sorted.slice(room),
  };
}

// ───────────────────────── Гості без відповіді (розділ 6)

export type SentRecord = { day: string; count: number };

export function guestsNoResponseDue(input: {
  today: string;
  startDay: string | null;
  weddingDay: string;
  pending: number;
  history: SentRecord[]; // від найстарішого до найновішого
}): boolean {
  const { today, startDay, weddingDay, pending, history } = input;
  if (!startDay || pending <= 0) return false;
  const toWedding = daysBetween(today, weddingDay);
  if (toWedding <= 0) return false;
  if (history.length === 0) return daysBetween(startDay, today) >= 14;

  let interval = toWedding > 60 ? 14 : toWedding >= 30 ? 7 : 3;
  const last3 = history.slice(-3);
  if (last3.length === 3 && last3.every((h) => h.count === last3[0].count)) {
    interval *= 2;
  }
  return daysBetween(history[history.length - 1].day, today) >= interval;
}

// ───────────────────────── Підказки (розділ 7)

export type TipHistory = Array<{ type: NotificationType; day: string }>;

export const SMART_TIP_MAX = 3;

/** setup_smart_planning за розкладом (кроки 1 і 3). */
export function smartPlanningTipDue(input: {
  today: string;
  registeredDay: string;
  hasSmartPlan: boolean;
  history: TipHistory;
}): boolean {
  const { today, registeredDay, hasSmartPlan, history } = input;
  if (hasSmartPlan) return false;
  const all = history.filter(
    (h) => h.type === 'setup_smart_planning' || h.type === 'setup_smart_planning_date',
  );
  if (all.length >= SMART_TIP_MAX) return false;
  const plain = history.filter((h) => h.type === 'setup_smart_planning');
  if (plain.length === 0) return daysBetween(registeredDay, today) >= 2;
  if (plain.length === 1) return daysBetween(plain[0].day, today) >= 7;
  return false;
}

/** setup_smart_planning_date — одразу після вказання дати (крок 2). */
export function smartPlanningDateTipAllowed(input: {
  hasSmartPlan: boolean;
  history: TipHistory;
}): boolean {
  if (input.hasSmartPlan) return false;
  const all = input.history.filter(
    (h) => h.type === 'setup_smart_planning' || h.type === 'setup_smart_planning_date',
  );
  if (all.length >= SMART_TIP_MAX) return false;
  return !all.some((h) => h.type === 'setup_smart_planning_date');
}

export const SETUP_DATE_MAX = 3;

export function setupDateDue(input: {
  today: string;
  registeredDay: string;
  dateUndecided: boolean;
  history: string[]; // дні попередніх setup_date
}): boolean {
  if (!input.dateUndecided) return false;
  if (input.history.length >= SETUP_DATE_MAX) return false;
  if (input.history.length === 0) return daysBetween(input.registeredDay, input.today) >= 1;
  return daysBetween(input.history[input.history.length - 1], input.today) >= 7;
}

// ───────────────────────── Відлік і прогрес (розділ 4.4)

export const COUNTDOWN_THRESHOLDS = [100, 30, 7] as const;
/** Скільки днів «запізнення» допускаємо, якщо задача не відпрацювала вчасно. */
const COUNTDOWN_GRACE = 2;

export function countdownThreshold(daysLeft: number): number | null {
  for (const th of COUNTDOWN_THRESHOLDS) {
    if (daysLeft <= th && daysLeft >= th - COUNTDOWN_GRACE) return th;
  }
  return null;
}

export const PROGRESS_THRESHOLDS = [25, 50, 75, 100] as const;
/** Менше завдань — відсотки не показові (3 стартові завдання ≠ «чверть плану»). */
export const PROGRESS_MIN_TASKS = 10;

/** Найвищий досягнутий поріг, про який ще не повідомляли (або null). */
export function progressThreshold(
  done: number,
  total: number,
  alreadySent: (threshold: number) => boolean,
): number | null {
  if (total < PROGRESS_MIN_TASKS) return null;
  const pct = (done / total) * 100;
  const reached = PROGRESS_THRESHOLDS.filter((th) => pct >= th);
  if (!reached.length) return null;
  const top = reached[reached.length - 1];
  return alreadySent(top) ? null : top;
}
