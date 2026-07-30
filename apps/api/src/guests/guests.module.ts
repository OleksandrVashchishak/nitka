import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { InvitationsModule } from '../invitations/invitations.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { GuestsController } from './guests.controller';
import { GuestsService } from './guests.service';

@Module({
  imports: [AuthModule, NotificationsModule, InvitationsModule],
  controllers: [GuestsController],
  providers: [GuestsService],
})
export class GuestsModule {}
