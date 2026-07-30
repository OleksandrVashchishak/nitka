import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UpsertWeddingInvitationDto } from './dto/invitation.dto';
import { InvitationsService } from './invitations.service';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  @Get('me')
  getMine(@CurrentUser() user: AuthUser) {
    return this.invitationsService.getMine(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  @Put('me')
  upsertMine(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpsertWeddingInvitationDto,
  ) {
    return this.invitationsService.upsertMine(user.id, dto);
  }
}
