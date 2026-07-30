import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { PrismaService } from '../prisma/prisma.service';
import { resolveWeddingForUser } from '../weddings/wedding-access';
import { RegisterPushDto } from './dto/register-push.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Post('push-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.VENDOR, Role.ADMIN)
  registerPush(
    @CurrentUser() user: AuthUser,
    @Body() dto: RegisterPushDto,
  ) {
    return this.notifications.registerDevice(
      user.id,
      dto.token,
      dto.platform,
    );
  }

  @Delete('push-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.VENDOR, Role.ADMIN)
  unregisterPush(
    @CurrentUser() user: AuthUser,
    @Body() dto: RegisterPushDto,
  ) {
    return this.notifications.unregisterDevice(user.id, dto.token);
  }

  /** Зовнішній cron / ручний тригер (заголовок x-cron-secret). */
  @Post('reminders/due')
  runDueReminders(@Headers('x-cron-secret') secret?: string) {
    const expected = process.env.CRON_SECRET;
    if (expected && secret !== expected) {
      throw new UnauthorizedException('Invalid cron secret');
    }
    return this.notifications.sendDueTaskReminders();
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
          items: [] as Array<{
            key: string;
            label: string;
            count: number;
            href: string;
          }>,
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

    const access = await resolveWeddingForUser(this.prisma, user.id);
    const wedding = access?.wedding ?? null;

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
        label: 'Нові відповіді на запрошення',
        count: newRsvp,
        href: '/guests',
      },
      {
        key: 'pendingRsvp',
        label: 'Чекають відповіді на запрошення',
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
