import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateRequestMessageDto } from './dto/create-request-message.dto';

const requestIncludeCouple = {
  vendor: {
    include: {
      category: true,
      photos: { orderBy: { order: 'asc' as const }, take: 1 },
    },
  },
  messages: {
    include: {
      author: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'asc' as const },
  },
};

const requestIncludeVendor = {
  user: { select: { id: true, name: true, email: true } },
  messages: {
    include: {
      author: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'asc' as const },
  },
};

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateRequestDto) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id: dto.vendorId, status: 'APPROVED' },
    });
    if (!vendor) {
      throw new NotFoundException('Підрядника не знайдено');
    }

    const request = await this.prisma.request.create({
      data: {
        userId,
        vendorId: dto.vendorId,
        eventDate: new Date(dto.eventDate),
        city: dto.city.trim(),
        guests: dto.guests,
        budget: dto.budget,
        message: dto.message.trim(),
      },
      include: requestIncludeCouple,
    });

    await this.prisma.favorite.upsert({
      where: { userId_vendorId: { userId, vendorId: dto.vendorId } },
      create: {
        userId,
        vendorId: dto.vendorId,
        stage: 'CONTACTED',
      },
      update: { stage: 'CONTACTED' },
    });

    return request;
  }

  listMine(userId: string) {
    return this.prisma.request.findMany({
      where: { userId },
      include: requestIncludeCouple,
      orderBy: { createdAt: 'desc' },
    });
  }

  async listForVendor(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });
    if (!vendor) {
      throw new NotFoundException('Профіль підрядника не знайдено');
    }

    return this.prisma.request.findMany({
      where: { vendorId: vendor.id },
      include: requestIncludeVendor,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    userId: string,
    requestId: string,
    status: RequestStatus,
  ) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });
    if (!vendor) {
      throw new NotFoundException('Профіль підрядника не знайдено');
    }

    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });
    if (!request || request.vendorId !== vendor.id) {
      throw new ForbiddenException();
    }

    return this.prisma.request.update({
      where: { id: requestId },
      data: { status },
      include: requestIncludeVendor,
    });
  }

  async addMessage(
    userId: string,
    userRole: Role,
    requestId: string,
    dto: CreateRequestMessageDto,
  ) {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: { vendor: true },
    });
    if (!request) {
      throw new NotFoundException('Заявку не знайдено');
    }

    const isCouple =
      (userRole === Role.COUPLE || userRole === Role.ADMIN) &&
      request.userId === userId;
    const isVendor =
      (userRole === Role.VENDOR || userRole === Role.ADMIN) &&
      request.vendor.userId === userId;

    if (!isCouple && !isVendor) {
      throw new ForbiddenException();
    }

    const authorRole = isVendor ? Role.VENDOR : Role.COUPLE;
    const phone = dto.phone?.trim() || null;

    await this.prisma.requestMessage.create({
      data: {
        requestId,
        authorId: userId,
        authorRole,
        body: dto.body.trim(),
        phone,
      },
    });

    const nextStatus =
      isVendor && request.status === 'NEW'
        ? RequestStatus.CONTACTED
        : undefined;

    if (nextStatus) {
      await this.prisma.request.update({
        where: { id: requestId },
        data: { status: nextStatus },
      });
    } else {
      // bump updatedAt for notifications / timeline
      await this.prisma.request.update({
        where: { id: requestId },
        data: { updatedAt: new Date() },
      });
    }

    if (isVendor) {
      return this.prisma.request.findUniqueOrThrow({
        where: { id: requestId },
        include: requestIncludeVendor,
      });
    }

    return this.prisma.request.findUniqueOrThrow({
      where: { id: requestId },
      include: requestIncludeCouple,
    });
  }

  async vendorDashboard(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      include: { category: true },
    });
    if (!vendor) {
      return null;
    }

    const now = new Date();
    const start7 = new Date(now);
    start7.setDate(start7.getDate() - 6);
    start7.setHours(0, 0, 0, 0);

    const start30 = new Date(now);
    start30.setDate(start30.getDate() - 29);
    start30.setHours(0, 0, 0, 0);

    const [requestsCount, favoritesCount, newRequests, viewsTotal, views7d, views30d, recentViews] =
      await Promise.all([
        this.prisma.request.count({ where: { vendorId: vendor.id } }),
        this.prisma.favorite.count({ where: { vendorId: vendor.id } }),
        this.prisma.request.count({
          where: { vendorId: vendor.id, status: 'NEW' },
        }),
        this.prisma.vendorView.count({ where: { vendorId: vendor.id } }),
        this.prisma.vendorView.count({
          where: { vendorId: vendor.id, createdAt: { gte: start7 } },
        }),
        this.prisma.vendorView.count({
          where: { vendorId: vendor.id, createdAt: { gte: start30 } },
        }),
        this.prisma.vendorView.findMany({
          where: { vendorId: vendor.id, createdAt: { gte: start7 } },
          select: { createdAt: true },
        }),
      ]);

    const byDay = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(start7);
      d.setDate(start7.getDate() + i);
      byDay.set(d.toISOString().slice(0, 10), 0);
    }
    for (const view of recentViews) {
      const key = view.createdAt.toISOString().slice(0, 10);
      if (byDay.has(key)) {
        byDay.set(key, (byDay.get(key) || 0) + 1);
      }
    }

    return {
      vendor,
      stats: {
        views: viewsTotal,
        views7d,
        views30d,
        viewsSeries: [...byDay.entries()].map(([date, count]) => ({
          date,
          count,
        })),
        requests: requestsCount,
        favorites: favoritesCount,
        newRequests,
      },
    };
  }
}
