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
import {
  CreateExternalVendorDto,
  UpdateExternalVendorDto,
  UpsertVendorPlanDto,
} from './dto/pipeline.dto';
import { VendorsService } from './vendors.service';

@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COUPLE)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get('pipeline')
  pipeline(@CurrentUser() user: AuthUser) {
    return this.vendorsService.getPipeline(user.id);
  }

  @Put('vendor-plan')
  upsertVendorPlan(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpsertVendorPlanDto,
  ) {
    return this.vendorsService.upsertVendorPlan(user.id, dto);
  }

  @Post('manual')
  createExternal(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateExternalVendorDto,
  ) {
    return this.vendorsService.createExternal(user.id, dto);
  }

  @Patch('manual/:id')
  updateExternal(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateExternalVendorDto,
  ) {
    return this.vendorsService.updateExternal(user.id, id, dto);
  }

  @Delete('manual/:id')
  removeExternal(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.vendorsService.removeExternal(user.id, id);
  }
}
