import {
  Body,
  Controller,
  Delete,
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
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('vendor/:vendorId')
  listByVendor(@Param('vendorId') vendorId: string) {
    return this.reviewsService.listByVendor(vendorId);
  }

  @Get('mine/:vendorId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  async mineForVendor(
    @CurrentUser() user: AuthUser,
    @Param('vendorId') vendorId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const review = await this.reviewsService.mineForVendor(user.id, vendorId);
    if (review === null) {
      res.status(200).type('json').send('null');
      return;
    }
    return review;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COUPLE, Role.ADMIN)
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.reviewsService.remove(user.id, id);
  }
}
