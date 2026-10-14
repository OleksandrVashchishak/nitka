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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayPlanService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const email_service_1 = require("../email/email.service");
const prisma_service_1 = require("../prisma/prisma.service");
const wedding_access_1 = require("../weddings/wedding-access");
const day_plan_access_1 = require("./day-plan-access");
let DayPlanService = class DayPlanService {
    constructor(prisma, email) {
        this.prisma = prisma;
        this.email = email;
    }
    async getMine(userId) {
        const { wedding, level } = await (0, day_plan_access_1.requireDayPlanAccess)(this.prisma, userId, 'view', 'Спочатку створи весілля в кабінеті');
        const row = await this.prisma.wedding.findUnique({
            where: { id: wedding.id },
            select: { dayPlan: true },
        });
        const events = this.parseEvents(row?.dayPlan);
        return {
            weddingId: wedding.id,
            access: level,
            events: events === null ? null : this.sortEvents(events),
        };
    }
    async upsert(userId, dto) {
        const { wedding } = await (0, day_plan_access_1.requireDayPlanAccess)(this.prisma, userId, 'edit', 'Спочатку створи весілля в кабінеті');
        return this.writeEvents(wedding.id, dto);
    }
    async upsertByShareToken(userId, token, dto) {
        const { wedding } = await (0, day_plan_access_1.requireDayPlanEditByShareToken)(this.prisma, userId, token);
        return this.writeEvents(wedding.id, dto);
    }
    async getPublicByToken(token) {
        const share = await this.prisma.dayPlanShare.findUnique({
            where: { token },
            include: {
                wedding: {
                    select: {
                        id: true,
                        date: true,
                        dayPlan: true,
                        partnerOneName: true,
                        partnerTwoName: true,
                    },
                },
            },
        });
        if (!share)
            throw new common_1.NotFoundException('Посилання недійсне');
        const events = this.parseEvents(share.wedding.dayPlan);
        return {
            token: share.token,
            weddingId: share.wedding.id,
            date: share.wedding.date,
            partnerOneName: share.wedding.partnerOneName,
            partnerTwoName: share.wedding.partnerTwoName,
            events: events === null ? [] : this.sortEvents(events),
        };
    }
    async getSharedAccess(userId, token) {
        const share = await this.prisma.dayPlanShare.findUnique({
            where: { token },
            select: { id: true, weddingId: true },
        });
        if (!share)
            throw new common_1.NotFoundException('Посилання недійсне');
        if (!userId) {
            return { access: null, canEdit: false };
        }
        const member = await this.prisma.weddingMember.findFirst({
            where: { weddingId: share.weddingId, userId },
        });
        if (member) {
            return { access: 'EDIT', canEdit: true };
        }
        const owned = await this.prisma.wedding.findFirst({
            where: { id: share.weddingId, userId },
        });
        if (owned) {
            return { access: 'EDIT', canEdit: true };
        }
        const grant = await this.prisma.dayPlanShareGrant.findFirst({
            where: {
                shareId: share.id,
                userId,
                acceptedAt: { not: null },
            },
        });
        if (!grant) {
            return { access: null, canEdit: false };
        }
        return {
            access: grant.access,
            canEdit: grant.access === client_1.DayPlanShareAccess.EDIT,
        };
    }
    async getShare(userId) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId, 'Спочатку створи весілля в кабінеті');
        const share = await this.ensureShare(wedding.id);
        const people = await this.buildSharePeople(wedding.id, share.id);
        return {
            token: share.token,
            path: `/day-plan/shared/${share.token}`,
            people,
        };
    }
    async invite(userId, dto) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId, 'Спочатку створи весілля в кабінеті');
        const email = dto.email.trim().toLowerCase();
        if (!email)
            throw new common_1.BadRequestException('Вкажи email');
        const share = await this.ensureShare(wedding.id);
        const existing = await this.prisma.dayPlanShareGrant.findUnique({
            where: {
                shareId_email: { shareId: share.id, email },
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Ця людина вже має доступ');
        }
        const linkedUser = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true },
        });
        const name = linkedUser?.name?.trim() || this.displayNameFromEmail(email);
        const grant = await this.prisma.dayPlanShareGrant.create({
            data: {
                shareId: share.id,
                email,
                name,
                access: dto.access,
                userId: linkedUser?.id ?? null,
            },
        });
        const invitePath = `/day-plan/invite/${grant.inviteToken}`;
        const inviteUrl = `${this.email.webUrl}${invitePath}`;
        const accessLabel = dto.access === client_1.DayPlanShareAccess.EDIT
            ? 'редагувати'
            : 'переглядати';
        const rendered = this.email.renderSimple({
            title: 'Запрошення до плану дня',
            body: `Тебе запросили ${accessLabel} план весільного дня у fata.studio.`,
            ctaLabel: 'Відкрити запрошення',
            ctaUrl: inviteUrl,
        });
        await this.email.send({
            to: email,
            subject: 'Запрошення до плану дня — fata.studio',
            text: rendered.text,
            html: rendered.html,
        });
        return {
            token: share.token,
            path: `/day-plan/shared/${share.token}`,
            people: await this.buildSharePeople(wedding.id, share.id),
            invitePath,
        };
    }
    async updateGrant(userId, grantId, dto) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId, 'Спочатку створи весілля в кабінеті');
        const share = await this.ensureShare(wedding.id);
        const grant = await this.prisma.dayPlanShareGrant.findFirst({
            where: { id: grantId, shareId: share.id },
        });
        if (!grant)
            throw new common_1.NotFoundException('Доступ не знайдено');
        await this.prisma.dayPlanShareGrant.update({
            where: { id: grant.id },
            data: { access: dto.access },
        });
        return {
            token: share.token,
            path: `/day-plan/shared/${share.token}`,
            people: await this.buildSharePeople(wedding.id, share.id),
        };
    }
    async revokeGrant(userId, grantId) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId, 'Спочатку створи весілля в кабінеті');
        const share = await this.ensureShare(wedding.id);
        const grant = await this.prisma.dayPlanShareGrant.findFirst({
            where: { id: grantId, shareId: share.id },
        });
        if (!grant)
            throw new common_1.NotFoundException('Доступ не знайдено');
        await this.prisma.dayPlanShareGrant.delete({ where: { id: grant.id } });
        return {
            token: share.token,
            path: `/day-plan/shared/${share.token}`,
            people: await this.buildSharePeople(wedding.id, share.id),
        };
    }
    async getInvitePreview(inviteToken) {
        const grant = await this.prisma.dayPlanShareGrant.findUnique({
            where: { inviteToken },
            include: {
                share: {
                    include: {
                        wedding: {
                            select: {
                                date: true,
                                partnerOneName: true,
                                partnerTwoName: true,
                                user: { select: { name: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!grant)
            throw new common_1.NotFoundException('Запрошення недійсне');
        const partners = [
            grant.share.wedding.partnerOneName,
            grant.share.wedding.partnerTwoName,
        ]
            .map((n) => n.trim())
            .filter(Boolean);
        return {
            inviteToken: grant.inviteToken,
            email: grant.email,
            name: grant.name,
            access: grant.access,
            accepted: Boolean(grant.acceptedAt),
            shareToken: grant.share.token,
            date: grant.share.wedding.date,
            coupleName: partners.length > 0
                ? partners.join(' & ')
                : grant.share.wedding.user.name,
        };
    }
    async acceptInvite(userId, inviteToken) {
        const grant = await this.prisma.dayPlanShareGrant.findUnique({
            where: { inviteToken },
            include: { share: true },
        });
        if (!grant)
            throw new common_1.NotFoundException('Запрошення недійсне');
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Користувача не знайдено');
        if (user.email.toLowerCase() !== grant.email.toLowerCase()) {
            throw new common_1.BadRequestException('Увійди з email, на який надіслали запрошення');
        }
        const updated = await this.prisma.dayPlanShareGrant.update({
            where: { id: grant.id },
            data: {
                userId: user.id,
                name: user.name.trim() || grant.name,
                acceptedAt: grant.acceptedAt ?? new Date(),
            },
        });
        return {
            shareToken: grant.share.token,
            access: updated.access,
            path: `/day-plan/shared/${grant.share.token}`,
        };
    }
    async writeEvents(weddingId, dto) {
        const events = this.sortEvents(dto.events.map((e) => ({
            id: e.id,
            title: e.title.trim(),
            time: e.time,
            durationMin: e.durationMin,
        })));
        await this.prisma.wedding.update({
            where: { id: weddingId },
            data: {
                dayPlan: events,
            },
        });
        return { weddingId, events };
    }
    async ensureShare(weddingId) {
        return this.prisma.dayPlanShare.upsert({
            where: { weddingId },
            create: { weddingId },
            update: {},
        });
    }
    async buildSharePeople(weddingId, shareId) {
        const members = await this.prisma.weddingMember.findMany({
            where: { weddingId },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        const owned = await this.prisma.wedding.findUnique({
            where: { id: weddingId },
            select: {
                userId: true,
                partnerOneName: true,
                partnerTwoName: true,
                user: { select: { id: true, name: true, email: true } },
            },
        });
        const memberRows = members.map((m) => ({
            id: `member-${m.id}`,
            kind: 'member',
            name: m.user.name.trim() || m.user.email,
            email: m.user.email,
            access: 'EDIT',
            locked: true,
        }));
        if (owned &&
            !memberRows.some((r) => r.email === owned.user.email)) {
            memberRows.unshift({
                id: `owner-${owned.userId}`,
                kind: 'member',
                name: owned.user.name.trim() ||
                    owned.partnerOneName.trim() ||
                    owned.user.email,
                email: owned.user.email,
                access: 'EDIT',
                locked: true,
            });
        }
        const grants = await this.prisma.dayPlanShareGrant.findMany({
            where: { shareId },
            include: {
                user: { select: { name: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        const grantRows = grants.map((g) => ({
            id: g.id,
            kind: 'grant',
            name: g.user?.name?.trim() || g.name,
            email: g.email,
            access: g.access,
            locked: false,
            accepted: Boolean(g.acceptedAt),
        }));
        return [...memberRows, ...grantRows];
    }
    displayNameFromEmail(email) {
        const local = email.split('@')[0] ?? email;
        return local
            .split(/[._-]+/)
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    }
    parseEvents(value) {
        if (value === null || value === undefined)
            return null;
        if (!Array.isArray(value))
            return null;
        const events = [];
        for (const item of value) {
            if (!item || typeof item !== 'object')
                continue;
            const row = item;
            if (typeof row.id !== 'string' ||
                typeof row.title !== 'string' ||
                typeof row.time !== 'string' ||
                typeof row.durationMin !== 'number') {
                continue;
            }
            events.push({
                id: row.id,
                title: row.title,
                time: row.time,
                durationMin: row.durationMin,
            });
        }
        return events;
    }
    sortEvents(events) {
        return [...events].sort((a, b) => a.time.localeCompare(b.time));
    }
};
exports.DayPlanService = DayPlanService;
exports.DayPlanService = DayPlanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], DayPlanService);
//# sourceMappingURL=day-plan.service.js.map