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
exports.InvitationsService = exports.INVITATION_TEMPLATES = void 0;
exports.normalizeInvitationContent = normalizeInvitationContent;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const wedding_access_1 = require("../weddings/wedding-access");
const TEMPLATE_IDS = new Set(['sage-linen', 'midnight-frame', 'meadow']);
exports.INVITATION_TEMPLATES = [
    {
        id: 'sage-linen',
        name: 'Sage Linen',
        description: 'Мʼякий шавлія + чиста типографіка',
    },
    {
        id: 'midnight-frame',
        name: 'Midnight Frame',
        description: 'Темна рамка й акцентний шрифт',
    },
    {
        id: 'meadow',
        name: 'Meadow',
        description: 'Світлий ботанічний вайб',
    },
];
function defaultContent(input) {
    return {
        headline: input?.coupleName || 'Імена пари',
        opener: 'Запрошуємо розділити наш день',
        body: 'Будемо раді бачити вас на нашому весіллі.',
        dateLabel: input?.dateLabel || '',
        timeLabel: '16:00',
        venue: '',
        address: input?.city || '',
        dressCode: '',
        rsvpNote: 'Будь ласка, підтвердіть участь.',
        coverImageUrl: '',
        showWebsiteLink: true,
    };
}
function asRecord(value) {
    return value && typeof value === 'object' && !Array.isArray(value)
        ? value
        : {};
}
function normalizeInvitationContent(raw, fallback) {
    const base = { ...defaultContent(), ...fallback };
    const data = asRecord(raw);
    return {
        headline: String(data.headline ?? base.headline),
        opener: String(data.opener ?? base.opener),
        body: String(data.body ?? base.body),
        dateLabel: String(data.dateLabel ?? base.dateLabel),
        timeLabel: String(data.timeLabel ?? base.timeLabel),
        venue: String(data.venue ?? base.venue),
        address: String(data.address ?? base.address),
        dressCode: String(data.dressCode ?? base.dressCode),
        rsvpNote: String(data.rsvpNote ?? base.rsvpNote),
        coverImageUrl: String(data.coverImageUrl ?? base.coverImageUrl),
        showWebsiteLink: Boolean(data.showWebsiteLink ?? base.showWebsiteLink ?? true),
    };
}
function coupleName(wedding) {
    const partners = [wedding.partnerOneName, wedding.partnerTwoName]
        .map((name) => name.trim())
        .filter(Boolean);
    if (partners.length > 0)
        return partners.join(' і ');
    return wedding.user?.name?.trim() || 'Пара';
}
function dateLabelUk(date) {
    return new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}
let InvitationsService = class InvitationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMine(userId) {
        const access = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId);
        const full = await this.prisma.wedding.findUniqueOrThrow({
            where: { id: access.wedding.id },
            include: {
                invitation: true,
                website: { select: { slug: true, published: true } },
                user: { select: { name: true } },
                guestList: {
                    select: { id: true, name: true, inviteToken: true, rsvpStatus: true },
                    orderBy: { name: 'asc' },
                    take: 8,
                },
                _count: { select: { guestList: true } },
            },
        });
        const names = coupleName(full);
        const content = normalizeInvitationContent(full.invitation?.content, {
            headline: names,
            dateLabel: dateLabelUk(full.date),
            address: full.city,
        });
        return {
            invitation: {
                templateId: full.invitation?.templateId ?? 'sage-linen',
                content,
                updatedAt: full.invitation?.updatedAt ?? null,
            },
            wedding: {
                id: full.id,
                date: full.date,
                city: full.city,
                coupleName: names,
            },
            website: full.website?.published && full.website.slug
                ? { slug: full.website.slug, url: `/w/${full.website.slug}` }
                : null,
            guestsPreview: full.guestList,
            guestsTotal: full._count.guestList,
            templates: exports.INVITATION_TEMPLATES,
        };
    }
    async upsertMine(userId, dto) {
        const access = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId);
        const full = await this.prisma.wedding.findUniqueOrThrow({
            where: { id: access.wedding.id },
            include: {
                invitation: true,
                user: { select: { name: true } },
            },
        });
        if (dto.templateId && !TEMPLATE_IDS.has(dto.templateId)) {
            throw new common_1.BadRequestException('Невідомий темплейт запрошення');
        }
        const names = coupleName(full);
        const nextContent = normalizeInvitationContent(dto.content ?? full.invitation?.content, {
            headline: names,
            dateLabel: dateLabelUk(full.date),
            address: full.city,
        });
        const templateId = dto.templateId ?? full.invitation?.templateId ?? 'sage-linen';
        const invitation = full.invitation
            ? await this.prisma.weddingInvitation.update({
                where: { weddingId: full.id },
                data: {
                    templateId,
                    content: nextContent,
                },
            })
            : await this.prisma.weddingInvitation.create({
                data: {
                    weddingId: full.id,
                    templateId,
                    content: nextContent,
                },
            });
        return {
            invitation: {
                templateId: invitation.templateId,
                content: normalizeInvitationContent(invitation.content),
                updatedAt: invitation.updatedAt,
            },
            templates: exports.INVITATION_TEMPLATES,
        };
    }
    async getDesignForWedding(weddingId) {
        const row = await this.prisma.weddingInvitation.findUnique({
            where: { weddingId },
        });
        return {
            templateId: row?.templateId ?? 'sage-linen',
            content: normalizeInvitationContent(row?.content),
        };
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map