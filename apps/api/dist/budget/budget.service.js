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
exports.BudgetService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const wedding_access_1 = require("../weddings/wedding-access");
const DEFAULT_ITEMS = [
    { category: 'venue', title: 'Локація / оренда', share: 0.18 },
    { category: 'catering', title: 'Кейтеринг / банкет', share: 0.28 },
    { category: 'photo', title: 'Фото', share: 0.07 },
    { category: 'video', title: 'Відео', share: 0.05 },
    { category: 'music', title: 'Музика / DJ', share: 0.05 },
    { category: 'host', title: 'Ведучий', share: 0.04 },
    { category: 'decor', title: 'Декор і квіти', share: 0.08 },
    { category: 'cake', title: 'Торт', share: 0.03 },
    { category: 'beauty', title: 'Beauty', share: 0.03 },
    { category: 'attire', title: 'Одяг пари', share: 0.07 },
    { category: 'rings', title: 'Обручки', share: 0.03 },
    { category: 'transport', title: 'Транспорт', share: 0.02 },
    { category: 'docs', title: 'РАЦС / документи', share: 0.01 },
    { category: 'gifts', title: 'Подарунки близьким', share: 0.02 },
    { category: 'honeymoon', title: 'Медовий місяць', share: 0.02 },
    { category: 'reserve', title: 'Резерв', share: 0.02 },
];
let BudgetService = class BudgetService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWeddingForUser(userId) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId, 'Спочатку створи весілля в кабінеті (дата / бюджет)');
        return wedding;
    }
    buildSummary(totalBudget, items) {
        const estimated = items.reduce((sum, i) => sum + i.estimated, 0);
        const actual = items.reduce((sum, i) => sum + i.actual, 0);
        const paid = items.reduce((sum, i) => sum + (i.paid ? i.actual : 0), 0);
        const remaining = totalBudget - actual;
        return {
            totalBudget,
            estimated,
            actual,
            paid,
            remaining,
            estimatedDiff: totalBudget - estimated,
            progress: totalBudget > 0
                ? Math.min(100, Math.round((actual / totalBudget) * 100))
                : 0,
        };
    }
    groupByCategory(items) {
        const map = new Map();
        for (const item of items) {
            const current = map.get(item.category) ?? {
                category: item.category,
                estimated: 0,
                actual: 0,
                items: [],
            };
            current.estimated += item.estimated;
            current.actual += item.actual;
            current.items.push(item);
            map.set(item.category, current);
        }
        return [...map.values()].sort((a, b) => a.category.localeCompare(b.category));
    }
    async syncDefaults(weddingId, totalBudget) {
        const count = await this.prisma.budgetItem.count({
            where: { weddingId },
        });
        if (count > 0)
            return;
        await this.prisma.budgetItem.createMany({
            data: DEFAULT_ITEMS.map((item) => ({
                weddingId,
                category: item.category,
                title: item.title,
                estimated: Math.round(totalBudget * item.share),
                actual: 0,
                paid: false,
            })),
        });
    }
    async getMine(userId) {
        const wedding = await this.getWeddingForUser(userId);
        await this.syncDefaults(wedding.id, wedding.budget);
        const items = await this.prisma.budgetItem.findMany({
            where: { weddingId: wedding.id },
            orderBy: [{ category: 'asc' }, { createdAt: 'asc' }],
        });
        return {
            wedding: {
                id: wedding.id,
                date: wedding.date,
                city: wedding.city,
                budget: wedding.budget,
            },
            summary: this.buildSummary(wedding.budget, items),
            categories: this.groupByCategory(items),
            items,
        };
    }
    async updatePlan(userId, budget) {
        const wedding = await this.getWeddingForUser(userId);
        await this.prisma.wedding.update({
            where: { id: wedding.id },
            data: { budget },
        });
        return this.getMine(userId);
    }
    async createItem(userId, dto) {
        const wedding = await this.getWeddingForUser(userId);
        await this.prisma.budgetItem.create({
            data: {
                weddingId: wedding.id,
                category: dto.category.trim().toLowerCase(),
                title: dto.title.trim(),
                estimated: dto.estimated,
                actual: dto.actual ?? 0,
                paid: dto.paid ?? false,
                notes: dto.notes?.trim() || null,
            },
        });
        return this.getMine(userId);
    }
    async updateItem(userId, itemId, dto) {
        const wedding = await this.getWeddingForUser(userId);
        const item = await this.prisma.budgetItem.findFirst({
            where: { id: itemId, weddingId: wedding.id },
        });
        if (!item) {
            throw new common_1.NotFoundException('Статтю бюджету не знайдено');
        }
        await this.prisma.budgetItem.update({
            where: { id: itemId },
            data: {
                ...(dto.category !== undefined
                    ? { category: dto.category.trim().toLowerCase() }
                    : {}),
                ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
                ...(dto.estimated !== undefined ? { estimated: dto.estimated } : {}),
                ...(dto.actual !== undefined ? { actual: dto.actual } : {}),
                ...(dto.paid !== undefined ? { paid: dto.paid } : {}),
                ...(dto.notes !== undefined
                    ? { notes: dto.notes?.trim() || null }
                    : {}),
            },
        });
        return this.getMine(userId);
    }
    async removeItem(userId, itemId) {
        const wedding = await this.getWeddingForUser(userId);
        const item = await this.prisma.budgetItem.findFirst({
            where: { id: itemId, weddingId: wedding.id },
        });
        if (!item) {
            throw new common_1.NotFoundException('Статтю бюджету не знайдено');
        }
        await this.prisma.budgetItem.delete({ where: { id: itemId } });
        return this.getMine(userId);
    }
};
exports.BudgetService = BudgetService;
exports.BudgetService = BudgetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BudgetService);
//# sourceMappingURL=budget.service.js.map