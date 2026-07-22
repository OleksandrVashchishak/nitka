import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequestStatus, Role, VendorStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UpsertVendorProfileDto } from '../vendors/dto/upsert-vendor-profile.dto';
import { UpsertWeddingDto } from '../weddings/dto/upsert-wedding.dto';
import { AdminService } from './admin.service';
import {
  UpdateUserDto,
  UpdateVendorFeaturedDto,
  UpdateVendorStatusDto,
  UpsertCategoryDto,
} from './dto/admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  stats() {
    return this.adminService.stats();
  }

  @Get('vendors')
  listVendors(
    @Query('status') status?: VendorStatus,
    @Query('q') q?: string,
  ) {
    return this.adminService.listVendors({ status, q });
  }

  @Get('vendors/:id')
  getVendor(@Param('id') id: string) {
    return this.adminService.getVendor(id);
  }

  @Patch('vendors/:id/status')
  updateVendorStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVendorStatusDto,
  ) {
    return this.adminService.updateVendorStatus(
      id,
      dto.status,
      dto.moderationNote,
    );
  }

  @Patch('vendors/:id/featured')
  setFeatured(
    @Param('id') id: string,
    @Body() dto: UpdateVendorFeaturedDto,
  ) {
    return this.adminService.setFeatured(id, dto.featured);
  }

  @Put('vendors/:id/profile')
  updateVendorProfile(
    @Param('id') id: string,
    @Body() dto: UpsertVendorProfileDto,
  ) {
    return this.adminService.updateVendorProfile(id, dto);
  }

  @Get('categories')
  listCategories() {
    return this.adminService.listCategories();
  }

  @Post('categories')
  createCategory(@Body() dto: UpsertCategoryDto) {
    return this.adminService.createCategory(dto);
  }

  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpsertCategoryDto) {
    return this.adminService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id);
  }

  @Get('requests')
  listRequests(
    @Query('status') status?: RequestStatus,
    @Query('q') q?: string,
  ) {
    return this.adminService.listRequests({ status, q });
  }

  @Get('users')
  listUsers(@Query('role') role?: Role, @Query('q') q?: string) {
    return this.adminService.listUsers({ role, q });
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.adminService.updateUser(id, dto);
  }

  @Put('users/:id/wedding')
  updateUserWedding(
    @Param('id') id: string,
    @Body() dto: UpsertWeddingDto,
  ) {
    return this.adminService.upsertUserWedding(id, dto);
  }

  @Get('reviews')
  listReviews() {
    return this.adminService.listReviews();
  }

  @Delete('reviews/:id')
  deleteReview(@Param('id') id: string) {
    return this.adminService.deleteReview(id);
  }
}
