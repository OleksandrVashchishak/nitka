import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { ListNotificationsDto } from './dto/list-notifications.dto';
import { RegisterPushDto } from './dto/register-push.dto';
import { UpdateNotificationPrefsDto } from './dto/update-prefs.dto';
import { NotificationRemindersService } from './notification-reminders.service';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notifications: NotificationsService,
    private readonly reminders: NotificationRemindersService,
  ) {}

  @Post('push-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
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
  @Roles(Role.COUPLE)
  unregisterPush(
    @CurrentUser() user: AuthUser,
    @Body() dto: RegisterPushDto,
  ) {
    return this.notifications.unregisterDevice(user.id, dto.token);
  }

  /**
   * Зовнішній cron / ручний тригер щоденних нагадувань (заголовок x-cron-secret).
   * `?force=1` — перезапустити сьогоднішній прогін.
   */
  @Post('reminders/run')
  runReminders(
    @Headers('x-cron-secret') secret?: string,
    @Query('force') force?: string,
  ) {
    const expected = process.env.CRON_SECRET;
    if (expected && secret !== expected) {
      throw new UnauthorizedException('Invalid cron secret');
    }
    return this.reminders.runDaily({ force: force === '1' });
  }

  /** Список для дзвіночка: ?offset=0&limit=5 (далі по 10). */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  list(@CurrentUser() user: AuthUser, @Query() query: ListNotificationsDto) {
    return this.notifications.list(user.id, query.offset ?? 0, query.limit ?? 5);
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  async unreadCount(@CurrentUser() user: AuthUser) {
    return { unreadCount: await this.notifications.unreadCount(user.id) };
  }

  @Post('read-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  readAll(@CurrentUser() user: AuthUser) {
    return this.notifications.markAllRead(user.id);
  }

  @Post(':id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  read(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.notifications.markRead(user.id, id);
  }

  @Get('prefs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  getPrefs(@CurrentUser() user: AuthUser) {
    return this.notifications.getPrefs(user.id);
  }

  @Patch('prefs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  updatePrefs(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateNotificationPrefsDto,
  ) {
    return this.notifications.updatePrefs(user.id, dto);
  }
}
