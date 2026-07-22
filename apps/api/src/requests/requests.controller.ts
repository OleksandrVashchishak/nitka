import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import type { Response } from 'express';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateRequestMessageDto } from './dto/create-request-message.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { RequestsService } from './requests.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post('requests')
  @Roles(Role.COUPLE, Role.ADMIN)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateRequestDto) {
    return this.requestsService.create(user.id, dto);
  }

  @Get('requests')
  @Roles(Role.COUPLE, Role.ADMIN)
  listMine(@CurrentUser() user: AuthUser) {
    return this.requestsService.listMine(user.id);
  }

  @Post('requests/:id/messages')
  @Roles(Role.COUPLE, Role.VENDOR, Role.ADMIN)
  addMessage(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CreateRequestMessageDto,
  ) {
    return this.requestsService.addMessage(
      user.id,
      user.role as Role,
      id,
      dto,
    );
  }

  @Get('vendor/requests')
  @Roles(Role.VENDOR, Role.ADMIN)
  listForVendor(@CurrentUser() user: AuthUser) {
    return this.requestsService.listForVendor(user.id);
  }

  @Patch('vendor/requests/:id')
  @Roles(Role.VENDOR, Role.ADMIN)
  updateStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateRequestStatusDto,
  ) {
    return this.requestsService.updateStatus(user.id, id, dto.status);
  }

  @Get('vendor/dashboard')
  @Roles(Role.VENDOR, Role.ADMIN)
  async dashboard(
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.requestsService.vendorDashboard(user.id);
    if (data === null) {
      res.status(200).type('json').send('null');
      return;
    }
    return data;
  }
}
