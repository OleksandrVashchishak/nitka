import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { requireWeddingForUser } from '../weddings/wedding-access';
import { type DayPlanEventPayload } from './day-plan.defaults';
import { UpsertDayPlanDto } from './dto/upsert-day-plan.dto';

@Injectable()
export class DayPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(userId: string) {
    const { wedding } = await requireWeddingForUser(
      this.prisma,
      userId,
      'Спочатку створи весілля в кабінеті',
    );

    const row = await this.prisma.wedding.findUnique({
      where: { id: wedding.id },
      select: { dayPlan: true },
    });

    const events = this.parseEvents(row?.dayPlan);

    return {
      weddingId: wedding.id,
      events: events === null ? null : this.sortEvents(events),
    };
  }

  async upsert(userId: string, dto: UpsertDayPlanDto) {
    const { wedding } = await requireWeddingForUser(
      this.prisma,
      userId,
      'Спочатку створи весілля в кабінеті',
    );

    const events = this.sortEvents(
      dto.events.map((e) => ({
        id: e.id,
        title: e.title.trim(),
        time: e.time,
        durationMin: e.durationMin,
      })),
    );

    await this.prisma.wedding.update({
      where: { id: wedding.id },
      data: {
        dayPlan: events as unknown as Prisma.InputJsonValue,
      },
    });

    return { weddingId: wedding.id, events };
  }

  private parseEvents(value: unknown): DayPlanEventPayload[] | null {
    if (value === null || value === undefined) return null;
    if (!Array.isArray(value)) return null;

    const events: DayPlanEventPayload[] = [];
    for (const item of value) {
      if (!item || typeof item !== 'object') continue;
      const row = item as Record<string, unknown>;
      if (
        typeof row.id !== 'string' ||
        typeof row.title !== 'string' ||
        typeof row.time !== 'string' ||
        typeof row.durationMin !== 'number'
      ) {
        continue;
      }
      events.push({
        id: row.id,
        title: row.title,
        time: row.time,
        durationMin: row.durationMin,
      });
    }
    return events;
  }

  private sortEvents(events: DayPlanEventPayload[]) {
    return [...events].sort((a, b) => a.time.localeCompare(b.time));
  }
}
