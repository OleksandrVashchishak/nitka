import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
