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
const vendor_budget_sync_1 = require("../budget/vendor-budget-sync");
let FavoritesService = class FavoritesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPipeline(userId) {
        const manual = await this.prisma.externalVendor.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
        return { manual };
    }
    async createExternal(userId, dto) {
        const wedding = await this.prisma.wedding.findUnique({
            where: { userId },
            select: { city: true },
        });
        const vendor = await this.prisma.externalVendor.create({
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
        await (0, vendor_budget_sync_1.syncBudgetItemForExternalVendor)(this.prisma, userId, vendor);
        return vendor;
    }
    async updateExternal(userId, id, dto) {
        await this.assertExternalOwner(userId, id);
        const vendor = await this.prisma.externalVendor.update({
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
        await (0, vendor_budget_sync_1.syncBudgetItemForExternalVendor)(this.prisma, userId, vendor);
        return vendor;
    }
    async removeExternal(userId, id) {
        await this.assertExternalOwner(userId, id);
        await (0, vendor_budget_sync_1.removeBudgetItemForExternalVendor)(this.prisma, id);
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