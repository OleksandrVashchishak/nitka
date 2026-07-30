import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UpsertWeddingWebsiteDto } from './dto/website.dto';
import { WebsiteService } from './website.service';

@Controller('website')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  @Get('me')
  getMine(@CurrentUser() user: AuthUser) {
    return this.websiteService.getMine(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  @Put('me')
  upsertMine(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpsertWeddingWebsiteDto,
  ) {
    return this.websiteService.upsertMine(user.id, dto);
  }

  @Get('public/:slug')
  getPublic(@Param('slug') slug: string) {
    return this.websiteService.getPublicBySlug(slug);
  }
}
