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
exports.WeddingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const wedding_access_1 = require("./wedding-access");
const DEFAULT_TASKS = [
    { title: 'Обрати дату весілля', categorySlug: 'date' },
    { title: 'Знайти та зберегти локації', categorySlug: 'venue' },
    { title: 'Визначити вайб весілля', categorySlug: 'vibe' },
    { title: 'Почати список гостей', categorySlug: 'guests' },
    { title: 'Скласти бюджет', categorySlug: 'budget' },
    { title: 'Знайти фотографа', categorySlug: 'photo' },
    { title: 'Обрати запрошення', categorySlug: 'invitations' },
    { title: 'Знайти музику / DJ', categorySlug: 'music' },
    { title: 'Знайти кейтеринг', categorySlug: 'catering' },
    { title: 'Почати весільний сайт', categorySlug: 'website' },
    { title: 'Скласти список подарунків', categorySlug: 'registry' },
    { title: 'Обрати флористику та декор', categorySlug: 'decor' },
    { title: 'Знайти ведучого церемонії', categorySlug: 'officiant' },
    { title: 'Запланувати beauty-проби', categorySlug: 'beauty' },
    { title: 'Познайомитись з організаторами', categorySlug: 'planner' },
    { title: 'Обрати образи та обручки', categorySlug: 'attire' },
    { title: 'Надіслати запрошення гостям', categorySlug: 'invite-guests' },
    { title: 'Спробувати й обрати торт', categorySlug: 'cake' },
    { title: 'Скласти фінальний шортліст', categorySlug: 'favorites' },
    { title: 'Зібрати всі RSVP', categorySlug: 'rsvp' },
    { title: 'Фіналізувати деталі дня', categorySlug: 'requests' },
    { title: 'Одружитися!', categorySlug: 'married' },
];
const TASK_ORDER = { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] };
const MEMBER_INCLUDE = {
    user: { select: { id: true, name: true, email: true } },
};
let WeddingsService = class WeddingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async loadWeddingWithMeta(weddingId, userId) {
        const wedding = await this.prisma.wedding.findUnique({
            where: { id: weddingId },
            include: {
                tasks: TASK_ORDER,
                members: { include: MEMBER_INCLUDE, orderBy: { createdAt: 'asc' } },
            },
        });
        if (!wedding)
            return null;
        const me = wedding.members.find((m) => m.userId === userId);
        return {
            ...wedding,
            myRole: me?.role ?? client_1.WeddingMemberRole.OWNER,
        };
    }
    async getMine(userId) {
        const access = await (0, wedding_access_1.resolveWeddingForUser)(this.prisma, userId);
        if (!access)
            return null;
        await this.syncDefaultTasks(access.wedding.id);
        return this.loadWeddingWithMeta(access.wedding.id, userId);
    }
    async getInsights(userId) {
        const access = await (0, wedding_access_1.resolveWeddingForUser)(this.prisma, userId);
        if (!access)
            return null;
        const wedding = await this.prisma.wedding.findUnique({
            where: { id: access.wedding.id },
            include: {
                tasks: true,
                budgetItems: true,
                guestList: { select: { rsvpStatus: true } },
            },
        });
        if (!wedding)
            return null;
        const [favorites, requests, vendors, favoriteStages, manualStages] = await Promise.all([
            this.prisma.favorite.findMany({
                where: { userId },
                select: { vendorId: true },
            }),
            this.prisma.request.findMany({
                where: { userId },
                select: { vendorId: true },
            }),
            this.prisma.vendor.findMany({
                where: { status: 'APPROVED' },
                include: {
                    category: true,
                    photos: { orderBy: { order: 'asc' }, take: 1 },
                    _count: { select: { reviews: true } },
                },
            }),
            this.prisma.favorite.groupBy({
                by: ['stage'],
                where: { userId },
                _count: { _all: true },
            }),
            this.prisma.externalVendor.groupBy({
                by: ['stage'],
                where: { userId },
                _count: { _all: true },
            }),
        ]);
        const cityVendors = vendors.filter((vendor) => vendor.city.trim().toLocaleLowerCase('uk-UA') ===
            wedding.city.trim().toLocaleLowerCase('uk-UA'));
        const priceGroups = new Map();
        for (const vendor of cityVendors) {
            const current = priceGroups.get(vendor.category.slug) ?? {
                slug: vendor.category.slug,
                name: vendor.category.name,
                prices: [],
            };
            current.prices.push(Math.round((vendor.priceFrom + (vendor.priceTo ?? vendor.priceFrom)) / 2));
            priceGroups.set(vendor.category.slug, current);
        }
        const marketPrices = [...priceGroups.values()]
            .map((group) => ({
            category: group.slug,
            label: group.name,
            average: Math.round(group.prices.reduce((sum, value) => sum + value, 0) /
                group.prices.length),
            vendorsCount: group.prices.length,
        }))
            .sort((a, b) => b.vendorsCount - a.vendorsCount);
        const cityPrices = marketPrices.flatMap((item) => Array.from({ length: item.vendorsCount }, () => item.average));
        const cityAverage = cityPrices.length > 0
            ? Math.round(cityPrices.reduce((sum, value) => sum + value, 0) /
                cityPrices.length)
            : 0;
        const excluded = new Set([
            ...favorites.map((item) => item.vendorId),
            ...requests.map((item) => item.vendorId),
        ]);
        const incompleteCategories = wedding.tasks
            .filter((task) => task.status !== client_1.TaskStatus.DONE && task.categorySlug)
            .map((task) => task.categorySlug);
        const categoryPriority = new Map(incompleteCategories.map((slug, index) => [slug, index]));
        const recommendations = cityVendors.length === 0
            ? []
            : vendors
                .filter((vendor) => !excluded.has(vendor.id))
                .sort((a, b) => {
                const aCity = a.city === wedding.city ? 1 : 0;
                const bCity = b.city === wedding.city ? 1 : 0;
                if (aCity !== bCity)
                    return bCity - aCity;
                const aPriority = categoryPriority.get(a.category.slug) ?? 999;
                const bPriority = categoryPriority.get(b.category.slug) ?? 999;
                if (aPriority !== bPriority)
                    return aPriority - bPriority;
                if (a.featured !== b.featured)
                    return Number(b.featured) - Number(a.featured);
                return b.rating - a.rating;
            })
                .slice(0, 4)
                .map((vendor) => ({
                ...vendor,
                reason: vendor.city === wedding.city
                    ? `${vendor.category.name} у вашому місті`
                    : `Сильний варіант у категорії «${vendor.category.name}»`,
            }));
        const actual = wedding.budgetItems.reduce((sum, item) => sum + item.actual, 0);
        const estimated = wedding.budgetItems.reduce((sum, item) => sum + item.estimated, 0);
        const paid = wedding.budgetItems.reduce((sum, item) => sum + (item.paid ? item.actual : 0), 0);
        const stages = ['SAVED', 'CONTACTED', 'MET', 'COMPARED', 'CHOSEN'];
        const pipelineCounts = Object.fromEntries(stages.map((stage) => [stage, 0]));
        for (const row of [...favoriteStages, ...manualStages]) {
            pipelineCounts[row.stage] += row._count._all;
        }
        const planDone = wedding.tasks.filter((task) => task.status === client_1.TaskStatus.DONE).length;
        const planTotal = wedding.tasks.length;
        const rsvp = {
            total: wedding.guestList.length,
            yes: wedding.guestList.filter((g) => g.rsvpStatus === 'YES').length,
            no: wedding.guestList.filter((g) => g.rsvpStatus === 'NO').length,
            maybe: wedding.guestList.filter((g) => g.rsvpStatus === 'MAYBE').length,
            pending: wedding.guestList.filter((g) => g.rsvpStatus === 'PENDING')
                .length,
        };
        return {
            city: wedding.city,
            plan: {
                done: planDone,
                total: planTotal,
                progress: planTotal > 0 ? Math.round((planDone / planTotal) * 100) : 0,
                inProgress: wedding.tasks.filter((task) => task.status === client_1.TaskStatus.IN_PROGRESS).length,
            },
            rsvp,
            market: {
                average: cityAverage,
                vendorsCount: cityVendors.length,
                categories: marketPrices,
            },
            budget: {
                total: wedding.budget,
                perGuest: wedding.guests > 0
                    ? Math.round(wedding.budget / wedding.guests)
                    : wedding.budget,
                estimated,
                actual,
                paid,
                remaining: wedding.budget - actual,
            },
            pipeline: {
                total: Object.values(pipelineCounts).reduce((sum, value) => sum + value, 0),
                counts: pipelineCounts,
            },
            recommendations,
        };
    }
    async upsert(userId, dto) {
        const access = await (0, wedding_access_1.resolveWeddingForUser)(this.prisma, userId);
        if (access) {
            await this.prisma.wedding.update({
                where: { id: access.wedding.id },
                data: {
                    date: new Date(dto.date),
                    city: dto.city.trim(),
                    guests: dto.guests,
                    budget: dto.budget,
                    ...(dto.partnerOneName !== undefined
                        ? { partnerOneName: dto.partnerOneName.trim() }
                        : {}),
                    ...(dto.partnerTwoName !== undefined
                        ? { partnerTwoName: dto.partnerTwoName.trim() }
                        : {}),
                    ...(dto.couplePhotoUrl !== undefined
                        ? { couplePhotoUrl: dto.couplePhotoUrl?.trim() || null }
                        : {}),
                    ...(dto.planningStage !== undefined
                        ? { planningStage: dto.planningStage }
                        : {}),
                    ...(dto.cityUndecided !== undefined
                        ? { cityUndecided: dto.cityUndecided }
                        : {}),
                    ...(dto.guestsUndecided !== undefined
                        ? { guestsUndecided: dto.guestsUndecided }
                        : {}),
                },
            });
            await this.syncDefaultTasks(access.wedding.id);
            return this.getMine(userId);
        }
        const wedding = await this.prisma.wedding.create({
            data: {
                userId,
                date: new Date(dto.date),
                city: dto.city.trim(),
                guests: dto.guests,
                budget: dto.budget,
                partnerOneName: dto.partnerOneName?.trim() || '',
                partnerTwoName: dto.partnerTwoName?.trim() || '',
                couplePhotoUrl: dto.couplePhotoUrl?.trim() || null,
                planningStage: dto.planningStage ?? 'EXPLORING',
                cityUndecided: dto.cityUndecided ?? false,
                guestsUndecided: dto.guestsUndecided ?? false,
                tasks: {
                    create: DEFAULT_TASKS.map((task, index) => ({
                        title: task.title,
                        categorySlug: task.categorySlug,
                        sortOrder: index,
                        isCustom: false,
                        status: client_1.TaskStatus.TODO,
                    })),
                },
                members: {
                    create: {
                        userId,
                        role: client_1.WeddingMemberRole.OWNER,
                    },
                },
            },
            include: { tasks: TASK_ORDER },
        });
        return this.loadWeddingWithMeta(wedding.id, userId);
    }
    async createPartnerInvite(userId) {
        const { wedding } = await (0, wedding_access_1.requireWeddingOwner)(this.prisma, userId);
        const partnerCount = await this.prisma.weddingMember.count({
            where: { weddingId: wedding.id, role: client_1.WeddingMemberRole.PARTNER },
        });
        if (partnerCount >= 1) {
            throw new common_1.BadRequestException('Партнер уже доданий до цього весілля');
        }
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 14);
        const invite = await this.prisma.weddingInvite.create({
            data: {
                weddingId: wedding.id,
                expiresAt,
            },
        });
        return {
            token: invite.token,
            expiresAt: invite.expiresAt,
            path: `/partner-invite/${invite.token}`,
        };
    }
    async getPartnerInvitePreview(token) {
        const invite = await this.prisma.weddingInvite.findUnique({
            where: { token },
            include: {
                wedding: {
                    select: {
                        city: true,
                        date: true,
                        partnerOneName: true,
                        partnerTwoName: true,
                        user: { select: { name: true } },
                    },
                },
            },
        });
        if (!invite || invite.acceptedAt) {
            throw new common_1.NotFoundException('Запрошення недійсне');
        }
        if (invite.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Термін запрошення минув');
        }
        const partners = [
            invite.wedding.partnerOneName,
            invite.wedding.partnerTwoName,
        ]
            .map((n) => n.trim())
            .filter(Boolean);
        return {
            token: invite.token,
            expiresAt: invite.expiresAt,
            city: invite.wedding.city,
            date: invite.wedding.date,
            coupleName: partners.length > 0
                ? partners.join(' & ')
                : invite.wedding.user.name,
        };
    }
    async acceptPartnerInvite(userId, token) {
        const invite = await this.prisma.weddingInvite.findUnique({
            where: { token },
        });
        if (!invite || invite.acceptedAt) {
            throw new common_1.NotFoundException('Запрошення недійсне');
        }
        if (invite.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Термін запрошення минув');
        }
        const existingAccess = await (0, wedding_access_1.resolveWeddingForUser)(this.prisma, userId);
        if (existingAccess) {
            if (existingAccess.wedding.id === invite.weddingId) {
                return this.getMine(userId);
            }
            throw new common_1.BadRequestException('У тебе вже є весілля. Один акаунт — одне весілля.');
        }
        const partnerExists = await this.prisma.weddingMember.findFirst({
            where: {
                weddingId: invite.weddingId,
                role: client_1.WeddingMemberRole.PARTNER,
            },
        });
        if (partnerExists) {
            throw new common_1.BadRequestException('Партнер уже приєднався');
        }
        if (invite.weddingId) {
            const owner = await this.prisma.wedding.findUnique({
                where: { id: invite.weddingId },
                select: { userId: true },
            });
            if (owner?.userId === userId) {
                throw new common_1.BadRequestException('Це твоє весілля');
            }
        }
        await this.prisma.$transaction([
            this.prisma.weddingMember.create({
                data: {
                    weddingId: invite.weddingId,
                    userId,
                    role: client_1.WeddingMemberRole.PARTNER,
                },
            }),
            this.prisma.weddingInvite.update({
                where: { id: invite.id },
                data: {
                    acceptedAt: new Date(),
                    acceptedBy: userId,
                },
            }),
        ]);
        return this.getMine(userId);
    }
    async createTask(userId, dto) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId, 'Спочатку збережіть весілля');
        const maxOrder = await this.prisma.task.aggregate({
            where: { weddingId: wedding.id },
            _max: { sortOrder: true },
        });
        return this.prisma.task.create({
            data: {
                weddingId: wedding.id,
                title: dto.title.trim(),
                categorySlug: dto.categorySlug?.trim() || null,
                sortOrder: dto.sortOrder ?? (maxOrder._max.sortOrder ?? 0) + 1,
                isCustom: true,
                status: client_1.TaskStatus.TODO,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
            },
        });
    }
    async updateTask(userId, taskId, dto) {
        const task = await this.requireMemberTask(userId, taskId);
        if (dto.title !== undefined && !task.isCustom) {
            throw new common_1.BadRequestException('Назву шаблонної задачі змінити не можна');
        }
        return this.prisma.task.update({
            where: { id: taskId },
            data: {
                ...(dto.status !== undefined ? { status: dto.status } : {}),
                ...(dto.dueDate !== undefined
                    ? { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }
                    : {}),
                ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
            },
        });
    }
    async deleteTask(userId, taskId) {
        const task = await this.requireMemberTask(userId, taskId);
        if (!task.isCustom) {
            throw new common_1.BadRequestException('Шаблонну задачу видалити не можна');
        }
        await this.prisma.task.delete({ where: { id: taskId } });
        return { ok: true };
    }
    async requireMemberTask(userId, taskId) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: { wedding: true },
        });
        if (!task) {
            throw new common_1.NotFoundException('Задачу не знайдено');
        }
        const access = await (0, wedding_access_1.resolveWeddingForUser)(this.prisma, userId);
        if (!access || access.wedding.id !== task.weddingId) {
            throw new common_1.ForbiddenException();
        }
        return task;
    }
    async syncDefaultTasks(weddingId) {
        const existing = await this.prisma.task.findMany({
            where: { weddingId },
        });
        for (const [index, def] of DEFAULT_TASKS.entries()) {
            const found = existing.find((task) => !task.isCustom &&
                (task.categorySlug === def.categorySlug || task.title === def.title));
            if (!found) {
                await this.prisma.task.create({
                    data: {
                        weddingId,
                        title: def.title,
                        categorySlug: def.categorySlug,
                        sortOrder: index,
                        isCustom: false,
                        status: client_1.TaskStatus.TODO,
                    },
                });
                continue;
            }
            if (found.categorySlug !== def.categorySlug ||
                found.title !== def.title ||
                found.sortOrder !== index) {
                await this.prisma.task.update({
                    where: { id: found.id },
                    data: {
                        categorySlug: def.categorySlug,
                        title: def.title,
                        sortOrder: index,
                        isCustom: false,
                    },
                });
            }
        }
    }
};
exports.WeddingsService = WeddingsService;
exports.WeddingsService = WeddingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WeddingsService);
//# sourceMappingURL=weddings.service.js.map