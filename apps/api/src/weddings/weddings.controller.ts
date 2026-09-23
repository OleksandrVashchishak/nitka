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
export class WeddingsController {
  constructor(private readonly weddingsService: WeddingsService) {}

  @Get('partner-invite/:token')
  getPartnerInvitePreview(@Param('token') token: string) {
    return this.weddingsService.getPartnerInvitePreview(token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  upsert(@CurrentUser() user: AuthUser, @Body() dto: UpsertWeddingDto) {
    return this.weddingsService.upsert(user.id, dto);
  }

  @Get('me/insights')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  getInsights(@CurrentUser() user: AuthUser) {
    return this.weddingsService.getInsights(user.id);
  }

  @Post('me/partner-invite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  createPartnerInvite(@CurrentUser() user: AuthUser) {
    return this.weddingsService.createPartnerInvite(user.id);
  }

  @Post('partner-invite/:token/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  acceptPartnerInvite(
    @CurrentUser() user: AuthUser,
    @Param('token') token: string,
  ) {
    return this.weddingsService.acceptPartnerInvite(user.id, token);
  }

  @Post('tasks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  createTask(@CurrentUser() user: AuthUser, @Body() dto: CreateTaskDto) {
    return this.weddingsService.createTask(user.id, dto);
  }

  @Patch('tasks/:taskId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  updateTask(
    @CurrentUser() user: AuthUser,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.weddingsService.updateTask(user.id, taskId, dto);
  }

  @Delete('tasks/:taskId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  deleteTask(
    @CurrentUser() user: AuthUser,
    @Param('taskId') taskId: string,
  ) {
    return this.weddingsService.deleteTask(user.id, taskId);
  }
}
