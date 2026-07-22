import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('summary')
  @Roles(Role.COUPLE, Role.VENDOR, Role.ADMIN)
  async summary(@CurrentUser() user: AuthUser) {
    if (user.role === 'VENDOR') {
      const vendor = await this.prisma.vendor.findUnique({
        where: { userId: user.id },
      });
      if (!vendor) {
        return {
          role: 'VENDOR',
          newRequests: 0,
          total: 0,
          items: [] as Array<{ key: string; label: string; count: number; href: string }>,
        };
      }

      const newRequests = await this.prisma.request.count({
        where: { vendorId: vendor.id, status: 'NEW' },
      });

      const items = [
        {
          key: 'newRequests',
          label: 'Нові заявки',
          count: newRequests,
          href: '/vendor/requests',
        },
      ].filter((i) => i.count > 0);

      return {
        role: 'VENDOR',
        newRequests,
        total: newRequests,
        items,
      };
    }

    // COUPLE / ADMIN acting as couple dashboard badges
    const wedding = await this.prisma.wedding.findUnique({
      where: { userId: user.id },
    });

    const [pendingRsvp, newRsvp, waitingRequests, vendorReplied] =
      await Promise.all([
        wedding
          ? this.prisma.guest.count({
              where: { weddingId: wedding.id, rsvpStatus: 'PENDING' },
            })
          : Promise.resolve(0),
        wedding
          ? this.prisma.guest.count({
              where: {
                weddingId: wedding.id,
                rsvpStatus: { in: ['YES', 'NO', 'MAYBE'] },
                respondedAt: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
              },
            })
          : Promise.resolve(0),
        this.prisma.request.count({
          where: { userId: user.id, status: 'NEW' },
        }),
        this.prisma.request.count({
          where: {
            userId: user.id,
            messages: {
              some: {
                authorRole: 'VENDOR',
                createdAt: {
                  gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                },
              },
            },
          },
        }),
      ]);

    const items = [
      {
        key: 'newRsvp',
        label: 'Нові RSVP',
        count: newRsvp,
        href: '/guests',
      },
      {
        key: 'pendingRsvp',
        label: 'Чекають відповіді',
        count: pendingRsvp,
        href: '/guests',
      },
      {
        key: 'waitingRequests',
        label: 'Заявки в очікуванні',
        count: waitingRequests,
        href: '/requests',
      },
      {
        key: 'vendorReplied',
        label: 'Вендор відповів',
        count: vendorReplied,
        href: '/requests',
      },
    ].filter((i) => i.count > 0);

    return {
      role: user.role,
      pendingRsvp,
      newRsvp,
      waitingRequests,
      vendorReplied,
      total: items.reduce((sum, i) => sum + i.count, 0),
      items,
    };
  }
}
