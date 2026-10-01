import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DayPlanController } from './day-plan.controller';
import { DayPlanService } from './day-plan.service';

@Module({
  imports: [AuthModule],
  controllers: [DayPlanController],
  providers: [DayPlanService],
})
export class DayPlanModule {}
