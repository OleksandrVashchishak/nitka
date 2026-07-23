import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import type { Response } from 'express';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpsertWeddingDto } from './dto/upsert-wedding.dto';
import { WeddingsService } from './weddings.service';

@Controller('weddings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COUPLE, Role.ADMIN)
export class WeddingsController {
  constructor(private readonly weddingsService: WeddingsService) {}

  @Get('me')
  async getMine(
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const wedding = await this.weddingsService.getMine(user.id);
    if (wedding === null) {
      res.status(200).type('json').send('null');
      return;
    }
    return wedding;
  }

  @Put('me')
  upsert(@CurrentUser() user: AuthUser, @Body() dto: UpsertWeddingDto) {
    return this.weddingsService.upsert(user.id, dto);
  }

  @Get('me/insights')
  getInsights(@CurrentUser() user: AuthUser) {
    return this.weddingsService.getInsights(user.id);
  }

  @Post('tasks')
  createTask(@CurrentUser() user: AuthUser, @Body() dto: CreateTaskDto) {
    return this.weddingsService.createTask(user.id, dto);
  }

  @Patch('tasks/:taskId')
  updateTask(
    @CurrentUser() user: AuthUser,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.weddingsService.updateTask(user.id, taskId, dto);
  }

  @Delete('tasks/:taskId')
  deleteTask(
    @CurrentUser() user: AuthUser,
    @Param('taskId') taskId: string,
  ) {
    return this.weddingsService.deleteTask(user.id, taskId);
  }
}
