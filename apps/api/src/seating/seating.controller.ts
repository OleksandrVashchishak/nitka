import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import {
  UpsertSeatingDraftDto,
  UpsertSeatingPlanDto,
} from './dto/seating.dto';
import { SeatingService } from './seating.service';

@Controller('seating')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COUPLE)
export class SeatingController {
  constructor(private readonly seatingService: SeatingService) {}

  @Get()
  getMine(@CurrentUser() user: AuthUser) {
    return this.seatingService.getMine(user.id);
  }

  @Put('draft')
  upsertDraft(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpsertSeatingDraftDto,
  ) {
    return this.seatingService.upsertDraft(user.id, dto);
  }

  @Put('plan')
  upsertPlan(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpsertSeatingPlanDto,
  ) {
    return this.seatingService.upsertPlan(user.id, dto);
  }

  @Delete('plan')
  clearPlan(@CurrentUser() user: AuthUser) {
    return this.seatingService.clearPlan(user.id);
  }
}
