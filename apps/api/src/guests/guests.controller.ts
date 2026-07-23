import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import {
  CreateGuestDto,
  ImportGuestsDto,
  PublicRsvpDto,
  UpdateGuestDto,
} from './dto/guest.dto';
import { GuestsService } from './guests.service';

@Controller()
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get('guests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  listMine(@CurrentUser() user: AuthUser) {
    return this.guestsService.listMine(user.id);
  }

  @Post('guests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateGuestDto) {
    return this.guestsService.create(user.id, dto);
  }

  @Post('guests/import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  importMany(@CurrentUser() user: AuthUser, @Body() dto: ImportGuestsDto) {
    return this.guestsService.importMany(user.id, dto);
  }

  @Patch('guests/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateGuestDto,
  ) {
    return this.guestsService.update(user.id, id, dto);
  }

  @Delete('guests/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.guestsService.remove(user.id, id);
  }

  @Get('rsvp/:token')
  getPublic(@Param('token') token: string) {
    return this.guestsService.getPublicInvite(token);
  }

  @Post('rsvp/:token')
  submitPublic(@Param('token') token: string, @Body() dto: PublicRsvpDto) {
    return this.guestsService.submitPublicRsvp(token, dto);
  }
}
