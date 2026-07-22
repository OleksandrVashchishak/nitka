import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateExternalVendorDto,
  UpdateExternalVendorDto,
  UpdatePipelineDto,
} from './dto/pipeline.dto';

const favoriteInclude = {
  vendor: {
    include: {
      category: true,
      photos: { orderBy: { order: 'asc' as const }, take: 1 },
    },
  },
};

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: favoriteInclude,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async add(userId: string, vendorId: string) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id: vendorId, status: 'APPROVED' },
    });
    if (!vendor) {
      throw new NotFoundException('Підрядника не знайдено');
    }

    try {
      return await this.prisma.favorite.create({
        data: { userId, vendorId },
        include: favoriteInclude,
      });
    } catch {
      throw new ConflictException('Вже в обраному');
    }
  }

  async remove(userId: string, vendorId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_vendorId: { userId, vendorId } },
    });
    if (!favorite) {
      throw new NotFoundException('Немає в обраному');
    }
    await this.prisma.favorite.delete({
      where: { userId_vendorId: { userId, vendorId } },
    });
    return { ok: true };
  }

  async getPipeline(userId: string) {
    const [catalog, manual] = await Promise.all([
      this.prisma.favorite.findMany({
        where: { userId },
        include: favoriteInclude,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.externalVendor.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    return { catalog, manual };
  }

  async updatePipeline(
    userId: string,
    vendorId: string,
    dto: UpdatePipelineDto,
  ) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_vendorId: { userId, vendorId } },
    });
    if (!favorite) {
      throw new NotFoundException('Спочатку збережи підрядника');
    }

    return this.prisma.favorite.update({
      where: { id: favorite.id },
      data: {
        ...(dto.stage !== undefined ? { stage: dto.stage } : {}),
        ...(dto.quotedPrice !== undefined
          ? { quotedPrice: dto.quotedPrice }
          : {}),
        ...(dto.notes !== undefined
          ? { notes: dto.notes?.trim() || null }
          : {}),
      },
      include: favoriteInclude,
    });
  }

  async createExternal(userId: string, dto: CreateExternalVendorDto) {
    const wedding = await this.prisma.wedding.findUnique({
      where: { userId },
      select: { city: true },
    });

    return this.prisma.externalVendor.create({
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
  }

  async updateExternal(
    userId: string,
    id: string,
    dto: UpdateExternalVendorDto,
  ) {
    await this.assertExternalOwner(userId, id);
    return this.prisma.externalVendor.update({
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
  }

  async removeExternal(userId: string, id: string) {
    await this.assertExternalOwner(userId, id);
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
