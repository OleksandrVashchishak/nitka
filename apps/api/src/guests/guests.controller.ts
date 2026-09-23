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
  UpdateGuestDto,
} from './dto/guest.dto';
import { GuestsService } from './guests.service';

@Controller()
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get('guests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  listMine(@CurrentUser() user: AuthUser) {
    return this.guestsService.listMine(user.id);
  }

  @Post('guests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateGuestDto) {
    return this.guestsService.create(user.id, dto);
  }

  @Post('guests/import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  importMany(@CurrentUser() user: AuthUser, @Body() dto: ImportGuestsDto) {
    return this.guestsService.importMany(user.id, dto);
  }

  @Patch('guests/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateGuestDto,
  ) {
    return this.guestsService.update(user.id, id, dto);
  }

  @Delete('guests/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE)
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.guestsService.remove(user.id, id);
  }
}
