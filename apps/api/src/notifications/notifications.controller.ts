import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { RegisterPushDto } from './dto/register-push.dto';
import { UpdateNotificationPrefsDto } from './dto/update-prefs.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

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
  @Roles(Role.COUPLE)
  summary(@CurrentUser() user: AuthUser) {
    return this.notifications.getSummary(user);
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
