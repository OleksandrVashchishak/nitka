import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus, WeddingMemberRole } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateSmartPlanTasksDto } from './dto/create-smart-plan-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpsertWeddingDto } from './dto/upsert-wedding.dto';
import {
  parseTaskAssignee,
  serializeTaskAssignee,
} from './task-assignee';
import {
  requireWeddingForUser,
  requireWeddingOwner,
  resolveWeddingForUser,
} from './wedding-access';
/** Стартові задачі для нових акаунтів (розумне планування додає решту). */
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

const TASK_ORDER = { orderBy: [{ sortOrder: 'asc' as const }, { id: 'asc' as const }] };

const MEMBER_INCLUDE = {
  user: { select: { id: true, name: true, email: true } },
} as const;

@Injectable()
export class WeddingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly email: EmailService,
  ) {}

  private async loadWeddingWithMeta(weddingId: string, userId: string) {
    const wedding = await this.prisma.wedding.findUnique({
      where: { id: weddingId },
      include: {
        tasks: TASK_ORDER,
        members: { include: MEMBER_INCLUDE, orderBy: { createdAt: 'asc' } },
      },
    });
    if (!wedding) return null;

    const me = wedding.members.find((m) => m.userId === userId);
    const tasks = await this.attachTaskAssignees(weddingId, wedding.tasks);
    return {
      ...wedding,
      dateUndecided: await this.readDateUndecided(weddingId),
      tasks,
      myRole: me?.role ?? WeddingMemberRole.OWNER,
    };
  }

  private async attachTaskAssignees<
    T extends { id: string },
  >(weddingId: string, tasks: T[]) {
    if (tasks.length === 0) {
      return tasks.map((task) => ({
        ...task,
        assignee: null,
        assigneeName: null,
      }));
    }
    try {
      const rows = await this.prisma.$queryRaw<
        Array<{ id: string; assignee: string | null }>
      >`
        SELECT id, assignee FROM tasks WHERE wedding_id = ${weddingId}
      `;
      const map = new Map(rows.map((row) => [row.id, row.assignee]));
      const meta = await this.readTaskPlanMeta(weddingId);
      return tasks.map((task) => {
        const parsed = parseTaskAssignee(map.get(task.id) ?? null);
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
    } catch {
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

  /** templateId / source / isUrgent — raw SQL, як і assignee (вендорений Prisma client може відставати). */
  private async readTaskPlanMeta(weddingId: string) {
    try {
      const rows = await this.prisma.$queryRaw<
        Array<{
          id: string;
          template_id: string | null;
          source: string | null;
          is_urgent: boolean | null;
        }>
      >`
        SELECT id, template_id, source, is_urgent FROM tasks WHERE wedding_id = ${weddingId}
      `;
      return new Map(rows.map((row) => [row.id, row]));
    } catch {
      return new Map<
        string,
        {
          template_id: string | null;
          source: string | null;
          is_urgent: boolean | null;
        }
      >();
    }
  }

  private async setTaskAssignee(taskId: string, assignee: string | null) {
    await this.prisma.$executeRaw`
      UPDATE tasks SET assignee = ${assignee} WHERE id = ${taskId}
    `;
  }

  private async readDateUndecided(weddingId: string): Promise<boolean> {
    try {
      const rows = await this.prisma.$queryRaw<
        Array<{ date_undecided: boolean | null }>
      >`SELECT date_undecided FROM weddings WHERE id = ${weddingId}`;
      return Boolean(rows[0]?.date_undecided);
    } catch {
      return false;
    }
  }

  private async writeDateUndecided(weddingId: string, value: boolean) {
    try {
      await this.prisma.$executeRaw`
        UPDATE weddings SET date_undecided = ${value} WHERE id = ${weddingId}
      `;
    } catch {
      /* column may be missing until ensure-schema */
    }
  }

  /** «Роман призначив вам завдання» — лише іншому учаснику. */
  private async notifyTaskAssigned(
    weddingId: string,
    actorId: string,
    task: { id: string; title: string },
    assignee: string | null,
  ) {
    const members = await this.notifications.getMembers(weddingId);
    if (!members) return;
    const target =
      assignee === 'owner'
        ? members.ownerId
        : assignee === 'partner'
          ? members.partnerId
          : null;
    if (!target || target === actorId) return;
    await this.notifications.direct(
      weddingId,
      target,
      'task_assigned',
      `task_assigned:${task.id}:${Date.now()}`,
      { actorId, taskId: task.id, taskTitle: task.title },
    );
  }

  private async readTaskAssigneeRaw(taskId: string): Promise<string | null> {
    try {
      const rows = await this.prisma.$queryRaw<
        Array<{ assignee: string | null }>
      >`
        SELECT assignee FROM tasks WHERE id = ${taskId} LIMIT 1
      `;
      return rows[0]?.assignee ?? null;
    } catch {
      return null;
    }
  }

  private async taskWithAssignee(task: { id: string; weddingId: string }) {
    const [enriched] = await this.attachTaskAssignees(task.weddingId, [task]);
    return enriched;
  }

  async getMine(userId: string) {
    const access = await resolveWeddingForUser(this.prisma, userId);
    if (!access) return null;

    await this.syncDefaultTasks(access.wedding.id);
    return this.loadWeddingWithMeta(access.wedding.id, userId);
  }

  async getInsights(userId: string) {
    const access = await resolveWeddingForUser(this.prisma, userId);
    if (!access) return null;
    const wedding = await this.prisma.wedding.findUnique({
      where: { id: access.wedding.id },
      include: {
        tasks: true,
        budgetItems: true,
        guestList: { select: { rsvpStatus: true } },
      },
    });
    if (!wedding) return null;

    const manualStages = await this.prisma.externalVendor.groupBy({
      by: ['stage'],
      where: { userId },
      _count: { _all: true },
    });

    const actual = wedding.budgetItems.reduce(
      (sum, item) => sum + item.actual,
      0,
    );
    const estimated = wedding.budgetItems.reduce(
      (sum, item) => sum + item.estimated,
      0,
    );
    const paid = wedding.budgetItems.reduce((sum, item) => {
      if (item.paid) return sum + (item.actual || item.estimated);
      return sum + (item.actual || 0);
    }, 0);

    const stages = ['SAVED', 'CONTACTED', 'MET', 'COMPARED', 'CHOSEN'];
    const pipelineCounts = Object.fromEntries(
      stages.map((stage) => [stage, 0]),
    ) as Record<string, number>;
    for (const row of manualStages) {
      pipelineCounts[row.stage] += row._count._all;
    }

    const planDone = wedding.tasks.filter(
      (task) => task.status === TaskStatus.DONE,
    ).length;
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
        inProgress: wedding.tasks.filter(
          (task) => task.status === TaskStatus.IN_PROGRESS,
        ).length,
      },
      rsvp,
      budget: {
        total: wedding.budget,
        perGuest:
          wedding.guests > 0
            ? Math.round(wedding.budget / wedding.guests)
            : wedding.budget,
        estimated,
        actual,
        paid,
        remaining: wedding.budget - actual,
      },
      pipeline: {
        total: Object.values(pipelineCounts).reduce(
          (sum, value) => sum + value,
          0,
        ),
        counts: pipelineCounts,
      },
    };
  }

  async upsert(userId: string, dto: UpsertWeddingDto) {
    const access = await resolveWeddingForUser(this.prisma, userId);

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
            status: TaskStatus.TODO,
          })),
        },
        members: {
          create: {
            userId,
            role: WeddingMemberRole.OWNER,
          },
        },
      },
      include: { tasks: TASK_ORDER },
    });
    if (dto.dateUndecided) await this.writeDateUndecided(wedding.id, true);

    return this.loadWeddingWithMeta(wedding.id, userId);
  }

  async createPartnerInvite(userId: string, partnerEmail?: string) {
    const { wedding } = await requireWeddingOwner(this.prisma, userId);

    const partnerCount = await this.prisma.weddingMember.count({
      where: { weddingId: wedding.id, role: WeddingMemberRole.PARTNER },
    });
    if (partnerCount >= 1) {
      throw new BadRequestException('Партнер уже доданий до цього весілля');
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

  async getPartnerInvitePreview(token: string) {
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
      throw new NotFoundException('Запрошення недійсне');
    }
    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('Термін запрошення минув');
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
      coupleName:
        partners.length > 0
          ? partners.join(' & ')
          : invite.wedding.user.name,
      inviterName,
      inviteeName,
    };
  }

  async removePartner(userId: string) {
    const { wedding } = await requireWeddingOwner(this.prisma, userId);

    const partner = await this.prisma.weddingMember.findFirst({
      where: {
        weddingId: wedding.id,
        role: WeddingMemberRole.PARTNER,
      },
    });
    if (!partner) {
      throw new NotFoundException('Партнера не знайдено');
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

  async acceptPartnerInvite(userId: string, token: string) {
    const invite = await this.prisma.weddingInvite.findUnique({
      where: { token },
    });
    if (!invite || invite.acceptedAt) {
      throw new NotFoundException('Запрошення недійсне');
    }
    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('Термін запрошення минув');
    }

    const existingAccess = await resolveWeddingForUser(this.prisma, userId);
    if (existingAccess) {
      if (existingAccess.wedding.id === invite.weddingId) {
        return this.getMine(userId);
      }
      throw new BadRequestException(
        'У тебе вже є весілля. Один акаунт — одне весілля.',
      );
    }

    const partnerExists = await this.prisma.weddingMember.findFirst({
      where: {
        weddingId: invite.weddingId,
        role: WeddingMemberRole.PARTNER,
      },
    });
    if (partnerExists) {
      throw new BadRequestException('Партнер уже приєднався');
    }

    if (invite.weddingId) {
      const owner = await this.prisma.wedding.findUnique({
        where: { id: invite.weddingId },
        select: { userId: true },
      });
      if (owner?.userId === userId) {
        throw new BadRequestException('Це твоє весілля');
      }
    }

    await this.prisma.$transaction([
      this.prisma.weddingMember.create({
        data: {
          weddingId: invite.weddingId,
          userId,
          role: WeddingMemberRole.PARTNER,
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
      void this.notifications.direct(
        invite.weddingId,
        owner.userId,
        'partner_joined',
        `partner_joined:${userId}`,
        { actorId: userId },
      );
    }
    void this.notifications.resolveTypes(invite.weddingId, ['setup_partner']);

    return this.getMine(userId);
  }

  async createTask(userId: string, dto: CreateTaskDto) {
    const { wedding } = await requireWeddingForUser(
      this.prisma,
      userId,
      'Спочатку збережіть весілля',
    );

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
        status: TaskStatus.TODO,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      },
    });

    if (dto.assignee) {
      try {
        await this.setTaskAssignee(
          created.id,
          serializeTaskAssignee(dto.assignee, dto.assigneeName),
        );
      } catch {
        /* column may be missing until ensure-schema */
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

  /**
   * Розумне планування: створює завдання пакетом. Шаблони, що вже є у весіллі
   * (той самий template_id), пропускаються — дублів не буває.
   */
  async createSmartPlanTasks(userId: string, dto: CreateSmartPlanTasksDto) {
    const { wedding } = await requireWeddingForUser(
      this.prisma,
      userId,
      'Спочатку збережіть весілля',
    );

    const existing = await this.prisma.$queryRaw<
      Array<{ template_id: string }>
    >`
      SELECT template_id FROM tasks
      WHERE wedding_id = ${wedding.id} AND template_id IS NOT NULL
    `;
    const seen = new Set(existing.map((row) => row.template_id));

    const maxOrder = await this.prisma.task.aggregate({
      where: { weddingId: wedding.id },
      _max: { sortOrder: true },
    });
    let order = (maxOrder._max.sortOrder ?? 0) + 1;

    const createdIds: string[] = [];
    for (const item of dto.tasks) {
      const templateId = item.templateId.trim();
      if (seen.has(templateId)) continue;
      seen.add(templateId);

      const created = await this.prisma.task.create({
        data: {
          weddingId: wedding.id,
          title: item.title.trim(),
          categorySlug: item.categorySlug?.trim() || null,
          sortOrder: order++,
          isCustom: true,
          status: TaskStatus.TODO,
          dueDate: item.dueDate ? new Date(item.dueDate) : null,
        },
      });
      await this.prisma.$executeRaw`
        UPDATE tasks
        SET template_id = ${templateId},
            source = 'smart_planning',
            is_urgent = ${Boolean(item.isUrgent)},
            assignee = 'none'
        WHERE id = ${created.id}
      `;
      createdIds.push(created.id);
    }

    if (createdIds.length === 0) return [];
    void this.notifications.partnerEvent(wedding.id, userId, 'partner_tasks_added', {
      n: createdIds.length,
      entityIds: createdIds,
    });
    // Хтось один пройшов степер — підказки зникають в обох.
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

  async updateTask(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.requireMemberTask(userId, taskId);

    if (dto.title !== undefined && !task.isCustom) {
      throw new BadRequestException('Назву шаблонної задачі змінити не можна');
    }

    if (
      dto.categorySlug !== undefined &&
      task.categorySlug?.startsWith('starter-') &&
      dto.categorySlug.split('@')[0] !== task.categorySlug.split('@')[0]
    ) {
      throw new BadRequestException(
        'Категорію стартової задачі змінити не можна',
      );
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

    if (dto.status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
      void this.notifications.partnerEvent(task.weddingId, userId, 'partner_tasks_done', {
        entityIds: [taskId],
      });
      void this.notifications.resolveTask(task.weddingId, taskId);
    }

    if (dto.assignee !== undefined || dto.assigneeName !== undefined) {
      try {
        const current = parseTaskAssignee(
          await this.readTaskAssigneeRaw(taskId),
        );
        const nextWho =
          dto.assignee !== undefined ? dto.assignee : current.assignee;
        const nextName =
          nextWho === 'other'
            ? dto.assigneeName !== undefined
              ? dto.assigneeName
              : current.assigneeName
            : null;
        await this.setTaskAssignee(
          taskId,
          serializeTaskAssignee(nextWho, nextName),
        );
        if (nextWho && nextWho !== current.assignee) {
          void this.notifyTaskAssigned(task.weddingId, userId, updated, nextWho);
        }
      } catch {
        /* column may be missing until ensure-schema */
      }
    }

    return this.taskWithAssignee(updated);
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await this.requireMemberTask(userId, taskId);
    if (!task.isCustom) {
      throw new BadRequestException('Шаблонну задачу видалити не можна');
    }
    await this.prisma.task.delete({ where: { id: taskId } });
    void this.notifications.resolveTask(task.weddingId, taskId);
    return { ok: true };
  }

  /** Дату весілля вказали: setup_date неактуальне, підказка про розумне планування (розділ 7.1 п. 2). */
  private async onWeddingDateSet(weddingId: string) {
    await this.notifications.resolveTypes(weddingId, ['setup_date']);
    await this.notifications.smartPlanningDateTip(weddingId);
  }

  private async requireMemberTask(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { wedding: true },
    });

    if (!task) {
      throw new NotFoundException('Задачу не знайдено');
    }

    const access = await resolveWeddingForUser(this.prisma, userId);
    if (!access || access.wedding.id !== task.weddingId) {
      throw new ForbiddenException();
    }
    return task;
  }

  private async syncDefaultTasks(weddingId: string) {
    const existing = await this.prisma.task.findMany({
      where: { weddingId },
    });

    // Не підмішуємо стартери в уже наповнені плани (старі акаунти з шаблоном).
    if (existing.length > 0) {
      for (const [index, def] of DEFAULT_TASKS.entries()) {
        const found = existing.find(
          (task) => !task.isCustom && task.categorySlug === def.categorySlug,
        );
        if (!found) continue;
        const needsMeta =
          found.title !== def.title || found.sortOrder !== index;
        if (!needsMeta) continue;
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
        status: TaskStatus.TODO,
      })),
    });
  }
}
