import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { RequestStatus, Role, VendorStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertVendorProfileDto } from '../vendors/dto/upsert-vendor-profile.dto';
import { VendorsService } from '../vendors/vendors.service';
import { UpsertWeddingDto } from '../weddings/dto/upsert-wedding.dto';
import { WeddingsService } from '../weddings/weddings.service';
import { UpsertCategoryDto } from './dto/admin.dto';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vendorsService: VendorsService,
    private readonly weddingsService: WeddingsService,
  ) {}

  async onModuleInit() {
    const email = 'admin@nitka.local';
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (!existing) {
      await this.prisma.user.create({
        data: {
          email,
          name: 'Admin',
          role: 'ADMIN',
          password: await bcrypt.hash('admin1234', 10),
        },
      });
      return;
    }

    if (existing.role !== 'ADMIN') {
      await this.prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      });
    }
  }

  async stats() {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      pendingVendors,
      approvedVendors,
      rejectedVendors,
      blockedVendors,
      categories,
      requests,
      couples,
      vendors,
      views7d,
      requests7d,
      reviews,
      featuredVendors,
    ] = await Promise.all([
      this.prisma.vendor.count({ where: { status: 'PENDING' } }),
      this.prisma.vendor.count({ where: { status: 'APPROVED' } }),
      this.prisma.vendor.count({ where: { status: 'REJECTED' } }),
      this.prisma.vendor.count({ where: { status: 'BLOCKED' } }),
      this.prisma.category.count(),
      this.prisma.request.count(),
      this.prisma.user.count({ where: { role: 'COUPLE' } }),
      this.prisma.user.count({ where: { role: 'VENDOR' } }),
      this.prisma.vendorView.count({ where: { createdAt: { gte: weekAgo } } }),
      this.prisma.request.count({ where: { createdAt: { gte: weekAgo } } }),
      this.prisma.review.count(),
      this.prisma.vendor.count({ where: { featured: true } }),
    ]);

    return {
      pendingVendors,
      approvedVendors,
      rejectedVendors,
      blockedVendors,
      categories,
      requests,
      couples,
      vendors,
      views7d,
      requests7d,
      reviews,
      featuredVendors,
    };
  }

  listVendors(params?: { status?: VendorStatus; q?: string }) {
    const q = params?.q?.trim();
    return this.prisma.vendor.findMany({
      where: {
        ...(params?.status ? { status: params.status } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { city: { contains: q, mode: 'insensitive' } },
                { user: { email: { contains: q, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      include: {
        category: true,
        user: { select: { id: true, email: true, name: true, blocked: true } },
        photos: { orderBy: { order: 'asc' }, take: 1 },
        _count: {
          select: { requests: true, favorites: true, reviews: true, views: true },
        },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async getVendor(id: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: { id: true, email: true, name: true, blocked: true },
        },
        photos: { orderBy: { order: 'asc' } },
        packages: { orderBy: { order: 'asc' } },
        faqs: { orderBy: { order: 'asc' } },
        team: { orderBy: { order: 'asc' } },
        _count: {
          select: { requests: true, favorites: true, reviews: true, views: true },
        },
      },
    });
    if (!vendor) throw new NotFoundException('Підрядника не знайдено');
    return vendor;
  }

  async updateVendorStatus(
    id: string,
    status: VendorStatus,
    moderationNote?: string,
  ) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } });
    if (!vendor) {
      throw new NotFoundException('Підрядника не знайдено');
    }

    return this.prisma.vendor.update({
      where: { id },
      data: {
        status,
        moderationNote:
          moderationNote?.trim() ||
          (status === 'APPROVED' ? null : vendor.moderationNote),
        featured: status === 'APPROVED' ? vendor.featured : false,
      },
      include: {
        category: true,
        user: { select: { id: true, email: true, name: true, blocked: true } },
        photos: { orderBy: { order: 'asc' }, take: 1 },
        _count: {
          select: { requests: true, favorites: true, reviews: true, views: true },
        },
      },
    });
  }

  async setFeatured(id: string, featured: boolean) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } });
    if (!vendor) throw new NotFoundException('Підрядника не знайдено');

    return this.prisma.vendor.update({
      where: { id },
      data: { featured },
      include: {
        category: true,
        user: { select: { id: true, email: true, name: true, blocked: true } },
        photos: { orderBy: { order: 'asc' }, take: 1 },
        _count: {
          select: { requests: true, favorites: true, reviews: true, views: true },
        },
      },
    });
  }

  listCategories() {
    return this.prisma.category.findMany({
      include: { _count: { select: { vendors: true } } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async createCategory(dto: UpsertCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          name: dto.name.trim(),
          slug: dto.slug.trim().toLowerCase(),
          description: dto.description?.trim() || '',
          sortOrder: dto.sortOrder ?? 0,
        },
        include: { _count: { select: { vendors: true } } },
      });
    } catch {
      throw new ConflictException('Категорія з таким slug вже є');
    }
  }

  async updateCategory(id: string, dto: UpsertCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Категорію не знайдено');
    }

    try {
      return await this.prisma.category.update({
        where: { id },
        data: {
          name: dto.name.trim(),
          slug: dto.slug.trim().toLowerCase(),
          description: dto.description?.trim() || '',
          sortOrder: dto.sortOrder ?? existing.sortOrder,
        },
        include: { _count: { select: { vendors: true } } },
      });
    } catch {
      throw new ConflictException('Категорія з таким slug вже є');
    }
  }

  async deleteCategory(id: string) {
    const existing = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { vendors: true } } },
    });
    if (!existing) {
      throw new NotFoundException('Категорію не знайдено');
    }
    if (existing._count.vendors > 0) {
      throw new ConflictException(
        'Не можна видалити категорію з підрядниками',
      );
    }

    await this.prisma.category.delete({ where: { id } });
    return { ok: true };
  }

  listRequests(params?: { status?: RequestStatus; q?: string }) {
    const q = params?.q?.trim();
    return this.prisma.request.findMany({
      where: {
        ...(params?.status ? { status: params.status } : {}),
        ...(q
          ? {
              OR: [
                { user: { name: { contains: q, mode: 'insensitive' } } },
                { user: { email: { contains: q, mode: 'insensitive' } } },
                { vendor: { name: { contains: q, mode: 'insensitive' } } },
                { city: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        vendor: {
          select: {
            id: true,
            name: true,
            city: true,
            category: true,
          },
        },
        messages: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  listUsers(params?: { role?: Role; q?: string }) {
    const q = params?.q?.trim();
    return this.prisma.user.findMany({
      where: {
        ...(params?.role ? { role: params.role } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        blocked: true,
        createdAt: true,
        vendor: { select: { id: true, name: true, status: true } },
        _count: { select: { requests: true, reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        blocked: true,
        createdAt: true,
        wedding: {
          include: {
            _count: {
              select: { tasks: true, guestList: true, budgetItems: true },
            },
          },
        },
        vendor: { select: { id: true, name: true, status: true } },
        _count: { select: { requests: true, reviews: true, favorites: true } },
      },
    });
    if (!user) throw new NotFoundException('Користувача не знайдено');
    return user;
  }

  async updateUser(
    id: string,
    data: {
      blocked?: boolean;
      role?: Role;
      name?: string;
      email?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Користувача не знайдено');
    if (user.email === 'admin@nitka.local' && data.role && data.role !== 'ADMIN') {
      throw new ConflictException('Не можна змінити роль головного адміна');
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...(typeof data.blocked === 'boolean'
            ? { blocked: data.blocked }
            : {}),
          ...(data.role ? { role: data.role } : {}),
          ...(data.name !== undefined ? { name: data.name.trim() } : {}),
          ...(data.email !== undefined
            ? { email: data.email.trim().toLowerCase() }
            : {}),
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          blocked: true,
          createdAt: true,
          vendor: { select: { id: true, name: true, status: true } },
          _count: { select: { requests: true, reviews: true } },
        },
      });
    } catch {
      throw new ConflictException('Цей email вже використовується');
    }
  }

  async upsertUserWedding(userId: string, dto: UpsertWeddingDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Користувача не знайдено');
    return this.weddingsService.upsert(userId, dto);
  }

  async updateVendorProfile(id: string, dto: UpsertVendorProfileDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!vendor) throw new NotFoundException('Підрядника не знайдено');
    return this.vendorsService.upsertMine(vendor.userId, dto);
  }

  listReviews() {
    return this.prisma.review.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        vendor: {
          select: { id: true, name: true, city: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async deleteReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Відгук не знайдено');

    await this.prisma.review.delete({ where: { id } });

    const agg = await this.prisma.review.aggregate({
      where: { vendorId: review.vendorId },
      _avg: { rating: true },
    });
    await this.prisma.vendor.update({
      where: { id: review.vendorId },
      data: { rating: agg._avg.rating ?? 0 },
    });

    return { ok: true };
  }
}
