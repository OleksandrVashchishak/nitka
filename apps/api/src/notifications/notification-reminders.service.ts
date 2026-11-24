import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  isTypeEnabled,
  type NotificationPayload,
  type NotificationSettings,
  type NotificationType,
} from './notification-catalog';
import {
  addDays,
  applyDailyLimit,
  countdownThreshold,
  DAILY_HOUR_KYIV,
  daysBetween,
  guestsNoResponseDue,
  kyivDay,
  kyivHour,
  nudgeFor,
  planTaskReminder,
  progressThreshold,
  setupDateDue,
  smartPlanningTipDue,
  taskKeyBase,
  taskRecipients,
  utcDay,
  type ReminderTask,
  type TipHistory,
} from './notification-logic';
import { NotificationsService, utcTs } from './notifications.service';

type Candidate = {
  type: NotificationType;
  dedupKey: string;
  count?: number;
  payload: NotificationPayload;
  reminderNo?: number;
  /** Перед створенням зняти непрочитані попередні такого типу (guests_no_response). */
  replaces?: NotificationType;
};

type HistoryRow = {
  recipient_id: string;
  type: string;
  dedup_key: string;
  count: number;
  created_at: Date;
  read_at: Date | null;
  resolved_at: Date | null;
  payload: NotificationPayload | null;
};

type TaskRow = {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  due_date: Date | null;
  created_at: Date;
  template_id: string | null;
  source: string | null;
  is_urgent: boolean | null;
  assignee: string | null;
};

const GUESTS_START_KEY = 'guests:start';
const CHECK_EVERY_MS = 15 * 60 * 1000;

/**
 * Щоденна задача нагадувань (розділ 2.4): о 10:00 за Києвом, один раз на день
 * (замок — таблиця notification_job_runs, тож кілька інстансів не дублюють).
 */
