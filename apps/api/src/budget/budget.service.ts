import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBudgetItemDto,
  UpdateBudgetItemDto,
} from './dto/budget.dto';

const DEFAULT_ITEMS: Array<{
  category: string;
  title: string;
  share: number;
}> = [
  { category: 'venue', title: 'Локація / банкет', share: 0.35 },
  { category: 'photo', title: 'Фотограф', share: 0.12 },
  { category: 'music', title: 'Музика / DJ', share: 0.08 },
  { category: 'decor', title: 'Декор і квіти', share: 0.1 },
  { category: 'beauty', title: 'Beauty', share: 0.05 },
  { category: 'attire', title: 'Одяг', share: 0.12 },
  { category: 'rings', title: 'Обручки', share: 0.08 },
  { category: 'other', title: 'Інше / резерв', share: 0.1 },
];

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  private async getWeddingForUser(userId: string) {
    const wedding = await this.prisma.wedding.findUnique({
      where: { userId },
    });
    if (!wedding) {
      throw new BadRequestException(
        'Спочатку створи весілля в кабінеті (дата / бюджет)',
      );
    }
    return wedding;
  }

  private buildSummary(
    totalBudget: number,
    items: Array<{ estimated: number; actual: number; paid: boolean }>,
  ) {
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
      progress:
        totalBudget > 0
          ? Math.min(100, Math.round((actual / totalBudget) * 100))
          : 0,
    };
  }

  private groupByCategory(
    items: Array<{
      id: string;
      category: string;
      title: string;
      estimated: number;
      actual: number;
      paid: boolean;
      notes: string | null;
    }>,
  ) {
    const map = new Map<
      string,
      {
        category: string;
        estimated: number;
        actual: number;
        items: typeof items;
      }
    >();

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

    return [...map.values()].sort((a, b) =>
      a.category.localeCompare(b.category),
    );
  }

  private async syncDefaults(weddingId: string, totalBudget: number) {
    const count = await this.prisma.budgetItem.count({
      where: { weddingId },
    });
    if (count > 0) return;

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

  async getMine(userId: string) {
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

  async updatePlan(userId: string, budget: number) {
    const wedding = await this.getWeddingForUser(userId);
    await this.prisma.wedding.update({
      where: { id: wedding.id },
      data: { budget },
    });
    return this.getMine(userId);
  }

  async createItem(userId: string, dto: CreateBudgetItemDto) {
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

  async updateItem(userId: string, itemId: string, dto: UpdateBudgetItemDto) {
    const wedding = await this.getWeddingForUser(userId);
    const item = await this.prisma.budgetItem.findFirst({
      where: { id: itemId, weddingId: wedding.id },
    });
    if (!item) {
      throw new NotFoundException('Статтю бюджету не знайдено');
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

  async removeItem(userId: string, itemId: string) {
    const wedding = await this.getWeddingForUser(userId);
    const item = await this.prisma.budgetItem.findFirst({
      where: { id: itemId, weddingId: wedding.id },
    });
    if (!item) {
      throw new NotFoundException('Статтю бюджету не знайдено');
    }
    await this.prisma.budgetItem.delete({ where: { id: itemId } });
    return this.getMine(userId);
  }
}
