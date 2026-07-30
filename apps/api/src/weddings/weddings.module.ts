import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { WeddingsController } from './weddings.controller';
import { WeddingsService } from './weddings.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [WeddingsController],
  providers: [WeddingsService],
  exports: [WeddingsService],
})
export class WeddingsModule {}
