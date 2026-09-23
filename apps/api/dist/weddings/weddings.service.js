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
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const wedding_access_1 = require("./wedding-access");
const DEFAULT_TASKS = [
    { title: 'Побудувати список завдань', categorySlug: 'starter-plan' },
    { title: 'Додати гостей', categorySlug: 'starter-guests' },
    { title: 'Внести витрати', categorySlug: 'starter-budget' },
];
const TASK_ORDER = { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] };
const MEMBER_INCLUDE = {
    user: { select: { id: true, name: true, email: true } },
};
let WeddingsService = class WeddingsService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
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
        const tasks = await this.attachTaskAssignees(weddingId, wedding.tasks);
        return {
            ...wedding,
            tasks,
            myRole: me?.role ?? client_1.WeddingMemberRole.OWNER,
        };
    }
    async attachTaskAssignees(weddingId, tasks) {
        if (tasks.length === 0)
            return tasks.map((task) => ({ ...task, assignee: null }));
        try {
            const rows = await this.prisma.$queryRaw `
        SELECT id, assignee FROM tasks WHERE wedding_id = ${weddingId}
      `;
            const map = new Map(rows.map((row) => [row.id, row.assignee]));
            return tasks.map((task) => ({
                ...task,
                assignee: map.get(task.id) ?? null,
            }));
        }
        catch {
            return tasks.map((task) => ({ ...task, assignee: null }));
        }
    }
    async setTaskAssignee(taskId, assignee) {
        await this.prisma.$executeRaw `
      UPDATE tasks SET assignee = ${assignee} WHERE id = ${taskId}
    `;
    }
    async taskWithAssignee(task) {
        const [enriched] = await this.attachTaskAssignees(task.weddingId, [task]);
        return enriched;
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
        const manualStages = await this.prisma.externalVendor.groupBy({
            by: ['stage'],
            where: { userId },
            _count: { _all: true },
        });
        const actual = wedding.budgetItems.reduce((sum, item) => sum + item.actual, 0);
        const estimated = wedding.budgetItems.reduce((sum, item) => sum + item.estimated, 0);
        const paid = wedding.budgetItems.reduce((sum, item) => {
            if (item.paid)
                return sum + (item.actual || item.estimated);
            return sum + (item.actual || 0);
        }, 0);
        const stages = ['SAVED', 'CONTACTED', 'MET', 'COMPARED', 'CHOSEN'];
        const pipelineCounts = Object.fromEntries(stages.map((stage) => [stage, 0]));
        for (const row of manualStages) {
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
        };
    }
    async upsert(userId, dto) {
        const access = await (0, wedding_access_1.resolveWeddingForUser)(this.prisma, userId);
        if (access) {
            const prev = access.wedding;
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
            const changed = prev.date.toISOString().slice(0, 10) !== dto.date.slice(0, 10) ||
                prev.city !== dto.city.trim() ||
                prev.guests !== dto.guests ||
                prev.budget !== dto.budget ||
                (dto.partnerOneName !== undefined &&
                    prev.partnerOneName !== dto.partnerOneName.trim()) ||
                (dto.partnerTwoName !== undefined &&
                    prev.partnerTwoName !== dto.partnerTwoName.trim()) ||
                (dto.cityUndecided !== undefined &&
                    prev.cityUndecided !== dto.cityUndecided) ||
                (dto.guestsUndecided !== undefined &&
                    prev.guestsUndecided !== dto.guestsUndecided);
            if (changed) {
                void this.notifications.notifyWeddingMembers(access.wedding.id, {
                    title: 'Партнер оновив весілля',
                    body: 'Змінилися деталі — глянь у кабінеті',
                    data: { type: 'wedding_update' },
                }, userId);
            }
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
        const created = await this.prisma.task.create({
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
        if (dto.assignee) {
            try {
                await this.setTaskAssignee(created.id, dto.assignee);
            }
            catch {
            }
        }
        return this.taskWithAssignee(created);
    }
    async updateTask(userId, taskId, dto) {
        const task = await this.requireMemberTask(userId, taskId);
        if (dto.title !== undefined && !task.isCustom) {
            throw new common_1.BadRequestException('Назву шаблонної задачі змінити не можна');
        }
        const updated = await this.prisma.task.update({
            where: { id: taskId },
            data: {
                ...(dto.status !== undefined ? { status: dto.status } : {}),
                ...(dto.dueDate !== undefined
                    ? { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }
                    : {}),
                ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
            },
        });
        if (dto.assignee !== undefined) {
            try {
                await this.setTaskAssignee(taskId, dto.assignee);
            }
            catch {
            }
        }
        return this.taskWithAssignee(updated);
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
        if (existing.length > 0) {
            for (const [index, def] of DEFAULT_TASKS.entries()) {
                const found = existing.find((task) => !task.isCustom && task.categorySlug === def.categorySlug);
                if (found &&
                    (found.title !== def.title || found.sortOrder !== index)) {
                    await this.prisma.task.update({
                        where: { id: found.id },
                        data: {
                            title: def.title,
                            sortOrder: index,
                        },
                    });
                }
            }
            return;
        }
        await this.prisma.task.createMany({
            data: DEFAULT_TASKS.map((task, index) => ({
                weddingId,
                title: task.title,
                categorySlug: task.categorySlug,
                sortOrder: index,
                isCustom: false,
                status: client_1.TaskStatus.TODO,
            })),
        });
    }
};
exports.WeddingsService = WeddingsService;
exports.WeddingsService = WeddingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], WeddingsService);
//# sourceMappingURL=weddings.service.js.map