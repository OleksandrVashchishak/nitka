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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const favoriteInclude = {
    vendor: {
        include: {
            category: true,
            photos: { orderBy: { order: 'asc' }, take: 1 },
        },
    },
};
let FavoritesService = class FavoritesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(userId) {
        return this.prisma.favorite.findMany({
            where: { userId },
            include: favoriteInclude,
            orderBy: { updatedAt: 'desc' },
        });
    }
    async add(userId, vendorId) {
        const vendor = await this.prisma.vendor.findFirst({
            where: { id: vendorId, status: 'APPROVED' },
        });
        if (!vendor) {
            throw new common_1.NotFoundException('Підрядника не знайдено');
        }
        try {
            return await this.prisma.favorite.create({
                data: { userId, vendorId },
                include: favoriteInclude,
            });
        }
        catch {
            throw new common_1.ConflictException('Вже в обраному');
        }
    }
    async remove(userId, vendorId) {
        const favorite = await this.prisma.favorite.findUnique({
            where: { userId_vendorId: { userId, vendorId } },
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Немає в обраному');
        }
        await this.prisma.favorite.delete({
            where: { userId_vendorId: { userId, vendorId } },
        });
        return { ok: true };
    }
    async getPipeline(userId) {
        const [catalog, manual] = await Promise.all([
            this.prisma.favorite.findMany({
                where: { userId },
                include: favoriteInclude,
                orderBy: { updatedAt: 'desc' },
            }),
            this.prisma.externalVendor.findMany({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
            }),
        ]);
        return { catalog, manual };
    }
    async updatePipeline(userId, vendorId, dto) {
        const favorite = await this.prisma.favorite.findUnique({
            where: { userId_vendorId: { userId, vendorId } },
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Спочатку збережи підрядника');
        }
        return this.prisma.favorite.update({
            where: { id: favorite.id },
            data: {
                ...(dto.stage !== undefined ? { stage: dto.stage } : {}),
                ...(dto.quotedPrice !== undefined
                    ? { quotedPrice: dto.quotedPrice }
                    : {}),
                ...(dto.notes !== undefined
                    ? { notes: dto.notes?.trim() || null }
                    : {}),
            },
            include: favoriteInclude,
        });
    }
    async createExternal(userId, dto) {
        const wedding = await this.prisma.wedding.findUnique({
            where: { userId },
            select: { city: true },
        });
        return this.prisma.externalVendor.create({
            data: {
                userId,
                name: dto.name.trim(),
                category: dto.category.trim(),
                city: dto.city?.trim() || wedding?.city || '',
                phone: dto.phone?.trim() || null,
                website: dto.website?.trim() || null,
                quotedPrice: dto.quotedPrice ?? null,
                notes: dto.notes?.trim() || null,
                stage: dto.stage,
            },
        });
    }
    async updateExternal(userId, id, dto) {
        await this.assertExternalOwner(userId, id);
        return this.prisma.externalVendor.update({
            where: { id },
            data: {
                ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
                ...(dto.category !== undefined
                    ? { category: dto.category.trim() }
                    : {}),
                ...(dto.city !== undefined ? { city: dto.city.trim() } : {}),
                ...(dto.phone !== undefined
                    ? { phone: dto.phone?.trim() || null }
                    : {}),
                ...(dto.website !== undefined
                    ? { website: dto.website?.trim() || null }
                    : {}),
                ...(dto.quotedPrice !== undefined
                    ? { quotedPrice: dto.quotedPrice }
                    : {}),
                ...(dto.notes !== undefined
                    ? { notes: dto.notes?.trim() || null }
                    : {}),
                ...(dto.stage !== undefined ? { stage: dto.stage } : {}),
            },
        });
    }
    async removeExternal(userId, id) {
        await this.assertExternalOwner(userId, id);
        await this.prisma.externalVendor.delete({ where: { id } });
        return { ok: true };
    }
    async assertExternalOwner(userId, id) {
        const vendor = await this.prisma.externalVendor.findUnique({
            where: { id },
            select: { userId: true },
        });
        if (!vendor)
            throw new common_1.NotFoundException('Підрядника не знайдено');
        if (vendor.userId !== userId)
            throw new common_1.ForbiddenException();
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map