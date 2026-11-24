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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
exports.utcTs = utcTs;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const email_service_1 = require("../email/email.service");
const prisma_service_1 = require("../prisma/prisma.service");
const wedding_access_1 = require("../weddings/wedding-access");
const notification_catalog_1 = require("./notification-catalog");
const notification_logic_1 = require("./notification-logic");
const SETTINGS_KEYS = [
    'tasks',
    'guests',
    'partnerActivity',
    'invitationAndDayPlan',
    'milestones',
    'tips',
];
function isNotificationType(v) {
    return notification_catalog_1.NOTIFICATION_TYPES.includes(v);
}
function utcTs(d = new Date()) {
    return d.toISOString().replace('Z', '');
}
function firstName(name) {
    return (name ?? '').trim().split(/\s+/)[0] || '';
}
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(prisma, email) {
        this.prisma = prisma;
        this.email = email;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async registerDevice(userId, token, platform) {
        const clean = token.trim();
        if (!clean)
            return { ok: false };
        await this.prisma.pushDevice.upsert({
            where: { token: clean },
            create: {
                userId,
                token: clean,
                platform: platform?.trim() || 'unknown',
            },
            update: {
                userId,
                platform: platform?.trim() || 'unknown',
            },
        });
        return { ok: true };
    }
    async unregisterDevice(userId, token) {
        await this.prisma.pushDevice.deleteMany({
            where: { userId, token: token.trim() },
        });
        return { ok: true };
    }
    async getMembers(weddingId) {
        const wedding = await this.prisma.wedding.findUnique({
            where: { id: weddingId },
            select: {
                userId: true,
                partnerOneName: true,
                partnerTwoName: true,
                members: { select: { userId: true, role: true } },
            },
        });
        if (!wedding)
            return null;
        const partner = wedding.members.find((m) => m.role === 'PARTNER' && m.userId !== wedding.userId);
        return {
            ownerId: wedding.userId,
            partnerId: partner?.userId ?? null,
            partnerOneName: wedding.partnerOneName,
            partnerTwoName: wedding.partnerTwoName,
        };
    }
    async getActors(weddingId, userIds) {
        const out = new Map();
        const ids = [...new Set(userIds.filter(Boolean))];
        if (!ids.length)
            return out;
        const [members, users] = await Promise.all([
            this.getMembers(weddingId),
            this.prisma.$queryRaw `
        SELECT id, name, gender FROM users WHERE id = ANY(${ids})
      `.catch(() => this.prisma.user
                .findMany({ where: { id: { in: ids } }, select: { id: true, name: true } })
                .then((rows) => rows.map((r) => ({ ...r, gender: null })))),
        ]);
        for (const u of users) {
            let name = u.name;
            if (members?.ownerId === u.id)
                name = members.partnerOneName || u.name;
            else if (members?.partnerId === u.id)
                name = members.partnerTwoName || u.name;
            const gender = u.gender === 'female' || u.gender === 'male' ? u.gender : null;
            out.set(u.id, { name: firstName(name) || firstName(u.name) || 'Партнер', gender });
        }
        return out;
    }
    async getSettings(userId) {
        const rows = await this.prisma.$queryRaw `
      SELECT notif_settings, notif_push, notif_email FROM users WHERE id = ${userId}
    `.catch(() => []);
        const row = rows[0];
        const raw = row?.notif_settings && typeof row.notif_settings === 'object'
            ? row.notif_settings
            : {};
        const settings = {
            ...notification_catalog_1.DEFAULT_SETTINGS,
            channels: {
                push: row?.notif_push ?? notification_catalog_1.DEFAULT_SETTINGS.channels.push,
                email: row?.notif_email ?? notification_catalog_1.DEFAULT_SETTINGS.channels.email,
            },
        };
        for (const key of SETTINGS_KEYS) {
            if (typeof raw[key] === 'boolean')
                settings[key] = raw[key];
        }
        if (raw.taskFrequency === 'less' || raw.taskFrequency === 'normal') {
            settings.taskFrequency = raw.taskFrequency;
        }
        return settings;
    }
    async getPrefs(userId) {
        const settings = await this.getSettings(userId);
        const access = await (0, wedding_access_1.resolveWeddingForUser)(this.prisma, userId);
        let partnerName = null;
        let hasPartner = false;
        if (access) {
            const members = await this.getMembers(access.wedding.id);
            const otherId = members?.ownerId === userId ? members.partnerId : members?.ownerId ?? null;
            hasPartner = Boolean(members?.partnerId);
            if (otherId && hasPartner) {
                const actors = await this.getActors(access.wedding.id, [otherId]);
                partnerName = actors.get(otherId)?.name ?? null;
            }
        }
        return { ...settings, partnerName, hasPartner };
    }
    async updatePrefs(userId, patch) {
        const current = await this.getSettings(userId);
        const next = {
            tasks: current.tasks,
            taskFrequency: current.taskFrequency,
            guests: current.guests,
            partnerActivity: current.partnerActivity,
            invitationAndDayPlan: current.invitationAndDayPlan,
            milestones: current.milestones,
            tips: current.tips,
        };
        for (const key of SETTINGS_KEYS) {
            if (typeof patch[key] === 'boolean')
                next[key] = patch[key];
        }
        if (patch.taskFrequency === 'less' || patch.taskFrequency === 'normal') {
            next.taskFrequency = patch.taskFrequency;
        }
        const push = patch.push ?? current.channels.push;
        const email = patch.email ?? current.channels.email;
        await this.prisma.$executeRaw `
      UPDATE users
      SET notif_settings = ${JSON.stringify(next)}::jsonb,
          notif_push = ${push},
          notif_email = ${email}
      WHERE id = ${userId}
    `;
        return this.getPrefs(userId);
    }
    async create(input) {
        const id = (0, node_crypto_1.randomUUID)();
        const now = new Date();
        const payload = input.payload ?? {};
        await this.prisma.$executeRaw `
      INSERT INTO notifications
        (id, wedding_id, recipient_id, type, dedup_key, count, payload,
         created_at, updated_at, read_at, resolved_at, reminder_no)
      VALUES
        (${id}, ${input.weddingId}, ${input.recipientId}, ${input.type}, ${input.dedupKey},
         ${input.count ?? 1}, ${JSON.stringify(payload)}::jsonb, ${utcTs(now)}::timestamp,
         ${utcTs(now)}::timestamp,
         ${input.suppressed ? utcTs(now) : null}::timestamp,
         ${input.suppressed ? utcTs(now) : null}::timestamp,
         ${input.reminderNo ?? null})
    `;
        if (!input.suppressed) {
            void this.deliver(input.recipientId, input.weddingId, {
                type: input.type,
                count: input.count ?? 1,
                payload,
            }).catch((err) => this.logger.warn(`deliver failed: ${err instanceof Error ? err.message : String(err)}`));
        }
        return id;
    }
    async partnerEvent(weddingId, actorId, type, event = {}) {
        try {
            const members = await this.getMembers(weddingId);
            if (!members)
                return;
            const recipients = [members.ownerId, members.partnerId].filter((id) => Boolean(id) && id !== actorId);
            const n = Math.max(1, event.n ?? 1);
            const dedupKey = `partner:${actorId}:${type}`;
            for (const recipientId of recipients) {
                const settings = await this.getSettings(recipientId);
                if (!(0, notification_catalog_1.isTypeEnabled)(settings, type))
                    continue;
                const rows = await this.prisma.$queryRaw `
          SELECT * FROM notifications
          WHERE recipient_id = ${recipientId} AND dedup_key = ${dedupKey}
          ORDER BY created_at DESC
          LIMIT 1
        `;
                const prev = rows[0] ?? null;
                const now = new Date();
                if (prev &&
                    (0, notification_logic_1.canMergeInto)({ createdAt: prev.created_at, readAt: prev.read_at, resolvedAt: prev.resolved_at }, now)) {
                    const p = prev.payload ?? {};
                    const payload = {
                        ...p,
                        actorId,
                        entityIds: (0, notification_logic_1.mergeEntityIds)(p.entityIds, event.entityIds),
                        ...(event.amount !== undefined
                            ? { amount: (Number(p.amount) || 0) + event.amount }
                            : {}),
                        ...(event.vendorId ? { vendorId: event.vendorId } : {}),
                        ...(event.vendorLabel ? { vendorLabel: event.vendorLabel } : {}),
                        ...(event.siteUrl ? { siteUrl: event.siteUrl } : {}),
                    };
                    const add = type === 'partner_seating_updated' || type === 'partner_site_published' ? 0 : n;
                    await this.prisma.$executeRaw `
            UPDATE notifications
            SET count = count + ${add},
                payload = ${JSON.stringify(payload)}::jsonb,
                updated_at = ${utcTs(now)}::timestamp
            WHERE id = ${prev.id}
          `;
                    continue;
                }
                await this.create({
                    weddingId,
                    recipientId,
                    type,
                    dedupKey,
                    count: n,
                    payload: {
                        actorId,
                        entityIds: event.entityIds?.slice(-200),
                        amount: event.amount,
                        vendorId: event.vendorId,
                        vendorLabel: event.vendorLabel,
                        siteUrl: event.siteUrl,
                    },
                });
            }
        }
        catch (err) {
            this.logger.warn(`partnerEvent ${type} failed: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
    async direct(weddingId, recipientId, type, dedupKey, payload) {
        try {
            const settings = await this.getSettings(recipientId);
            if (!(0, notification_catalog_1.isTypeEnabled)(settings, type))
                return;
            await this.create({ weddingId, recipientId, type, dedupKey, payload });
        }
        catch (err) {
            this.logger.warn(`direct ${type} failed: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
    async smartPlanningDateTip(weddingId) {
        try {
            const [smart] = await this.prisma.$queryRaw `
        SELECT COUNT(*)::int AS n FROM tasks
        WHERE wedding_id = ${weddingId} AND source = 'smart_planning'
      `;
            const hasSmartPlan = Number(smart?.n ?? 0) > 0;
            const members = await this.getMembers(weddingId);
            if (!members || hasSmartPlan)
                return;
            for (const recipientId of [members.ownerId, members.partnerId]) {
                if (!recipientId)
                    continue;
                const rows = await this.prisma.$queryRaw `
          SELECT type, created_at FROM notifications
          WHERE wedding_id = ${weddingId} AND recipient_id = ${recipientId}
            AND type IN ('setup_smart_planning', 'setup_smart_planning_date')
        `;
                const history = rows.map((r) => ({
                    type: r.type,
                    day: r.created_at.toISOString().slice(0, 10),
                }));
                if (!(0, notification_logic_1.smartPlanningDateTipAllowed)({ hasSmartPlan, history }))
                    continue;
                await this.direct(weddingId, recipientId, 'setup_smart_planning_date', 'tip:smart:date', {});
            }
        }
        catch (err) {
            this.logger.warn(`smartPlanningDateTip failed: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
    async resolveTypes(weddingId, types, recipientId) {
        if (!types.length)
            return;
        try {
            if (recipientId) {
                await this.prisma.$executeRaw `
          UPDATE notifications SET resolved_at = ${utcTs()}::timestamp
          WHERE wedding_id = ${weddingId} AND recipient_id = ${recipientId}
            AND type = ANY(${types}) AND read_at IS NULL AND resolved_at IS NULL
        `;
            }
            else {
                await this.prisma.$executeRaw `
          UPDATE notifications SET resolved_at = ${utcTs()}::timestamp
          WHERE wedding_id = ${weddingId}
            AND type = ANY(${types}) AND read_at IS NULL AND resolved_at IS NULL
        `;
            }
        }
        catch (err) {
            this.logger.warn(`resolveTypes failed: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
    async resolveTask(weddingId, taskId) {
        try {
            await this.prisma.$executeRaw `
        UPDATE notifications SET resolved_at = ${utcTs()}::timestamp
        WHERE wedding_id = ${weddingId}
          AND payload->>'taskId' = ${taskId}
          AND type IN ('deadline_early', 'deadline_late', 'deadline_today', 'task_overdue')
          AND read_at IS NULL AND resolved_at IS NULL
      `;
        }
        catch (err) {
            this.logger.warn(`resolveTask failed: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
    async list(userId, offset = 0, limit = 5) {
        const since = new Date(Date.now() - notification_logic_1.HISTORY_DAYS * 24 * 60 * 60 * 1000);
        const take = Math.min(Math.max(limit, 1), 50);
        const skip = Math.max(offset, 0);
        const rows = await this.prisma.$queryRaw `
      SELECT * FROM notifications
      WHERE recipient_id = ${userId} AND resolved_at IS NULL AND updated_at >= ${utcTs(since)}::timestamp
      ORDER BY updated_at DESC, id DESC
      OFFSET ${skip} LIMIT ${take + 1}
    `.catch(() => []);
        const unreadCount = await this.unreadCount(userId);
        const page = rows.slice(0, take);
        return {
            items: await this.renderRows(page),
            unreadCount,
            hasMore: rows.length > take,
        };
    }
    async unreadCount(userId) {
        const since = new Date(Date.now() - notification_logic_1.HISTORY_DAYS * 24 * 60 * 60 * 1000);
        const rows = await this.prisma.$queryRaw `
      SELECT COUNT(*)::int AS n FROM notifications
      WHERE recipient_id = ${userId} AND resolved_at IS NULL AND read_at IS NULL
        AND updated_at >= ${utcTs(since)}::timestamp
    `.catch(() => [{ n: 0 }]);
        return Number(rows[0]?.n ?? 0);
    }
    async markRead(userId, id) {
        const changed = await this.prisma.$executeRaw `
      UPDATE notifications SET read_at = COALESCE(read_at, ${utcTs()}::timestamp)
      WHERE id = ${id} AND recipient_id = ${userId}
    `;
        if (!changed)
            throw new common_1.NotFoundException('Сповіщення не знайдено');
        return { ok: true, unreadCount: await this.unreadCount(userId) };
    }
    async markAllRead(userId) {
        await this.prisma.$executeRaw `
      UPDATE notifications SET read_at = ${utcTs()}::timestamp
      WHERE recipient_id = ${userId} AND read_at IS NULL AND resolved_at IS NULL
    `;
        return { ok: true, unreadCount: 0 };
    }
    async renderRows(rows) {
        const byWedding = new Map();
        for (const row of rows) {
            const actorId = row.payload?.actorId;
            if (!actorId)
                continue;
            const list = byWedding.get(row.wedding_id) ?? [];
            list.push(actorId);
            byWedding.set(row.wedding_id, list);
        }
        const actors = new Map();
        for (const [weddingId, ids] of byWedding) {
            for (const [id, actor] of await this.getActors(weddingId, ids))
                actors.set(id, actor);
        }
        const out = [];
        for (const row of rows) {
            if (!isNotificationType(row.type))
                continue;
            const payload = row.payload ?? {};
            const rendered = (0, notification_catalog_1.renderNotification)({
                type: row.type,
                count: row.count,
                payload,
                actor: payload.actorId ? actors.get(payload.actorId) ?? null : null,
            });
            out.push({
                ...rendered,
                id: row.id,
                type: row.type,
                createdAt: row.created_at.toISOString(),
                updatedAt: row.updated_at.toISOString(),
                isRead: Boolean(row.read_at),
                ...(payload.taskId ? { taskId: payload.taskId } : {}),
            });
        }
        return out;
    }
    async deliver(userId, weddingId, input) {
        const settings = await this.getSettings(userId);
        if (!settings.channels.push && !settings.channels.email)
            return;
        const actors = input.payload.actorId
            ? await this.getActors(weddingId, [input.payload.actorId])
            : new Map();
        const rendered = (0, notification_catalog_1.renderNotification)({
            ...input,
            actor: input.payload.actorId ? actors.get(input.payload.actorId) ?? null : null,
        });
        const body = (0, notification_catalog_1.plainText)(rendered.segments);
        const primary = rendered.actions.find((a) => a.href) ?? null;
        await Promise.all([
            settings.channels.push
                ? this.sendPush(userId, {
                    title: 'fata.studio',
                    body,
                    data: { type: input.type, href: rendered.href },
                })
                : Promise.resolve(),
            settings.channels.email
                ? this.sendEmail(userId, {
                    subject: body.length > 90 ? `${body.slice(0, 87)}…` : body,
                    body,
                    ctaLabel: primary?.label ?? 'Відкрити fata.studio',
                    ctaPath: primary?.href ?? rendered.href,
                })
                : Promise.resolve(),
        ]);
    }
    async sendPush(userId, payload) {
        const devices = await this.prisma.pushDevice.findMany({
            where: { userId },
        });
        if (!devices.length)
            return { sent: 0 };
        const messages = devices.map((d) => ({
            to: d.token,
            title: payload.title,
            body: payload.body,
            data: payload.data,
            sound: 'default',
        }));
        return this.sendExpo(messages);
    }
    async sendEmail(userId, payload) {
        const shouldSend = Boolean(process.env.SMTP_HOST?.trim()) || process.env.EMAIL_LOG === '1';
        if (!shouldSend)
            return { emailed: 0 };
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, name: true },
        });
        if (!user?.email)
            return { emailed: 0 };
        const ctaPath = payload.ctaPath;
        const ctaUrl = ctaPath
            ? ctaPath.startsWith('http')
                ? ctaPath
                : `${this.email.webUrl}${ctaPath.startsWith('/') ? '' : '/'}${ctaPath}`
            : undefined;
        const rendered = this.email.renderSimple({
            title: payload.subject,
            body: payload.body,
            ctaLabel: payload.ctaLabel,
            ctaUrl,
        });
        const result = await this.email.send({
            to: user.email,
            subject: payload.subject,
            text: rendered.text,
            html: rendered.html,
        });
        return { emailed: result.sent || result.dryRun ? 1 : 0 };
    }
    async sendExpo(messages) {
        if (!messages.length)
            return { sent: 0 };
        try {
            const res = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messages),
            });
            if (!res.ok) {
                this.logger.warn(`Expo push failed: ${res.status}`);
                return { sent: 0 };
            }
            return { sent: messages.length };
        }
        catch (err) {
            this.logger.warn(`Expo push error: ${err instanceof Error ? err.message : String(err)}`);
            return { sent: 0 };
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map