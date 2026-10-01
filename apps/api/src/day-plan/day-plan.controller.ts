import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { DayPlanService } from './day-plan.service';
import { UpsertDayPlanDto } from './dto/upsert-day-plan.dto';

@Controller('day-plan')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COUPLE)
export class DayPlanController {
  constructor(private readonly dayPlanService: DayPlanService) {}

  @Get()
  getMine(@CurrentUser() user: AuthUser) {
    return this.dayPlanService.getMine(user.id);
  }

  @Put()
  upsert(@CurrentUser() user: AuthUser, @Body() dto: UpsertDayPlanDto) {
    return this.dayPlanService.upsert(user.id, dto);
  }
}
