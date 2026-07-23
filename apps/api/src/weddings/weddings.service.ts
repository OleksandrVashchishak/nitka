import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpsertWeddingDto } from './dto/upsert-wedding.dto';

/** categorySlug: каталог АБО внутрішній сервіс (guests/budget/date/…) */
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

const TASK_ORDER = { orderBy: [{ sortOrder: 'asc' as const }, { id: 'asc' as const }] };

@Injectable()
export class WeddingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(userId: string) {
    const wedding = await this.prisma.wedding.findUnique({
      where: { userId },
      include: { tasks: TASK_ORDER },
    });

    if (!wedding) return null;
    await this.syncDefaultTasks(wedding.id);
    return this.prisma.wedding.findUnique({
      where: { userId },
      include: { tasks: TASK_ORDER },
    });
  }

  async getInsights(userId: string) {
    const wedding = await this.prisma.wedding.findUnique({
      where: { userId },
      include: {
        tasks: true,
        budgetItems: true,
        guestList: { select: { rsvpStatus: true } },
      },
    });
    if (!wedding) return null;

    const [favorites, requests, vendors, favoriteStages, manualStages] =
      await Promise.all([
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

    const cityVendors = vendors.filter(
      (vendor) =>
        vendor.city.trim().toLocaleLowerCase('uk-UA') ===
        wedding.city.trim().toLocaleLowerCase('uk-UA'),
    );
    const priceGroups = new Map<
      string,
      { slug: string; name: string; prices: number[] }
    >();
    for (const vendor of cityVendors) {
      const current = priceGroups.get(vendor.category.slug) ?? {
        slug: vendor.category.slug,
        name: vendor.category.name,
        prices: [],
      };
      current.prices.push(
        Math.round((vendor.priceFrom + (vendor.priceTo ?? vendor.priceFrom)) / 2),
      );
      priceGroups.set(vendor.category.slug, current);
    }

    const marketPrices = [...priceGroups.values()]
      .map((group) => ({
        category: group.slug,
        label: group.name,
        average: Math.round(
          group.prices.reduce((sum, value) => sum + value, 0) /
            group.prices.length,
        ),
        vendorsCount: group.prices.length,
      }))
      .sort((a, b) => b.vendorsCount - a.vendorsCount);
    const cityPrices = marketPrices.flatMap((item) =>
      Array.from({ length: item.vendorsCount }, () => item.average),
    );
    const cityAverage =
      cityPrices.length > 0
        ? Math.round(
            cityPrices.reduce((sum, value) => sum + value, 0) /
              cityPrices.length,
          )
        : 0;

    const excluded = new Set([
      ...favorites.map((item) => item.vendorId),
      ...requests.map((item) => item.vendorId),
    ]);
    const incompleteCategories = wedding.tasks
      .filter((task) => task.status !== TaskStatus.DONE && task.categorySlug)
      .map((task) => task.categorySlug as string);
    const categoryPriority = new Map(
      incompleteCategories.map((slug, index) => [slug, index]),
    );

    const recommendations =
      cityVendors.length === 0
        ? []
        : vendors
            .filter((vendor) => !excluded.has(vendor.id))
            .sort((a, b) => {
              const aCity = a.city === wedding.city ? 1 : 0;
              const bCity = b.city === wedding.city ? 1 : 0;
              if (aCity !== bCity) return bCity - aCity;
              const aPriority = categoryPriority.get(a.category.slug) ?? 999;
              const bPriority = categoryPriority.get(b.category.slug) ?? 999;
              if (aPriority !== bPriority) return aPriority - bPriority;
              if (a.featured !== b.featured)
                return Number(b.featured) - Number(a.featured);
              return b.rating - a.rating;
            })
            .slice(0, 4)
            .map((vendor) => ({
              ...vendor,
              reason:
                vendor.city === wedding.city
                  ? `${vendor.category.name} у вашому місті`
                  : `Сильний варіант у категорії «${vendor.category.name}»`,
            }));

    const actual = wedding.budgetItems.reduce(
      (sum, item) => sum + item.actual,
      0,
    );
    const estimated = wedding.budgetItems.reduce(
      (sum, item) => sum + item.estimated,
      0,
    );
    const paid = wedding.budgetItems.reduce(
      (sum, item) => sum + (item.paid ? item.actual : 0),
      0,
    );

    const stages = ['SAVED', 'CONTACTED', 'MET', 'COMPARED', 'CHOSEN'];
    const pipelineCounts = Object.fromEntries(
      stages.map((stage) => [stage, 0]),
    ) as Record<string, number>;
    for (const row of [...favoriteStages, ...manualStages]) {
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
      market: {
        average: cityAverage,
        vendorsCount: cityVendors.length,
        categories: marketPrices,
      },
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
      recommendations,
    };
  }

  async upsert(userId: string, dto: UpsertWeddingDto) {
    const existing = await this.prisma.wedding.findUnique({
      where: { userId },
    });

    if (existing) {
      await this.prisma.wedding.update({
        where: { userId },
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
      await this.syncDefaultTasks(existing.id);
      return this.getMine(userId);
    }

    return this.prisma.wedding.create({
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
      },
      include: { tasks: TASK_ORDER },
    });
  }

  async createTask(userId: string, dto: CreateTaskDto) {
    const wedding = await this.prisma.wedding.findUnique({
      where: { userId },
    });
    if (!wedding) {
      throw new NotFoundException('Спочатку збережіть весілля');
    }

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
        status: TaskStatus.TODO,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      },
    });
  }

  async updateTask(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.requireOwnTask(userId, taskId);

    if (dto.title !== undefined && !task.isCustom) {
      throw new BadRequestException('Назву шаблонної задачі змінити не можна');
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

  async deleteTask(userId: string, taskId: string) {
    const task = await this.requireOwnTask(userId, taskId);
    if (!task.isCustom) {
      throw new BadRequestException('Шаблонну задачу видалити не можна');
    }
    await this.prisma.task.delete({ where: { id: taskId } });
    return { ok: true };
  }

  private async requireOwnTask(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { wedding: true },
    });

    if (!task) {
      throw new NotFoundException('Задачу не знайдено');
    }
    if (task.wedding.userId !== userId) {
      throw new ForbiddenException();
    }
    return task;
  }

  private async syncDefaultTasks(weddingId: string) {
    const existing = await this.prisma.task.findMany({
      where: { weddingId },
    });

    for (const [index, def] of DEFAULT_TASKS.entries()) {
      const found = existing.find(
        (task) =>
          !task.isCustom &&
          (task.categorySlug === def.categorySlug || task.title === def.title),
      );

      if (!found) {
        await this.prisma.task.create({
          data: {
            weddingId,
            title: def.title,
            categorySlug: def.categorySlug,
            sortOrder: index,
            isCustom: false,
            status: TaskStatus.TODO,
          },
        });
        continue;
      }

      // Не чіпаємо status/dueDate; підтягуємо лише slug/title/order шаблону
      if (
        found.categorySlug !== def.categorySlug ||
        found.title !== def.title ||
        found.sortOrder !== index
      ) {
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
}
