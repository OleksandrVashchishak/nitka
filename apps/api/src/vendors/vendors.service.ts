import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  removeBudgetItemForExternalVendor,
  syncBudgetItemForExternalVendor,
} from '../budget/vendor-budget-sync';
import {
  resolveWeddingForUser,
  requireWeddingForUser,
} from '../weddings/wedding-access';
import {
  CreateExternalVendorDto,
  UpdateExternalVendorDto,
  UpsertVendorPlanDto,
} from './dto/pipeline.dto';

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPipeline(userId: string) {
    const manual = await this.prisma.externalVendor.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    let plan: string[] = [];
    const access = await resolveWeddingForUser(this.prisma, userId);
    if (access) {
      try {
        const rows = await this.prisma.$queryRaw<
          Array<{ vendor_plan: unknown }>
        >`
          SELECT vendor_plan FROM weddings WHERE id = ${access.wedding.id} LIMIT 1
        `;
        plan = this.normalizeVendorPlan(rows[0]?.vendor_plan);
      } catch {
        /* column may be missing until ensure-schema */
      }
    }

    return { manual, plan };
  }

  async upsertVendorPlan(userId: string, dto: UpsertVendorPlanDto) {
    const { wedding } = await requireWeddingForUser(this.prisma, userId);
    const plan = this.normalizeVendorPlan(dto.categories);

    await this.prisma.$executeRaw`
      UPDATE weddings
      SET vendor_plan = ${JSON.stringify(plan)}::jsonb
      WHERE id = ${wedding.id}
    `;

    return { plan };
  }

  private normalizeVendorPlan(raw: unknown): string[] {
    if (!Array.isArray(raw)) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const item of raw) {
      if (typeof item !== 'string') continue;
      const slug = item.trim();
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      out.push(slug);
    }
    return out;
  }

  async createExternal(userId: string, dto: CreateExternalVendorDto) {
    const wedding = await this.prisma.wedding.findUnique({
      where: { userId },
      select: { city: true },
    });

    const vendor = await this.prisma.externalVendor.create({
      data: {
        userId,
        name: dto.name.trim(),
        category: dto.category.trim(),
        city: dto.city?.trim() || wedding?.city || '',
        phone: dto.phone?.trim() || null,
        website: dto.website?.trim() || null,
        quotedPrice: dto.quotedPrice ?? null,
        notes: dto.notes?.trim() || null,
        stage: dto.stage,
      },
    });
    await syncBudgetItemForExternalVendor(this.prisma, userId, vendor);
    return vendor;
  }

  async updateExternal(
    userId: string,
    id: string,
    dto: UpdateExternalVendorDto,
  ) {
    await this.assertExternalOwner(userId, id);
    const vendor = await this.prisma.externalVendor.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.category !== undefined
          ? { category: dto.category.trim() }
          : {}),
        ...(dto.city !== undefined ? { city: dto.city.trim() } : {}),
        ...(dto.phone !== undefined
          ? { phone: dto.phone?.trim() || null }
          : {}),
        ...(dto.website !== undefined
          ? { website: dto.website?.trim() || null }
          : {}),
        ...(dto.quotedPrice !== undefined
          ? { quotedPrice: dto.quotedPrice }
          : {}),
        ...(dto.notes !== undefined
          ? { notes: dto.notes?.trim() || null }
          : {}),
        ...(dto.stage !== undefined ? { stage: dto.stage } : {}),
      },
    });
    await syncBudgetItemForExternalVendor(this.prisma, userId, vendor);
    return vendor;
  }

  async removeExternal(userId: string, id: string) {
    await this.assertExternalOwner(userId, id);
    await removeBudgetItemForExternalVendor(this.prisma, id);
    await this.prisma.externalVendor.delete({ where: { id } });
    return { ok: true };
  }

  private async assertExternalOwner(userId: string, id: string) {
    const vendor = await this.prisma.externalVendor.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!vendor) throw new NotFoundException('Підрядника не знайдено');
    if (vendor.userId !== userId) throw new ForbiddenException();
  }
}
