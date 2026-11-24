"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationRemindersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRemindersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_catalog_1 = require("./notification-catalog");
const notification_logic_1 = require("./notification-logic");
const notifications_service_1 = require("./notifications.service");
const GUESTS_START_KEY = 'guests:start';
const CHECK_EVERY_MS = 15 * 60 * 1000;
let NotificationRemindersService = NotificationRemindersService_1 = class NotificationRemindersService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.logger = new common_1.Logger(NotificationRemindersService_1.name);
        this.timer = null;
        this.running = false;
    }
    onModuleInit() {
        if (process.env.NOTIFICATIONS_CRON === 'off')
            return;
        this.timer = setInterval(() => void this.tick(), CHECK_EVERY_MS);
        setTimeout(() => void this.tick(), 60_000);
    }
    onModuleDestroy() {
        if (this.timer)
            clearInterval(this.timer);
    }
    async tick() {
        const now = new Date();
        if ((0, notification_logic_1.kyivHour)(now) < notification_logic_1.DAILY_HOUR_KYIV)
            return;
        await this.runDaily({ now }).catch((err) => this.logger.warn(`daily reminders failed: ${err instanceof Error ? err.message : String(err)}`));
    }
    async runDaily(opts = {}) {
        if (this.running)
            return { skipped: 'running' };
        const now = opts.now ?? new Date();
        const today = (0, notification_logic_1.kyivDay)(now);
        if (!opts.force) {
            const claimed = await this.prisma.$executeRaw `
        INSERT INTO notification_job_runs (day) VALUES (${today}::date)
        ON CONFLICT (day) DO NOTHING
      `;
            if (!claimed)
                return { skipped: 'already-ran', day: today };
        }
        this.running = true;
        let weddings = 0;
        let created = 0;
        try {
            const rows = await this.prisma.wedding.findMany({
                where: { date: { gte: new Date(Date.parse(`${(0, notification_logic_1.addDays)(today, -14)}T00:00:00Z`)) } },
                select: { id: true },
            });
            for (const row of rows) {
                try {
                    created += await this.runWedding(row.id, today, now);
                    weddings += 1;
                }
                catch (err) {
                    this.logger.warn(`reminders for ${row.id} failed: ${err instanceof Error ? err.message : String(err)}`);
                }
            }
        }
        finally {
            this.running = false;
        }
        this.logger.log(`Daily reminders ${today}: ${weddings} weddings, ${created} notifications`);
        return { day: today, weddings, created };
    }
    async runWedding(weddingId, today, now) {
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
        if (!wedding)
            return 0;
        const members = await this.notifications.getMembers(weddingId);
        if (!members)
            return 0;
        const memberIds = [members.ownerId, ...(members.partnerId ? [members.partnerId] : [])];
        const [flags] = await this.prisma.$queryRaw `
      SELECT date_undecided FROM weddings WHERE id = ${weddingId}
    `.catch(() => [{ date_undecided: false }]);
        const dateUndecided = Boolean(flags?.date_undecided);
        const weddingDay = (0, notification_logic_1.utcDay)(wedding.date);
        const toWedding = (0, notification_logic_1.daysBetween)(today, weddingDay);
        const registeredDay = (0, notification_logic_1.kyivDay)(wedding.user.createdAt);
        const tasks = await this.prisma.$queryRaw `
      SELECT id, title, status, due_date, created_at, template_id, source, is_urgent, assignee
      FROM tasks WHERE wedding_id = ${weddingId}
    `;
        const guests = await this.prisma.guest.findMany({
            where: { weddingId },
            select: { id: true, rsvpStatus: true },
        });
        const pending = guests.filter((g) => g.rsvpStatus === 'PENDING').length;
        const history = await this.prisma.$queryRaw `
      SELECT recipient_id, type, dedup_key, count, created_at, read_at, resolved_at, payload
      FROM notifications WHERE wedding_id = ${weddingId}
      ORDER BY created_at ASC
    `;
        const sentKeys = new Map();
        for (const h of history) {
            const set = sentKeys.get(h.recipient_id) ?? new Set();
            set.add(h.dedup_key);
            sentKeys.set(h.recipient_id, set);
        }
        const wasSent = (recipientId, key) => sentKeys.get(recipientId)?.has(key) ?? false;
        const sentToAnyone = (key) => memberIds.some((id) => wasSent(id, key));
        const ofType = (recipientId, type) => history.filter((h) => h.recipient_id === recipientId && h.type === type && !h.payload?.marker);
        const settings = new Map();
        for (const id of memberIds)
            settings.set(id, await this.notifications.getSettings(id));
        const perRecipient = new Map(memberIds.map((id) => [id, []]));
        const toAll = (c) => {
            for (const id of memberIds)
                if (!wasSent(id, c.dedupKey))
                    perRecipient.get(id).push(c);
        };
        const reminderTasks = tasks.map((t) => ({
            id: t.id,
            title: t.title,
            status: t.status,
            dueDay: t.due_date ? (0, notification_logic_1.utcDay)(new Date(t.due_date)) : null,
            createdAt: new Date(t.created_at),
            templateId: t.template_id,
            source: t.source,
            isUrgent: Boolean(t.is_urgent),
            assignee: t.assignee,
        }));
        {
            for (const task of reminderTasks) {
                if (task.status === 'DONE' || !task.dueDay)
                    continue;
                const { recipients, isOther } = (0, notification_logic_1.taskRecipients)(task.assignee, members);
                const base = (0, notification_logic_1.taskKeyBase)(task);
                for (const r of recipients) {
                    const overdueRows = history.filter((h) => h.recipient_id === r && h.dedup_key.startsWith(`${base}:overdue:`));
                    const plan = (0, notification_logic_1.planTaskReminder)(task, {
                        today,
                        now,
                        frequency: settings.get(r).taskFrequency,
                        isOther,
                        history: {
                            sent: (k) => wasSent(r, k),
                            overdue: {
                                count: overdueRows.length,
                                lastDay: overdueRows.length
                                    ? (0, notification_logic_1.kyivDay)(overdueRows[overdueRows.length - 1].created_at)
                                    : null,
                            },
                        },
                    });
                    if (!plan)
                        continue;
                    perRecipient.get(r).push({
                        type: plan.type,
                        dedupKey: plan.dedupKey,
                        reminderNo: plan.reminderNo,
                        payload: {
                            taskId: task.id,
                            taskTitle: task.title,
                            days: plan.days,
                            dueDate: task.dueDay ?? undefined,
                            ...(plan.type === 'deadline_early' || plan.type === 'deadline_late'
                                ? (0, notification_logic_1.nudgeFor)(task, plan.reminderNo)
                                : {}),
                        },
                    });
                }
            }
        }
        const urgent = reminderTasks.filter((t) => t.isUrgent && t.status !== 'DONE');
        if (urgent.length) {
            const planDay = urgent
                .map((t) => (0, notification_logic_1.kyivDay)(t.createdAt))
                .sort()
                .at(-1);
            const since = (0, notification_logic_1.daysBetween)(planDay, today);
            if (since >= 1 && since <= 3) {
                toAll({ type: 'urgent_digest', dedupKey: `urgent:${planDay}`, count: urgent.length, payload: {} });
            }
        }
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
        const startCandidates = [];
        const marker = history.find((h) => h.dedup_key === GUESTS_START_KEY);
        if (marker)
            startCandidates.push((0, notification_logic_1.kyivDay)(marker.created_at));
        if (wedding.website?.published) {
            const [site] = await this.prisma.$queryRaw `
        SELECT published_at FROM wedding_websites WHERE id = ${wedding.website.id}
      `.catch(() => []);
            if (site?.published_at)
                startCandidates.push((0, notification_logic_1.kyivDay)(new Date(site.published_at)));
        }
        const startDay = startCandidates.sort()[0] ?? null;
        for (const r of memberIds) {
            const sent = ofType(r, 'guests_no_response').map((h) => ({
                day: (0, notification_logic_1.kyivDay)(h.created_at),
                count: h.count,
            }));
            if ((0, notification_logic_1.guestsNoResponseDue)({ today, startDay, weddingDay, pending, history: sent }) &&
                !dateUndecided) {
                perRecipient.get(r).push({
                    type: 'guests_no_response',
                    dedupKey: `guests:no_response:${today}`,
                    count: pending,
                    payload: {},
                    replaces: 'guests_no_response',
                });
            }
        }
        if (pending > 0) {
            for (const t of reminderTasks) {
                if (t.status === 'DONE' || !t.dueDay)
                    continue;
                if (t.templateId !== 'guests_confirm' && t.templateId !== 'seating')
                    continue;
                const left = (0, notification_logic_1.daysBetween)(today, t.dueDay);
                if (left < 1 || left > 3)
                    continue;
                toAll({
                    type: 'guests_no_response_deadline',
                    dedupKey: `guests:deadline:${t.id}:${t.dueDay}`,
                    count: pending,
                    payload: { milestone: t.templateId, taskId: t.id },
                });
            }
        }
        if (!dateUndecided && toWedding > 0 && toWedding <= 21) {
            const seated = this.seatedGuestIds(wedding.seatingPlan);
            const yes = guests.filter((g) => g.rsvpStatus === 'YES');
            const unassigned = yes.filter((g) => !seated.has(g.id)).length;
            if (unassigned > 0) {
                for (const r of memberIds) {
                    const prev = ofType(r, 'seating_unassigned');
                    const last = prev.at(-1);
                    const due = !last ||
                        ((0, notification_logic_1.daysBetween)((0, notification_logic_1.kyivDay)(last.created_at), today) >= 3 &&
                            Number(last.payload?.confirmed ?? 0) < yes.length);
                    if (!due)
                        continue;
                    perRecipient.get(r).push({
                        type: 'seating_unassigned',
                        dedupKey: `seating:unassigned:${today}`,
                        count: unassigned,
                        payload: { confirmed: yes.length },
                        replaces: 'seating_unassigned',
                    });
                }
            }
            else {
                await this.notifications.resolveTypes(weddingId, ['seating_unassigned']);
            }
        }
        if (!wedding.website?.published && invitationsTask?.dueDay && invitationsTask.status !== 'DONE') {
            const left = (0, notification_logic_1.daysBetween)(today, invitationsTask.dueDay);
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
        if (!dateUndecided) {
            if (toWedding >= 5 && toWedding <= 7) {
                toAll({ type: 'dayplan_share', dedupKey: `dayplan:share:${weddingDay}`, payload: {} });
            }
            if (toWedding === 1) {
                toAll({ type: 'dayplan_tomorrow', dedupKey: `dayplan:tomorrow:${weddingDay}`, payload: {} });
                toAll({ type: 'countdown_tomorrow', dedupKey: `countdown:1:${weddingDay}`, payload: {} });
            }
            const th = (0, notification_logic_1.countdownThreshold)(toWedding);
            if (th) {
                toAll({ type: 'countdown', dedupKey: `countdown:${th}:${weddingDay}`, payload: { days: th } });
            }
            const sinceWedding = -toWedding;
            if (sinceWedding >= 3 && sinceWedding <= 10) {
                toAll({ type: 'post_wedding_feedback', dedupKey: `feedback:${weddingDay}`, payload: {} });
            }
        }
        const total = reminderTasks.length;
        const done = reminderTasks.filter((t) => t.status === 'DONE').length;
        const progress = (0, notification_logic_1.progressThreshold)(done, total, (p) => sentToAnyone(`progress:${p}`));
        if (progress) {
            toAll({ type: 'progress', dedupKey: `progress:${progress}`, payload: { threshold: progress, done, total } });
        }
        const hasSmartPlan = reminderTasks.some((t) => t.source === 'smart_planning');
        for (const r of memberIds) {
            const tips = history
                .filter((h) => h.recipient_id === r && h.type.startsWith('setup_smart_planning'))
                .map((h) => ({ type: h.type, day: (0, notification_logic_1.kyivDay)(h.created_at) }));
            if ((0, notification_logic_1.smartPlanningTipDue)({ today, registeredDay, hasSmartPlan, history: tips })) {
                perRecipient.get(r).push({
                    type: 'setup_smart_planning',
                    dedupKey: `tip:smart:${tips.filter((x) => x.type === 'setup_smart_planning').length + 1}`,
                    payload: {},
                });
            }
        }
        const dateTips = ofType(members.ownerId, 'setup_date').map((h) => (0, notification_logic_1.kyivDay)(h.created_at));
        if ((0, notification_logic_1.setupDateDue)({ today, registeredDay, dateUndecided, history: dateTips })) {
            toAll({ type: 'setup_date', dedupKey: `tip:date:${dateTips.length + 1}`, payload: {} });
        }
        if (!members.partnerId &&
            wedding.invites.length === 0 &&
            (0, notification_logic_1.daysBetween)(registeredDay, today) >= 3) {
            const c = { type: 'setup_partner', dedupKey: 'tip:partner', payload: {} };
            if (!wasSent(members.ownerId, c.dedupKey))
                perRecipient.get(members.ownerId).push(c);
        }
        await this.resolveStale(weddingId, reminderTasks, pending, Boolean(wedding.website?.published), hasSmartPlan, dateUndecided, Boolean(members.partnerId));
        let created = 0;
        for (const r of memberIds) {
            const s = settings.get(r);
            const all = perRecipient.get(r);
            const enabled = [];
            for (const c of all) {
                if ((0, notification_catalog_1.isTypeEnabled)(s, c.type))
                    enabled.push(c);
                else
                    await this.record(weddingId, r, c, true);
            }
            const plan = (0, notification_logic_1.applyDailyLimit)(enabled);
            for (const c of plan.digested)
                await this.record(weddingId, r, c, true);
            if (plan.digestCount) {
                await this.record(weddingId, r, { type: 'deadline_digest', dedupKey: `digest:${today}`, count: plan.digestCount, payload: {} }, false);
                created += 1;
            }
            for (const c of plan.send) {
                if (c.replaces)
                    await this.notifications.resolveTypes(weddingId, [c.replaces], r);
                await this.record(weddingId, r, c, false);
                created += 1;
            }
        }
        return created;
    }
    record(weddingId, recipientId, c, suppressed) {
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
    seatedGuestIds(plan) {
        const out = new Set();
        if (!plan || typeof plan !== 'object')
            return out;
        const tables = plan.tables;
        if (!Array.isArray(tables))
            return out;
        for (const table of tables) {
            const seats = table?.seats;
            if (!Array.isArray(seats))
                continue;
            for (const seat of seats) {
                const key = seat?.guestKey;
                if (typeof key === 'string' && key)
                    out.add(key.split(':')[0]);
            }
        }
        return out;
    }
    async resolveStale(weddingId, tasks, pending, published, hasSmartPlan, dateUndecided, hasPartner) {
        const doneOrMissing = new Set(tasks.filter((t) => t.status === 'DONE').map((t) => t.id));
        const existing = new Set(tasks.map((t) => t.id));
        const open = await this.prisma.$queryRaw `
      SELECT id, payload->>'taskId' AS task_id FROM notifications
      WHERE wedding_id = ${weddingId} AND read_at IS NULL AND resolved_at IS NULL
        AND type IN ('deadline_early', 'deadline_late', 'deadline_today', 'task_overdue')
    `;
        const stale = open
            .filter((o) => o.task_id && (doneOrMissing.has(o.task_id) || !existing.has(o.task_id)))
            .map((o) => o.id);
        if (stale.length) {
            await this.prisma.$executeRaw `
        UPDATE notifications SET resolved_at = ${(0, notifications_service_1.utcTs)()}::timestamp WHERE id = ANY(${stale})
      `;
        }
        const types = [];
        if (pending === 0)
            types.push('guests_no_response', 'guests_no_response_deadline');
        if (published)
            types.push('invitation_unpublished');
        if (hasSmartPlan)
            types.push('setup_smart_planning', 'setup_smart_planning_date');
        if (!dateUndecided)
            types.push('setup_date');
        if (hasPartner)
            types.push('setup_partner');
        await this.notifications.resolveTypes(weddingId, types);
    }
};
exports.NotificationRemindersService = NotificationRemindersService;
exports.NotificationRemindersService = NotificationRemindersService = NotificationRemindersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], NotificationRemindersService);
//# sourceMappingURL=notification-reminders.service.js.map