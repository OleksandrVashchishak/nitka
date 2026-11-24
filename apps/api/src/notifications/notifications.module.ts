import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationRemindersService } from './notification-reminders.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [AuthModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRemindersService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
