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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("../email/email.service");
const prisma_service_1 = require("../prisma/prisma.service");
let ContactService = class ContactService {
    constructor(prisma, email) {
        this.prisma = prisma;
        this.email = email;
    }
    create(dto) {
        return this.prisma.contactMessage.create({
            data: {
                name: dto.name.trim(),
                email: dto.email.trim().toLowerCase(),
                message: dto.message.trim(),
            },
            select: { id: true },
        });
    }
    async list(params) {
        const page = Math.max(1, params?.page ?? 1);
        const limit = Math.min(100, Math.max(1, params?.limit ?? 50));
        const skip = (page - 1) * limit;
        const [total, unread, items] = await Promise.all([
            this.prisma.contactMessage.count(),
            this.prisma.contactMessage.count({ where: { readAt: null } }),
            this.prisma.contactMessage.findMany({
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
        ]);
        return { page, limit, total, unread, items };
    }
    async markRead(id) {
        const existing = await this.prisma.contactMessage.findUnique({
            where: { id },
            select: { id: true, readAt: true },
        });
        if (!existing)
            throw new common_1.NotFoundException('Повідомлення не знайдено');
        if (existing.readAt)
            return existing;
        return this.prisma.contactMessage.update({
            where: { id },
            data: { readAt: new Date() },
        });
    }
    async setStatus(id, status) {
        await this.requireMessage(id);
        return this.prisma.contactMessage.update({
            where: { id },
            data: { status },
        });
    }
    async reply(id, body) {
        const msg = await this.requireMessage(id);
        const text = body.trim();
        const { html } = this.email.renderSimple({
            title: 'Відповідь від fata.studio',
            body: text,
        });
        const result = await this.email.send({
            to: msg.email,
            subject: 'Відповідь від fata.studio',
            text: `${text}\n\n— fata.studio`,
            html,
        });
        if (!result.sent && !result.dryRun) {
            throw new common_1.BadGatewayException('Не вдалося надіслати лист');
        }
        const updated = await this.prisma.contactMessage.update({
            where: { id },
            data: {
                replyBody: text,
                repliedAt: new Date(),
                readAt: msg.readAt ?? new Date(),
                status: 'CLOSED',
            },
        });
        return { message: updated, dryRun: result.dryRun };
    }
    async requireMessage(id) {
        const existing = await this.prisma.contactMessage.findUnique({
            where: { id },
        });
        if (!existing)
            throw new common_1.NotFoundException('Повідомлення не знайдено');
        return existing;
    }
    async remove(id) {
        const existing = await this.prisma.contactMessage.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!existing)
            throw new common_1.NotFoundException('Повідомлення не знайдено');
        await this.prisma.contactMessage.delete({ where: { id } });
        return { ok: true };
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], ContactService);
//# sourceMappingURL=contact.service.js.map