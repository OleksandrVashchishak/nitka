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
const email_service_1 = require("../email/email.service");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const task_assignee_1 = require("./task-assignee");
const wedding_access_1 = require("./wedding-access");
const DEFAULT_TASKS = [
    {
        title: 'Побудувати список завдань',
        categorySlug: 'starter-plan',
    },
    {
        title: 'Додати гостей',
        categorySlug: 'starter-guests',
    },
    {
        title: 'Внести витрати',
        categorySlug: 'starter-budget',
    },
];
const TASK_ORDER = { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] };
const MEMBER_INCLUDE = {
    user: { select: { id: true, name: true, email: true } },
};
let WeddingsService = class WeddingsService {
    constructor(prisma, notifications, email) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.email = email;
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
            dateUndecided: await this.readDateUndecided(weddingId),
            tasks,
            myRole: me?.role ?? client_1.WeddingMemberRole.OWNER,
        };
    }
    async attachTaskAssignees(weddingId, tasks) {
        if (tasks.length === 0) {
            return tasks.map((task) => ({
                ...task,
                assignee: null,
                assigneeName: null,
            }));
        }
        try {
            const rows = await this.prisma.$queryRaw `
        SELECT id, assignee FROM tasks WHERE wedding_id = ${weddingId}
      `;
            const map = new Map(rows.map((row) => [row.id, row.assignee]));
            const meta = await this.readTaskPlanMeta(weddingId);
            return tasks.map((task) => {
                const parsed = (0, task_assignee_1.parseTaskAssignee)(map.get(task.id) ?? null);
                const m = meta.get(task.id);
                return {
                    ...task,
                    assignee: parsed.assignee,
                    assigneeName: parsed.assigneeName,
                    templateId: m?.template_id ?? null,
                    source: m?.source ?? null,
                    isUrgent: m?.is_urgent ?? false,
                };
            });
        }
        catch {
            return tasks.map((task) => ({
                ...task,
                assignee: null,
                assigneeName: null,
                templateId: null,
                source: null,
                isUrgent: false,
            }));
        }
    }
    async readTaskPlanMeta(weddingId) {
        try {
            const rows = await this.prisma.$queryRaw `
        SELECT id, template_id, source, is_urgent FROM tasks WHERE wedding_id = ${weddingId}
      `;
            return new Map(rows.map((row) => [row.id, row]));
        }
        catch {
            return new Map();
        }
    }
    async setTaskAssignee(taskId, assignee) {
        await this.prisma.$executeRaw `
      UPDATE tasks SET assignee = ${assignee} WHERE id = ${taskId}
    `;
    }
    async readDateUndecided(weddingId) {
        try {
            const rows = await this.prisma.$queryRaw `SELECT date_undecided FROM weddings WHERE id = ${weddingId}`;
            return Boolean(rows[0]?.date_undecided);
        }
        catch {
            return false;
        }
    }
    async writeDateUndecided(weddingId, value) {
        try {
            await this.prisma.$executeRaw `
        UPDATE weddings SET date_undecided = ${value} WHERE id = ${weddingId}
      `;
        }
        catch {
        }
    }
    async notifyTaskAssigned(weddingId, actorId, task, assignee) {
        const members = await this.notifications.getMembers(weddingId);
        if (!members)
            return;
        const target = assignee === 'owner'
            ? members.ownerId
            : assignee === 'partner'
                ? members.partnerId
                : null;
        if (!target || target === actorId)
            return;
        await this.notifications.direct(weddingId, target, 'task_assigned', `task_assigned:${task.id}:${Date.now()}`, { actorId, taskId: task.id, taskTitle: task.title });
    }
    async readTaskAssigneeRaw(taskId) {
        try {
            const rows = await this.prisma.$queryRaw `
        SELECT assignee FROM tasks WHERE id = ${taskId} LIMIT 1
      `;
            return rows[0]?.assignee ?? null;
        }
        catch {
            return null;
        }
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
            if (dto.dateUndecided !== undefined) {
                const wasUndecided = await this.readDateUndecided(access.wedding.id);
                await this.writeDateUndecided(access.wedding.id, dto.dateUndecided);
                if (wasUndecided && !dto.dateUndecided) {
                    void this.onWeddingDateSet(access.wedding.id);
                }
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
        if (dto.dateUndecided)
            await this.writeDateUndecided(wedding.id, true);
        return this.loadWeddingWithMeta(wedding.id, userId);
    }
    async createPartnerInvite(userId, partnerEmail) {
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
        const path = `/partner-invite/${invite.token}`;
        let emailed = false;
        if (partnerEmail) {
            const inviter = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { name: true },
            });
            const rendered = this.email.renderSimple({
                title: 'Вас запрошують планувати весілля разом',
                body: `${inviter?.name?.trim() || 'Ваш партнер'} запрошує вас до спільного кабінету весілля у fata.studio. Посилання діє 14 днів.`,
                ctaLabel: 'Прийняти запрошення',
                ctaUrl: `${this.email.webUrl}${path}`,
            });
            const result = await this.email.send({
                to: partnerEmail.trim().toLowerCase(),
                subject: 'Запрошення до весілля — fata.studio',
                text: rendered.text,
                html: rendered.html,
            });
            emailed = result.sent || result.dryRun;
        }
        return {
            token: invite.token,
            expiresAt: invite.expiresAt,
            path,
            emailed,
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
        const partnerOne = invite.wedding.partnerOneName.trim();
        const partnerTwo = invite.wedding.partnerTwoName.trim();
        const partners = [partnerOne, partnerTwo].filter(Boolean);
        const inviterName = partnerOne || invite.wedding.user.name.trim();
        const inviteeName = partnerTwo;
        return {
            token: invite.token,
            expiresAt: invite.expiresAt,
            city: invite.wedding.city,
            date: invite.wedding.date,
            coupleName: partners.length > 0
                ? partners.join(' & ')
                : invite.wedding.user.name,
            inviterName,
            inviteeName,
        };
    }
    async removePartner(userId) {
        const { wedding } = await (0, wedding_access_1.requireWeddingOwner)(this.prisma, userId);
        const partner = await this.prisma.weddingMember.findFirst({
            where: {
                weddingId: wedding.id,
                role: client_1.WeddingMemberRole.PARTNER,
            },
        });
        if (!partner) {
            throw new common_1.NotFoundException('Партнера не знайдено');
        }
        await this.prisma.$transaction([
            this.prisma.weddingMember.delete({ where: { id: partner.id } }),
            this.prisma.weddingInvite.deleteMany({
                where: {
                    weddingId: wedding.id,
                    acceptedAt: null,
                },
            }),
        ]);
        return this.getMine(userId);
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
        const owner = await this.prisma.wedding.findUnique({
            where: { id: invite.weddingId },
            select: { userId: true },
        });
        if (owner) {
            void this.notifications.direct(invite.weddingId, owner.userId, 'partner_joined', `partner_joined:${userId}`, { actorId: userId });
        }
        void this.notifications.resolveTypes(invite.weddingId, ['setup_partner']);
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
                await this.setTaskAssignee(created.id, (0, task_assignee_1.serializeTaskAssignee)(dto.assignee, dto.assigneeName));
            }
            catch {
            }
        }
        void this.notifications.partnerEvent(wedding.id, userId, 'partner_tasks_added', {
            entityIds: [created.id],
        });
        if (dto.assignee) {
            void this.notifyTaskAssigned(wedding.id, userId, created, dto.assignee);
        }
        return this.taskWithAssignee(created);
    }
    async createSmartPlanTasks(userId, dto) {
        const { wedding } = await (0, wedding_access_1.requireWeddingForUser)(this.prisma, userId, 'Спочатку збережіть весілля');
        const existing = await this.prisma.$queryRaw `
      SELECT template_id FROM tasks
      WHERE wedding_id = ${wedding.id} AND template_id IS NOT NULL
    `;
        const seen = new Set(existing.map((row) => row.template_id));
        const maxOrder = await this.prisma.task.aggregate({
            where: { weddingId: wedding.id },
            _max: { sortOrder: true },
        });
        let order = (maxOrder._max.sortOrder ?? 0) + 1;
        const createdIds = [];
        for (const item of dto.tasks) {
            const templateId = item.templateId.trim();
            if (seen.has(templateId))
                continue;
            seen.add(templateId);
            const created = await this.prisma.task.create({
                data: {
                    weddingId: wedding.id,
                    title: item.title.trim(),
                    categorySlug: item.categorySlug?.trim() || null,
                    sortOrder: order++,
                    isCustom: true,
                    status: client_1.TaskStatus.TODO,
                    dueDate: item.dueDate ? new Date(item.dueDate) : null,
                },
            });
            await this.prisma.$executeRaw `
        UPDATE tasks
        SET template_id = ${templateId},
            source = 'smart_planning',
            is_urgent = ${Boolean(item.isUrgent)},
            assignee = 'none'
        WHERE id = ${created.id}
      `;
            createdIds.push(created.id);
        }
        if (createdIds.length === 0)
            return [];
        void this.notifications.partnerEvent(wedding.id, userId, 'partner_tasks_added', {
            n: createdIds.length,
            entityIds: createdIds,
        });
        void this.notifications.resolveTypes(wedding.id, [
            'setup_smart_planning',
            'setup_smart_planning_date',
        ]);
        const rows = await this.prisma.task.findMany({
            where: { id: { in: createdIds } },
            orderBy: { sortOrder: 'asc' },
        });
        return this.attachTaskAssignees(wedding.id, rows);
    }
    async updateTask(userId, taskId, dto) {
        const task = await this.requireMemberTask(userId, taskId);
        if (dto.title !== undefined && !task.isCustom) {
            throw new common_1.BadRequestException('Назву шаблонної задачі змінити не можна');
        }
        if (dto.categorySlug !== undefined &&
            task.categorySlug?.startsWith('starter-') &&
            dto.categorySlug.split('@')[0] !== task.categorySlug.split('@')[0]) {
            throw new common_1.BadRequestException('Категорію стартової задачі змінити не можна');
        }
        const updated = await this.prisma.task.update({
            where: { id: taskId },
            data: {
                ...(dto.categorySlug !== undefined
                    ? { categorySlug: dto.categorySlug.trim() || null }
                    : {}),
                ...(dto.status !== undefined ? { status: dto.status } : {}),
                ...(dto.dueDate !== undefined
                    ? { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }
                    : {}),
                ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
            },
        });
        if (dto.status === client_1.TaskStatus.DONE && task.status !== client_1.TaskStatus.DONE) {
            void this.notifications.partnerEvent(task.weddingId, userId, 'partner_tasks_done', {
                entityIds: [taskId],
            });
            void this.notifications.resolveTask(task.weddingId, taskId);
        }
        if (dto.assignee !== undefined || dto.assigneeName !== undefined) {
            try {
                const current = (0, task_assignee_1.parseTaskAssignee)(await this.readTaskAssigneeRaw(taskId));
                const nextWho = dto.assignee !== undefined ? dto.assignee : current.assignee;
                const nextName = nextWho === 'other'
                    ? dto.assigneeName !== undefined
                        ? dto.assigneeName
                        : current.assigneeName
                    : null;
                await this.setTaskAssignee(taskId, (0, task_assignee_1.serializeTaskAssignee)(nextWho, nextName));
                if (nextWho && nextWho !== current.assignee) {
                    void this.notifyTaskAssigned(task.weddingId, userId, updated, nextWho);
                }
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
        void this.notifications.resolveTask(task.weddingId, taskId);
        return { ok: true };
    }
    async onWeddingDateSet(weddingId) {
        await this.notifications.resolveTypes(weddingId, ['setup_date']);
        await this.notifications.smartPlanningDateTip(weddingId);
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
                if (!found)
                    continue;
                const needsMeta = found.title !== def.title || found.sortOrder !== index;
                if (!needsMeta)
                    continue;
                await this.prisma.task.update({
                    where: { id: found.id },
                    data: { title: def.title, sortOrder: index },
                });
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
        notifications_service_1.NotificationsService,
        email_service_1.EmailService])
], WeddingsService);
//# sourceMappingURL=weddings.service.js.map