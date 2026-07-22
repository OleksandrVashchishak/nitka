import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { BudgetService } from './budget.service';
import {
  CreateBudgetItemDto,
  UpdateBudgetItemDto,
  UpdateBudgetPlanDto,
} from './dto/budget.dto';

@Controller('budget')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COUPLE, Role.ADMIN)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  getMine(@CurrentUser() user: AuthUser) {
    return this.budgetService.getMine(user.id);
  }

  @Put('plan')
  updatePlan(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateBudgetPlanDto,
  ) {
    return this.budgetService.updatePlan(user.id, dto.budget);
  }

  @Post('items')
  createItem(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateBudgetItemDto,
  ) {
    return this.budgetService.createItem(user.id, dto);
  }

  @Patch('items/:id')
  updateItem(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateBudgetItemDto,
  ) {
    return this.budgetService.updateItem(user.id, id, dto);
  }

  @Delete('items/:id')
  removeItem(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.budgetService.removeItem(user.id, id);
  }
}
