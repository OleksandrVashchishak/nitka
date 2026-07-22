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
  CreateExternalVendorDto,
  UpdateExternalVendorDto,
  UpdatePipelineDto,
} from './dto/pipeline.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COUPLE, Role.ADMIN)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.favoritesService.list(user.id);
  }

  @Get('pipeline')
  pipeline(@CurrentUser() user: AuthUser) {
    return this.favoritesService.getPipeline(user.id);
  }

  @Post('manual')
  createExternal(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateExternalVendorDto,
  ) {
    return this.favoritesService.createExternal(user.id, dto);
  }

  @Patch('manual/:id')
  updateExternal(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateExternalVendorDto,
  ) {
    return this.favoritesService.updateExternal(user.id, id, dto);
  }

  @Delete('manual/:id')
  removeExternal(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.favoritesService.removeExternal(user.id, id);
  }

  @Patch(':vendorId/pipeline')
  updatePipeline(
    @CurrentUser() user: AuthUser,
    @Param('vendorId') vendorId: string,
    @Body() dto: UpdatePipelineDto,
  ) {
    return this.favoritesService.updatePipeline(user.id, vendorId, dto);
  }

  @Post(':vendorId')
  add(@CurrentUser() user: AuthUser, @Param('vendorId') vendorId: string) {
    return this.favoritesService.add(user.id, vendorId);
  }

  @Delete(':vendorId')
  remove(@CurrentUser() user: AuthUser, @Param('vendorId') vendorId: string) {
    return this.favoritesService.remove(user.id, vendorId);
  }
}
