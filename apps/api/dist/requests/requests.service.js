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
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const requestIncludeCouple = {
    vendor: {
        include: {
            category: true,
            photos: { orderBy: { order: 'asc' }, take: 1 },
        },
    },
    messages: {
        include: {
            author: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'asc' },
    },
};
const requestIncludeVendor = {
    user: { select: { id: true, name: true, email: true } },
    messages: {
        include: {
            author: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'asc' },
    },
};
let RequestsService = class RequestsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const vendor = await this.prisma.vendor.findFirst({
            where: { id: dto.vendorId, status: 'APPROVED' },
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Підрядника не знайдено');
        }
        const request = await this.prisma.request.create({
            data: {
                userId,
                vendorId: dto.vendorId,
                eventDate: new Date(dto.eventDate),
                city: dto.city.trim(),
                guests: dto.guests,
                budget: dto.budget,
                message: dto.message.trim(),
            },
            include: requestIncludeCouple,
        });
        await this.prisma.favorite.upsert({
            where: { userId_vendorId: { userId, vendorId: dto.vendorId } },
            create: {
                userId,
                vendorId: dto.vendorId,
                stage: 'CONTACTED',
            },
            update: { stage: 'CONTACTED' },
        });
        return request;
    }
    listMine(userId) {
        return this.prisma.request.findMany({
            where: { userId },
            include: requestIncludeCouple,
            orderBy: { createdAt: 'desc' },
        });
    }
    async listForVendor(userId) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { userId },
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Профіль підрядника не знайдено');
        }
        return this.prisma.request.findMany({
            where: { vendorId: vendor.id },
            include: requestIncludeVendor,
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(userId, requestId, status) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { userId },
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Профіль підрядника не знайдено');
        }
        const request = await this.prisma.request.findUnique({
            where: { id: requestId },
        });
        if (!request || request.vendorId !== vendor.id) {
            throw new common_1.ForbiddenException();
        }
        return this.prisma.request.update({
            where: { id: requestId },
            data: { status },
            include: requestIncludeVendor,
        });
    }
    async addMessage(userId, userRole, requestId, dto) {
        const request = await this.prisma.request.findUnique({
            where: { id: requestId },
            include: { vendor: true },
        });
        if (!request) {
            throw new common_1.NotFoundException('Заявку не знайдено');
        }
        const isCouple = (userRole === client_1.Role.COUPLE || userRole === client_1.Role.ADMIN) &&
            request.userId === userId;
        const isVendor = (userRole === client_1.Role.VENDOR || userRole === client_1.Role.ADMIN) &&
            request.vendor.userId === userId;
        if (!isCouple && !isVendor) {
            throw new common_1.ForbiddenException();
        }
        const authorRole = isVendor ? client_1.Role.VENDOR : client_1.Role.COUPLE;
        const phone = dto.phone?.trim() || null;
        await this.prisma.requestMessage.create({
            data: {
                requestId,
                authorId: userId,
                authorRole,
                body: dto.body.trim(),
                phone,
            },
        });
        const nextStatus = isVendor && request.status === 'NEW'
            ? client_1.RequestStatus.CONTACTED
            : undefined;
        if (nextStatus) {
            await this.prisma.request.update({
                where: { id: requestId },
                data: { status: nextStatus },
            });
        }
        else {
            await this.prisma.request.update({
                where: { id: requestId },
                data: { updatedAt: new Date() },
            });
        }
        if (isVendor) {
            return this.prisma.request.findUniqueOrThrow({
                where: { id: requestId },
                include: requestIncludeVendor,
            });
        }
        return this.prisma.request.findUniqueOrThrow({
            where: { id: requestId },
            include: requestIncludeCouple,
        });
    }
    async vendorDashboard(userId) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { userId },
            include: { category: true },
        });
        if (!vendor) {
            return null;
        }
        const now = new Date();
        const start7 = new Date(now);
        start7.setDate(start7.getDate() - 6);
        start7.setHours(0, 0, 0, 0);
        const start30 = new Date(now);
        start30.setDate(start30.getDate() - 29);
        start30.setHours(0, 0, 0, 0);
        const [requestsCount, favoritesCount, newRequests, viewsTotal, views7d, views30d, recentViews] = await Promise.all([
            this.prisma.request.count({ where: { vendorId: vendor.id } }),
            this.prisma.favorite.count({ where: { vendorId: vendor.id } }),
            this.prisma.request.count({
                where: { vendorId: vendor.id, status: 'NEW' },
            }),
            this.prisma.vendorView.count({ where: { vendorId: vendor.id } }),
            this.prisma.vendorView.count({
                where: { vendorId: vendor.id, createdAt: { gte: start7 } },
            }),
            this.prisma.vendorView.count({
                where: { vendorId: vendor.id, createdAt: { gte: start30 } },
            }),
            this.prisma.vendorView.findMany({
                where: { vendorId: vendor.id, createdAt: { gte: start7 } },
                select: { createdAt: true },
            }),
        ]);
        const byDay = new Map();
        for (let i = 0; i < 7; i++) {
            const d = new Date(start7);
            d.setDate(start7.getDate() + i);
            byDay.set(d.toISOString().slice(0, 10), 0);
        }
        for (const view of recentViews) {
            const key = view.createdAt.toISOString().slice(0, 10);
            if (byDay.has(key)) {
                byDay.set(key, (byDay.get(key) || 0) + 1);
            }
        }
        return {
            vendor,
            stats: {
                views: viewsTotal,
                views7d,
                views30d,
                viewsSeries: [...byDay.entries()].map(([date, count]) => ({
                    date,
                    count,
                })),
                requests: requestsCount,
                favorites: favoritesCount,
                newRequests,
            },
        };
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map