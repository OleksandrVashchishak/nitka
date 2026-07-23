import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import type { Request, Response } from 'express';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UpsertVendorProfileDto } from './dto/upsert-vendor-profile.dto';
import { VendorsService } from './vendors.service';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Query('price') price?: string,
    @Query('rating') rating?: string,
    @Query('q') q?: string,
    @Query('style') style?: string,
    @Query('sort') sort?: string,
    @Query('featured') featured?: string,
  ) {
    return this.vendorsService.findAll({
      category,
      city,
      price: price ? Number(price) : undefined,
      rating: rating ? Number(rating) : undefined,
      q: q?.trim() || undefined,
      style: style?.trim() || undefined,
      sort: sort?.trim() || undefined,
      featured: featured === '1' || featured === 'true',
    });
  }

  @Get('filters')
  getFilters() {
    return this.vendorsService.getFilterOptions();
  }

  @Get('me/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR, Role.ADMIN)
  async getMine(
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const profile = await this.vendorsService.getMine(user.id);
    if (profile === null) {
      res.status(200).type('json').send('null');
      return;
    }
    return profile;
  }

  @Put('me/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.VENDOR, Role.ADMIN)
  upsertMine(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpsertVendorProfileDto,
  ) {
    return this.vendorsService.upsertMine(user.id, dto);
  }

  @Get(':slugOrId')
  findOne(@Param('slugOrId') slugOrId: string, @Req() req: Request) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      (typeof forwarded === 'string'
        ? forwarded.split(',')[0]?.trim()
        : null) ||
      req.ip ||
      req.socket.remoteAddress;

    return this.vendorsService.findOne(slugOrId, {
      ip,
      userAgent: req.headers['user-agent'],
    });
  }
}
