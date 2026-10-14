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
import { DayPlanService } from './day-plan.service';
import { ShareInviteDto, UpdateShareGrantDto } from './dto/share-invite.dto';
import { UpsertDayPlanDto } from './dto/upsert-day-plan.dto';

@Controller('day-plan')
export class DayPlanController {
  constructor(private readonly dayPlanService: DayPlanService) {}

  @Get('public/:token')
  getPublic(@Param('token') token: string) {
    return this.dayPlanService.getPublicByToken(token);
  }

  @Get('shared/:token/access')
  @UseGuards(JwtAuthGuard)
  getSharedAccessAuthed(
    @CurrentUser() user: AuthUser,
    @Param('token') token: string,
  ) {
    return this.dayPlanService.getSharedAccess(user.id, token);
  }

  @Get('invite/:inviteToken')
  getInvitePreview(@Param('inviteToken') inviteToken: string) {
    return this.dayPlanService.getInvitePreview(inviteToken);
  }

  @Post('invite/:inviteToken/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  acceptInvite(
    @CurrentUser() user: AuthUser,
    @Param('inviteToken') inviteToken: string,
  ) {
    return this.dayPlanService.acceptInvite(user.id, inviteToken);
  }

  @Get('share')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  getShare(@CurrentUser() user: AuthUser) {
    return this.dayPlanService.getShare(user.id);
  }

  @Post('share/invite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  invite(@CurrentUser() user: AuthUser, @Body() dto: ShareInviteDto) {
    return this.dayPlanService.invite(user.id, dto);
  }

  @Patch('share/grants/:grantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  updateGrant(
    @CurrentUser() user: AuthUser,
    @Param('grantId') grantId: string,
    @Body() dto: UpdateShareGrantDto,
  ) {
    return this.dayPlanService.updateGrant(user.id, grantId, dto);
  }

  @Delete('share/grants/:grantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  revokeGrant(
    @CurrentUser() user: AuthUser,
    @Param('grantId') grantId: string,
  ) {
    return this.dayPlanService.revokeGrant(user.id, grantId);
  }

  @Put('shared/:token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  upsertShared(
    @CurrentUser() user: AuthUser,
    @Param('token') token: string,
    @Body() dto: UpsertDayPlanDto,
  ) {
    return this.dayPlanService.upsertByShareToken(user.id, token, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  getMine(@CurrentUser() user: AuthUser) {
    return this.dayPlanService.getMine(user.id);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  upsert(@CurrentUser() user: AuthUser, @Body() dto: UpsertDayPlanDto) {
    return this.dayPlanService.upsert(user.id, dto);
  }
}