@Injectable()
export class NotificationRemindersService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationRemindersService.name);
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  onModuleInit() {
    if (process.env.NOTIFICATIONS_CRON === 'off') return;
    this.timer = setInterval(() => void this.tick(), CHECK_EVERY_MS);
    setTimeout(() => void this.tick(), 60_000);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private async tick() {
    const now = new Date();
    if (kyivHour(now) < DAILY_HOUR_KYIV) return;
    await this.runDaily({ now }).catch((err) =>
      this.logger.warn(
        `daily reminders failed: ${err instanceof Error ? err.message : String(err)}`,
      ),
    );
  }

  /** force — перезапустити сьогоднішній прогін (ручний тригер / локалка). */
  async runDaily(opts: { now?: Date; force?: boolean } = {}) {
    if (this.running) return { skipped: 'running' as const };
    const now = opts.now ?? new Date();
    const today = kyivDay(now);
    if (!opts.force) {
      const claimed = await this.prisma.$executeRaw`
        INSERT INTO notification_job_runs (day) VALUES (${today}::date)
        ON CONFLICT (day) DO NOTHING
      `;
      if (!claimed) return { skipped: 'already-ran' as const, day: today };
    }

    this.running = true;
    let weddings = 0;
    let created = 0;
    try {
      const rows = await this.prisma.wedding.findMany({
        where: { date: { gte: new Date(Date.parse(`${addDays(today, -14)}T00:00:00Z`)) } },
        select: { id: true },
      });
      for (const row of rows) {
        try {
          created += await this.runWedding(row.id, today, now);
          weddings += 1;
        } catch (err) {
          this.logger.warn(
            `reminders for ${row.id} failed: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      }
    } finally {
      this.running = false;
    }
    this.logger.log(`Daily reminders ${today}: ${weddings} weddings, ${created} notifications`);
    return { day: today, weddings, created };
  }

  private async runWedding(weddingId: string, today: string, now: Date) {
    const wedding = await this.prisma.wedding.findUnique({
      where: { id: weddingId },
      select: {
        id: true,
        date: true,
        seatingPlan: true,
        user: { select: { createdAt: true } },
        website: { select: { id: true, published: true } },
        invites: { select: { id: true }, take: 1 },
      },
    });
    if (!wedding) return 0;
    const members = await this.notifications.getMembers(weddingId);
    if (!members) return 0;
    const memberIds = [members.ownerId, ...(members.partnerId ? [members.partnerId] : [])];

    const [flags] = await this.prisma.$queryRaw<Array<{ date_undecided: boolean | null }>>`
      SELECT date_undecided FROM weddings WHERE id = ${weddingId}
    `.catch(() => [{ date_undecided: false }]);
    const dateUndecided = Boolean(flags?.date_undecided);
    const weddingDay = utcDay(wedding.date);
    const toWedding = daysBetween(today, weddingDay);
    const registeredDay = kyivDay(wedding.user.createdAt);

    const tasks = await this.prisma.$queryRaw<TaskRow[]>`
      SELECT id, title, status, due_date, created_at, template_id, source, is_urgent, assignee
      FROM tasks WHERE wedding_id = ${weddingId}
    `;
    const guests = await this.prisma.guest.findMany({
      where: { weddingId },
      select: { id: true, rsvpStatus: true },
    });
    const pending = guests.filter((g) => g.rsvpStatus === 'PENDING').length;

    const history = await this.prisma.$queryRaw<HistoryRow[]>`
      SELECT recipient_id, type, dedup_key, count, created_at, read_at, resolved_at, payload
      FROM notifications WHERE wedding_id = ${weddingId}
      ORDER BY created_at ASC
    `;
    const sentKeys = new Map<string, Set<string>>();
    for (const h of history) {
      const set = sentKeys.get(h.recipient_id) ?? new Set<string>();
      set.add(h.dedup_key);
      sentKeys.set(h.recipient_id, set);
    }
    const wasSent = (recipientId: string, key: string) =>
      sentKeys.get(recipientId)?.has(key) ?? false;
    const sentToAnyone = (key: string) => memberIds.some((id) => wasSent(id, key));
    const ofType = (recipientId: string, type: NotificationType) =>
      history.filter((h) => h.recipient_id === recipientId && h.type === type && !h.payload?.marker);

    const settings = new Map<string, NotificationSettings>();
    for (const id of memberIds) settings.set(id, await this.notifications.getSettings(id));

    const perRecipient = new Map<string, Candidate[]>(memberIds.map((id) => [id, []]));
    const toAll = (c: Candidate) => {
      for (const id of memberIds) if (!wasSent(id, c.dedupKey)) perRecipient.get(id)!.push(c);
    };

    // ── 1. Дедлайни завдань (розділ 5)
    const reminderTasks: ReminderTask[] = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      dueDay: t.due_date ? utcDay(new Date(t.due_date)) : null,
      createdAt: new Date(t.created_at),
      templateId: t.template_id,
      source: t.source,
      isUrgent: Boolean(t.is_urgent),
      assignee: t.assignee,
    }));
    {
      for (const task of reminderTasks) {
        if (task.status === 'DONE' || !task.dueDay) continue;
        const { recipients, isOther } = taskRecipients(task.assignee, members);
        const base = taskKeyBase(task);
        for (const r of recipients) {
          const overdueRows = history.filter(
            (h) => h.recipient_id === r && h.dedup_key.startsWith(`${base}:overdue:`),
          );
          const plan = planTaskReminder(task, {
            today,
            now,
            frequency: settings.get(r)!.taskFrequency,
            isOther,
            history: {
              sent: (k) => wasSent(r, k),
              overdue: {
                count: overdueRows.length,
                lastDay: overdueRows.length
                  ? kyivDay(overdueRows[overdueRows.length - 1].created_at)
                  : null,
              },
            },
          });
          if (!plan) continue;
          perRecipient.get(r)!.push({
            type: plan.type,
            dedupKey: plan.dedupKey,
            reminderNo: plan.reminderNo,
            payload: {
              taskId: task.id,
              taskTitle: task.title,
              days: plan.days,
              dueDate: task.dueDay ?? undefined,
              ...(plan.type === 'deadline_early' || plan.type === 'deadline_late'
                ? nudgeFor(task, plan.reminderNo)
                : {}),
            },
          });
        }
      }
    }

    // ── 2. Термінові після розумного планування (розділ 5.3)
    const urgent = reminderTasks.filter((t) => t.isUrgent && t.status !== 'DONE');
    if (urgent.length) {
      const planDay = urgent
        .map((t) => kyivDay(t.createdAt))
        .sort()
        .at(-1)!;
      const since = daysBetween(planDay, today);
      if (since >= 1 && since <= 3) {
        toAll({ type: 'urgent_digest', dedupKey: `urgent:${planDay}`, count: urgent.length, payload: {} });
      }
    }

    // ── 3. Гості без відповіді (розділ 6)
    const invitationsTask = reminderTasks.find((t) => t.templateId === 'invitations_send');
    if (invitationsTask?.status === 'DONE' && !sentToAnyone(GUESTS_START_KEY)) {
      await this.notifications.create({
        weddingId,
        recipientId: members.ownerId,
        type: 'guests_no_response',
        dedupKey: GUESTS_START_KEY,
        payload: { marker: true },
        suppressed: true,
      });
      sentKeys.get(members.ownerId)?.add(GUESTS_START_KEY) ??
        sentKeys.set(members.ownerId, new Set([GUESTS_START_KEY]));
      history.push({
        recipient_id: members.ownerId,
        type: 'guests_no_response',
        dedup_key: GUESTS_START_KEY,
        count: 1,
        created_at: now,
        read_at: now,
        resolved_at: now,
        payload: { marker: true },
      });
    }
    const startCandidates: string[] = [];
    const marker = history.find((h) => h.dedup_key === GUESTS_START_KEY);
    if (marker) startCandidates.push(kyivDay(marker.created_at));
    if (wedding.website?.published) {
      // published_at — raw SQL, як у website.service (вендорений клієнт може відставати).
      const [site] = await this.prisma.$queryRaw<Array<{ published_at: Date | null }>>`
        SELECT published_at FROM wedding_websites WHERE id = ${wedding.website.id}
      `.catch(() => []);
      if (site?.published_at) startCandidates.push(kyivDay(new Date(site.published_at)));
    }
    const startDay = startCandidates.sort()[0] ?? null;
    for (const r of memberIds) {
      const sent = ofType(r, 'guests_no_response').map((h) => ({
        day: kyivDay(h.created_at),
        count: h.count,
      }));
      if (
        guestsNoResponseDue({ today, startDay, weddingDay, pending, history: sent }) &&
        !dateUndecided
      ) {
        perRecipient.get(r)!.push({
          type: 'guests_no_response',
          dedupKey: `guests:no_response:${today}`,
          count: pending,
          payload: {},
          replaces: 'guests_no_response',
        });
      }
    }

    // guests_no_response_deadline — за 3 дні до guests_confirm / seating
    if (pending > 0) {
      for (const t of reminderTasks) {
        if (t.status === 'DONE' || !t.dueDay) continue;
        if (t.templateId !== 'guests_confirm' && t.templateId !== 'seating') continue;
        const left = daysBetween(today, t.dueDay);
        if (left < 1 || left > 3) continue;
        toAll({
          type: 'guests_no_response_deadline',
          dedupKey: `guests:deadline:${t.id}:${t.dueDay}`,
          count: pending,
          payload: { milestone: t.templateId, taskId: t.id },
        });
      }
    }

    // ── 4. Розсадка: підтвердили, але без місця (за 21 день, далі після нових підтверджень)
    if (!dateUndecided && toWedding > 0 && toWedding <= 21) {
      const seated = this.seatedGuestIds(wedding.seatingPlan);
      const yes = guests.filter((g) => g.rsvpStatus === 'YES');
      const unassigned = yes.filter((g) => !seated.has(g.id)).length;
      if (unassigned > 0) {
        for (const r of memberIds) {
          const prev = ofType(r, 'seating_unassigned');
          const last = prev.at(-1);
          const due =
            !last ||
            (daysBetween(kyivDay(last.created_at), today) >= 3 &&
              Number(last.payload?.confirmed ?? 0) < yes.length);
          if (!due) continue;
          perRecipient.get(r)!.push({
            type: 'seating_unassigned',
            dedupKey: `seating:unassigned:${today}`,
            count: unassigned,
            payload: { confirmed: yes.length },
            replaces: 'seating_unassigned',
          });
        }
      } else {
        await this.notifications.resolveTypes(weddingId, ['seating_unassigned']);
      }
    }

    // ── 5. Сайт-запрошення не опубліковано
    if (!wedding.website?.published && invitationsTask?.dueDay && invitationsTask.status !== 'DONE') {
      const left = daysBetween(today, invitationsTask.dueDay);
      const stage = left >= 3 && left <= 7 ? 1 : left >= 0 && left <= 2 ? 2 : 0;
      if (stage) {
        toAll({
          type: 'invitation_unpublished',
          dedupKey: `invitation:${invitationsTask.dueDay}:${stage}`,
          payload: { days: left, taskId: invitationsTask.id },
          reminderNo: stage,
        });
      }
    }

    // ── 6. План дня, відлік (лише коли дата відома)
    if (!dateUndecided) {
      if (toWedding >= 5 && toWedding <= 7) {
        toAll({ type: 'dayplan_share', dedupKey: `dayplan:share:${weddingDay}`, payload: {} });
      }
      if (toWedding === 1) {
        toAll({ type: 'dayplan_tomorrow', dedupKey: `dayplan:tomorrow:${weddingDay}`, payload: {} });
        toAll({ type: 'countdown_tomorrow', dedupKey: `countdown:1:${weddingDay}`, payload: {} });
      }
      const th = countdownThreshold(toWedding);
      if (th) {
        toAll({ type: 'countdown', dedupKey: `countdown:${th}:${weddingDay}`, payload: { days: th } });
      }
      const sinceWedding = -toWedding;
      if (sinceWedding >= 3 && sinceWedding <= 10) {
        toAll({ type: 'post_wedding_feedback', dedupKey: `feedback:${weddingDay}`, payload: {} });
      }
    }

    // ── 7. Прогрес
    const total = reminderTasks.length;
    const done = reminderTasks.filter((t) => t.status === 'DONE').length;
    const progress = progressThreshold(done, total, (p) => sentToAnyone(`progress:${p}`));
    if (progress) {
      toAll({ type: 'progress', dedupKey: `progress:${progress}`, payload: { threshold: progress, done, total } });
    }

    // ── 8. Підказки (розділ 7)
    const hasSmartPlan = reminderTasks.some((t) => t.source === 'smart_planning');
    for (const r of memberIds) {
      const tips: TipHistory = history
        .filter((h) => h.recipient_id === r && h.type.startsWith('setup_smart_planning'))
        .map((h) => ({ type: h.type as NotificationType, day: kyivDay(h.created_at) }));
      if (smartPlanningTipDue({ today, registeredDay, hasSmartPlan, history: tips })) {
        perRecipient.get(r)!.push({
          type: 'setup_smart_planning',
          dedupKey: `tip:smart:${tips.filter((x) => x.type === 'setup_smart_planning').length + 1}`,
          payload: {},
        });
      }
    }
    const dateTips = ofType(members.ownerId, 'setup_date').map((h) => kyivDay(h.created_at));
    if (setupDateDue({ today, registeredDay, dateUndecided, history: dateTips })) {
      toAll({ type: 'setup_date', dedupKey: `tip:date:${dateTips.length + 1}`, payload: {} });
    }
    if (
      !members.partnerId &&
      wedding.invites.length === 0 &&
      daysBetween(registeredDay, today) >= 3
    ) {
      const c: Candidate = { type: 'setup_partner', dedupKey: 'tip:partner', payload: {} };
      if (!wasSent(members.ownerId, c.dedupKey)) perRecipient.get(members.ownerId)!.push(c);
    }

    // ── Неактуальне (розділ 2.3)
    await this.resolveStale(weddingId, reminderTasks, pending, Boolean(wedding.website?.published), hasSmartPlan, dateUndecided, Boolean(members.partnerId));

    // ── Налаштування → ліміт → запис
    let created = 0;
    for (const r of memberIds) {
      const s = settings.get(r)!;
      const all = perRecipient.get(r)!;
      const enabled: Candidate[] = [];
      for (const c of all) {
        if (isTypeEnabled(s, c.type)) enabled.push(c);
        else await this.record(weddingId, r, c, true); // вимкнено — не надсилаємо й пізніше
      }
      const plan = applyDailyLimit(enabled);
      for (const c of plan.digested) await this.record(weddingId, r, c, true);
      if (plan.digestCount) {
        await this.record(
          weddingId,
          r,
          { type: 'deadline_digest', dedupKey: `digest:${today}`, count: plan.digestCount, payload: {} },
          false,
        );
        created += 1;
      }
      for (const c of plan.send) {
        if (c.replaces) await this.notifications.resolveTypes(weddingId, [c.replaces], r);
        await this.record(weddingId, r, c, false);
        created += 1;
      }
    }
    return created;
  }

  private record(weddingId: string, recipientId: string, c: Candidate, suppressed: boolean) {
    return this.notifications.create({
      weddingId,
      recipientId,
      type: c.type,
      dedupKey: c.dedupKey,
      count: c.count,
      payload: c.payload,
      reminderNo: c.reminderNo ?? null,
      suppressed,
    });
  }

  private seatedGuestIds(plan: unknown): Set<string> {
    const out = new Set<string>();
    if (!plan || typeof plan !== 'object') return out;
    const tables = (plan as { tables?: unknown }).tables;
    if (!Array.isArray(tables)) return out;
    for (const table of tables) {
      const seats = (table as { seats?: unknown })?.seats;
      if (!Array.isArray(seats)) continue;
      for (const seat of seats) {
        const key = (seat as { guestKey?: unknown })?.guestKey;
        if (typeof key === 'string' && key) out.add(key.split(':')[0]);
      }
    }
    return out;
  }

  /** Знімає непрочитані нагадування, умова яких більше не виконується. */
  private async resolveStale(
    weddingId: string,
    tasks: ReminderTask[],
    pending: number,
    published: boolean,
    hasSmartPlan: boolean,
    dateUndecided: boolean,
    hasPartner: boolean,
  ) {
    const doneOrMissing = new Set(tasks.filter((t) => t.status === 'DONE').map((t) => t.id));
    const existing = new Set(tasks.map((t) => t.id));
    const open = await this.prisma.$queryRaw<Array<{ id: string; task_id: string | null }>>`
      SELECT id, payload->>'taskId' AS task_id FROM notifications
      WHERE wedding_id = ${weddingId} AND read_at IS NULL AND resolved_at IS NULL
        AND type IN ('deadline_early', 'deadline_late', 'deadline_today', 'task_overdue')
    `;
    const stale = open
      .filter((o) => o.task_id && (doneOrMissing.has(o.task_id) || !existing.has(o.task_id)))
      .map((o) => o.id);
    if (stale.length) {
      await this.prisma.$executeRaw`
        UPDATE notifications SET resolved_at = ${utcTs()}::timestamp WHERE id = ANY(${stale})
      `;
    }
    const types: NotificationType[] = [];
    if (pending === 0) types.push('guests_no_response', 'guests_no_response_deadline');
    if (published) types.push('invitation_unpublished');
    if (hasSmartPlan) types.push('setup_smart_planning', 'setup_smart_planning_date');
    if (!dateUndecided) types.push('setup_date');
    if (hasPartner) types.push('setup_partner');
    await this.notifications.resolveTypes(weddingId, types);
  }
}
