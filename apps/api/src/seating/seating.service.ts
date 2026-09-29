import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { requireWeddingForUser } from '../weddings/wedding-access';
import {
  UpsertSeatingDraftDto,
  UpsertSeatingPlanDto,
} from './dto/seating.dto';

@Injectable()
export class SeatingService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(userId: string) {
    const { wedding } = await requireWeddingForUser(
      this.prisma,
      userId,
      'Спочатку створи весілля в кабінеті',
    );

    const row = await this.prisma.wedding.findUnique({
      where: { id: wedding.id },
      select: { seatingDraft: true, seatingPlan: true },
    });

    return {
      weddingId: wedding.id,
      draft: this.asObject(row?.seatingDraft) ?? null,
      plan: this.asObject(row?.seatingPlan) ?? null,
    };
  }

  async upsertDraft(userId: string, dto: UpsertSeatingDraftDto) {
    const { wedding } = await requireWeddingForUser(
      this.prisma,
      userId,
      'Спочатку створи весілля в кабінеті',
    );

    const draft = {
      tables: dto.tables,
      guests: dto.guests,
    };

    await this.prisma.wedding.update({
      where: { id: wedding.id },
      data: {
        seatingDraft: draft as unknown as Prisma.InputJsonValue,
      },
    });

    return { weddingId: wedding.id, draft };
  }

  async upsertPlan(userId: string, dto: UpsertSeatingPlanDto) {
    const { wedding } = await requireWeddingForUser(
      this.prisma,
      userId,
      'Спочатку створи весілля в кабінеті',
    );

    const plan = {
      tables: dto.tables,
      savedAt: dto.savedAt ?? Date.now(),
    };

    await this.prisma.wedding.update({
      where: { id: wedding.id },
      data: {
        seatingPlan: plan as unknown as Prisma.InputJsonValue,
      },
    });

    return { weddingId: wedding.id, plan };
  }

  async clearPlan(userId: string) {
    const { wedding } = await requireWeddingForUser(
      this.prisma,
      userId,
      'Спочатку створи весілля в кабінеті',
    );

    await this.prisma.wedding.update({
      where: { id: wedding.id },
      data: { seatingPlan: Prisma.DbNull },
    });

    return { weddingId: wedding.id, plan: null };
  }

  private asObject(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }
    return value as Record<string, unknown>;
  }
}
