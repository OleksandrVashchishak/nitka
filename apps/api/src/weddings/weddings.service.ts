import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus, WeddingMemberRole } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpsertDayPlanDto } from './dto/day-plan.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpsertWeddingDto } from './dto/upsert-wedding.dto';
import {
  requireWeddingForUser,
  requireWeddingOwner,
  resolveWeddingForUser,
} from './wedding-access';

/** Стартові задачі для нових акаунтів (розумне планування додає решту). */
const DEFAULT_TASKS = [
  { title: 'Побудувати список завдань', categorySlug: 'starter-plan' },
  { title: 'Додати гостей', categorySlug: 'starter-guests' },
  { title: 'Внести витрати', categorySlug: 'starter-budget' },
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
      tasks,
      myRole: me?.role ?? WeddingMemberRole.OWNER,
    };
  }

  private async attachTaskAssignees<
    T extends { id: string },
  >(weddingId: string, tasks: T[]) {
    if (tasks.length === 0) return tasks.map((task) => ({ ...task, assignee: null }));
    try {
      const rows = await this.prisma.$queryRaw<
        Array<{ id: string; assignee: string | null }>
      >`
        SELECT id, assignee FROM tasks WHERE wedding_id = ${weddingId}
      `;
      const map = new Map(rows.map((row) => [row.id, row.assignee]));
      return tasks.map((task) => ({
        ...task,
        assignee: map.get(task.id) ?? null,
      }));
    } catch {
      return tasks.map((task) => ({ ...task, assignee: null }));
    }
  }

  private async setTaskAssignee(taskId: string, assignee: string | null) {
    await this.prisma.$executeRaw`
      UPDATE tasks SET assignee = ${assignee} WHERE id = ${taskId}
    `;
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

      const changed =
        prev.date.toISOString().slice(0, 10) !== dto.date.slice(0, 10) ||
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
        void this.notifications.notifyWeddingMembers(
          access.wedding.id,
          {
            title: 'Партнер оновив весілля',
            body: 'Змінилися деталі — глянь у кабінеті',
            data: { type: 'wedding_update' },
          },
          userId,
        );
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

    return this.loadWeddingWithMeta(wedding.id, userId);
  }

  async createPartnerInvite(userId: string) {
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

    return {
      token: invite.token,
      expiresAt: invite.expiresAt,
      path: `/partner-invite/${invite.token}`,
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
      coupleName:
        partners.length > 0
          ? partners.join(' & ')
          : invite.wedding.user.name,
    };
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
        await this.setTaskAssignee(created.id, dto.assignee);
      } catch {
        /* column may be missing until ensure-schema */
      }
    }

    return this.taskWithAssignee(created);
  }

  async updateTask(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.requireMemberTask(userId, taskId);

    if (dto.title !== undefined && !task.isCustom) {
      throw new BadRequestException('Назву шаблонної задачі змінити не можна');
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
    return { ok: true };
  }

  async getDayPlan(userId: string) {
    const { wedding } = await requireWeddingForUser(this.prisma, userId);
    const rows = await this.prisma.$queryRaw<Array<{ day_plan: unknown }>>`
      SELECT day_plan FROM weddings WHERE id = ${wedding.id} LIMIT 1
    `;
    const raw = rows[0]?.day_plan ?? null;
    return { dayPlan: this.normalizeDayPlan(raw) };
  }

  async upsertDayPlan(userId: string, dto: UpsertDayPlanDto) {
    const { wedding } = await requireWeddingForUser(this.prisma, userId);
    const plan = {
      version: 1 as const,
      events: dto.events.map((e) => ({
        id: e.id.trim(),
        title: e.title.trim(),
        durationMin: Math.max(5, Math.min(12 * 60, Math.round(e.durationMin))),
        startMin: e.startMin == null ? null : Math.round(e.startMin),
        ...(e.icon ? { icon: e.icon } : {}),
      })),
      ...(dto.use24h !== undefined ? { use24h: dto.use24h } : {}),
    };

    await this.prisma.$executeRaw`
      UPDATE weddings
      SET day_plan = ${JSON.stringify(plan)}::jsonb
      WHERE id = ${wedding.id}
    `;

    return { dayPlan: plan };
  }

  private normalizeDayPlan(raw: unknown) {
    if (!raw || typeof raw !== 'object') return null;
    const obj = raw as {
      version?: unknown;
      events?: unknown;
      use24h?: unknown;
    };
    if (obj.version !== 1 || !Array.isArray(obj.events)) return null;
    const events = obj.events
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const e = item as Record<string, unknown>;
        const id = typeof e.id === 'string' ? e.id.trim() : '';
        const title = typeof e.title === 'string' ? e.title.trim() : '';
        const durationMin = Number(e.durationMin);
        if (!id || !title || !Number.isFinite(durationMin)) return null;
        const startRaw = e.startMin;
        const startMin =
          startRaw === null || startRaw === undefined
            ? null
            : Number(startRaw);
        return {
          id,
          title,
          durationMin: Math.max(5, Math.min(12 * 60, Math.round(durationMin))),
          startMin:
            startMin == null || !Number.isFinite(startMin)
              ? null
              : Math.round(startMin),
          ...(typeof e.icon === 'string' ? { icon: e.icon } : {}),
        };
      })
      .filter((e): e is NonNullable<typeof e> => Boolean(e));

    return {
      version: 1 as const,
      events,
      ...(typeof obj.use24h === 'boolean' ? { use24h: obj.use24h } : {}),
    };
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
        if (
          found &&
          (found.title !== def.title || found.sortOrder !== index)
        ) {
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
        status: TaskStatus.TODO,
      })),
    });
  }
}
