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
  CreateExternalVendorDto,
  UpdateExternalVendorDto,
} from './dto/pipeline.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPipeline(userId: string) {
    const manual = await this.prisma.externalVendor.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return { manual };
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
