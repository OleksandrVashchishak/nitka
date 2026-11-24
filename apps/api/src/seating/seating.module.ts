import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SeatingController } from './seating.controller';
import { SeatingService } from './seating.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [SeatingController],
  providers: [SeatingService],
})
export class SeatingModule {}
