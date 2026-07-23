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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const DEMO_REVIEWS = [
    {
        vendorEmail: 'photo.kyiv@demo.local',
        reviewerEmail: 'couple@test.local',
        reviewerName: 'Марія і Андрій',
        rating: 5,
        text: 'Дуже спокійна зйомка, фото вийшли живі і теплі. Рекомендуємо!',
    },
    {
        vendorEmail: 'venue.lviv@demo.local',
        reviewerEmail: 'couple@test.local',
        reviewerName: 'Марія і Андрій',
        rating: 5,
        text: 'Локація казкова, команда все тримала під контролем до пізнього вечора.',
    },
    {
        vendorEmail: 'dj.odesa@demo.local',
        reviewerEmail: 'reviewer2@demo.local',
        reviewerName: 'Катя і Саша',
        rating: 4,
        text: 'Танцпол не зупинявся. Трохи гучніше на церемонії, але загалом супер.',
    },
    {
        vendorEmail: 'decor.kyiv@demo.local',
        reviewerEmail: 'reviewer2@demo.local',
        reviewerName: 'Катя і Саша',
        rating: 5,
        text: 'Квіти і декор саме в нашому стилі. Гості досі згадують столи.',
    },
];
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        for (const demo of DEMO_REVIEWS) {
            const vendorUser = await this.prisma.user.findUnique({
                where: { email: demo.vendorEmail },
                include: { vendor: true },
            });
            if (!vendorUser?.vendor)
                continue;
            let reviewer = await this.prisma.user.findUnique({
                where: { email: demo.reviewerEmail },
            });
            if (!reviewer) {
                reviewer = await this.prisma.user.create({
                    data: {
                        email: demo.reviewerEmail,
                        name: demo.reviewerName,
                        password: 'seed-reviewer',
                        role: 'COUPLE',
                    },
                });
            }
            const existing = await this.prisma.review.findUnique({
                where: {
                    userId_vendorId: {
                        userId: reviewer.id,
                        vendorId: vendorUser.vendor.id,
                    },
                },
            });
            if (existing)
                continue;
            await this.prisma.review.create({
                data: {
                    userId: reviewer.id,
                    vendorId: vendorUser.vendor.id,
                    rating: demo.rating,
                    text: demo.text,
                },
            });
            await this.recalcVendorRating(vendorUser.vendor.id);
        }
    }
    async recalcVendorRating(vendorId) {
        const agg = await this.prisma.review.aggregate({
            where: { vendorId },
            _avg: { rating: true },
            _count: { rating: true },
        });
        await this.prisma.vendor.update({
            where: { id: vendorId },
            data: {
                rating: agg._count.rating
                    ? Math.round((agg._avg.rating ?? 0) * 10) / 10
                    : 0,
            },
        });
    }
    listByVendor(vendorId) {
        return this.prisma.review.findMany({
            where: { vendorId },
            include: {
                user: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(userId, dto) {
        const vendor = await this.prisma.vendor.findFirst({
            where: { id: dto.vendorId, status: 'APPROVED' },
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Підрядника не знайдено');
        }
        try {
            const review = await this.prisma.review.create({
                data: {
                    userId,
                    vendorId: dto.vendorId,
                    rating: dto.rating,
                    text: dto.text.trim(),
                },
                include: {
                    user: { select: { id: true, name: true } },
                },
            });
            await this.recalcVendorRating(dto.vendorId);
            return review;
        }
        catch {
            throw new common_1.ConflictException('Ти вже залишив відгук цьому підряднику');
        }
    }
    async update(userId, reviewId, dto) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review || review.userId !== userId) {
            throw new common_1.NotFoundException('Відгук не знайдено');
        }
        const updated = await this.prisma.review.update({
            where: { id: reviewId },
            data: {
                rating: dto.rating,
                text: dto.text.trim(),
            },
            include: {
                user: { select: { id: true, name: true } },
            },
        });
        await this.recalcVendorRating(review.vendorId);
        return updated;
    }
    async remove(userId, reviewId) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review || review.userId !== userId) {
            throw new common_1.NotFoundException('Відгук не знайдено');
        }
        await this.prisma.review.delete({ where: { id: reviewId } });
        await this.recalcVendorRating(review.vendorId);
        return { ok: true };
    }
    async mineForVendor(userId, vendorId) {
        return this.prisma.review.findUnique({
            where: {
                userId_vendorId: { userId, vendorId },
            },
            include: {
                user: { select: { id: true, name: true } },
            },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map