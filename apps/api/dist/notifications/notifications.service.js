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
const common_1 = require("@nestjs/common");
const email_service_1 = require("../email/email.service");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(prisma, email) {
        this.prisma = prisma;
        this.email = email;
        this.logger = new common_1.Logger(NotificationsService_1.name);
        this.dueTimer = null;
    }
    onModuleInit() {
        const hour = 60 * 60 * 1000;
        this.dueTimer = setInterval(() => {
            void this.sendDueTaskReminders().catch((err) => this.logger.warn(`due reminders failed: ${err instanceof Error ? err.message : String(err)}`));
        }, hour);
        setTimeout(() => {
            void this.sendDueTaskReminders().catch(() => undefined);
        }, 45_000);
    }
    onModuleDestroy() {
        if (this.dueTimer)
            clearInterval(this.dueTimer);
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
    async notifyUser(userId, payload) {
        const [pushResult, emailResult] = await Promise.all([
            this.sendPush(userId, payload),
            this.sendEmail(userId, payload),
        ]);
        return { sent: pushResult.sent, emailed: emailResult.emailed };
    }
    async notifyWeddingMembers(weddingId, payload, excludeUserId) {
        const wedding = await this.prisma.wedding.findUnique({
            where: { id: weddingId },
            select: {
                userId: true,
                members: { select: { userId: true } },
            },
        });
        if (!wedding)
            return { sent: 0, emailed: 0 };
        const ids = new Set([
            wedding.userId,
            ...wedding.members.map((m) => m.userId),
        ]);
        if (excludeUserId)
            ids.delete(excludeUserId);
        let sent = 0;
        let emailed = 0;
        for (const id of ids) {
            const res = await this.notifyUser(id, payload);
            sent += res.sent;
            emailed += res.emailed;
        }
        return { sent, emailed };
    }
    async sendDueTaskReminders() {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + 2);
        const tasks = await this.prisma.$queryRaw `
      SELECT id, title, due_date, wedding_id
      FROM tasks
      WHERE status <> 'DONE'
        AND due_date IS NOT NULL
        AND due_date >= ${start}
        AND due_date < ${end}
        AND (due_reminded_at IS NULL OR due_reminded_at < ${start})
      LIMIT 200
    `;
        let sent = 0;
        const dayMs = 24 * 60 * 60 * 1000;
        for (const task of tasks) {
            const due = new Date(task.due_date);
            const dueDay = due.toLocaleDateString('uk-UA');
            const isToday = due >= start && due < new Date(start.getTime() + dayMs);
            const res = await this.notifyWeddingMembers(task.wedding_id, {
                title: isToday ? 'Дедлайн сьогодні' : 'Дедлайн завтра',
                body: `${task.title} · до ${dueDay}`,
                data: { type: 'task_due', taskId: task.id },
                email: {
                    ctaLabel: 'Відкрити чекліст',
                    ctaPath: '/checklist',
                },
            });
            sent += res.sent;
            await this.prisma.$executeRaw `
        UPDATE tasks SET due_reminded_at = ${new Date()} WHERE id = ${task.id}
      `;
        }
        if (tasks.length) {
            this.logger.log(`Due reminders: ${tasks.length} tasks, ${sent} pushes`);
        }
        return { tasks: tasks.length, sent };
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
        const subject = payload.email?.subject || payload.title;
        const body = payload.email?.body || payload.body;
        const ctaPath = payload.email?.ctaPath;
        const ctaUrl = ctaPath
            ? `${this.email.webUrl}${ctaPath.startsWith('/') ? '' : '/'}${ctaPath}`
            : undefined;
        const rendered = this.email.renderSimple({
            title: subject,
            body,
            ctaLabel: payload.email?.ctaLabel,
            ctaUrl,
        });
        const result = await this.email.send({
            to: user.email,
            subject,
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