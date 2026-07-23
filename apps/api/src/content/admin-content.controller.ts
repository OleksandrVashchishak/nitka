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
import { ContentStatus, Role } from '@prisma/client';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { ContentService } from './content.service';
import {
  UpdateContentStatusDto,
  UpsertContentPostDto,
  UpsertContentTopicDto,
} from './dto/content.dto';

@Controller('admin/content')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('topics')
  listTopics() {
    return this.contentService.listTopics();
  }

  @Post('topics')
  createTopic(@Body() dto: UpsertContentTopicDto) {
    return this.contentService.createTopic(dto);
  }

  @Put('topics/:id')
  updateTopic(@Param('id') id: string, @Body() dto: UpsertContentTopicDto) {
    return this.contentService.updateTopic(id, dto);
  }

  @Delete('topics/:id')
  deleteTopic(@Param('id') id: string) {
    return this.contentService.deleteTopic(id);
  }

  @Get('posts')
  listPosts(
    @Query('status') status?: ContentStatus,
    @Query('topic') topic?: string,
    @Query('q') q?: string,
  ) {
    return this.contentService.adminListPosts({ status, topic, q });
  }

  @Get('posts/:id')
  getPost(@Param('id') id: string) {
    return this.contentService.adminGetPost(id);
  }

  @Post('posts')
  createPost(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpsertContentPostDto,
  ) {
    return this.contentService.createPost(user.id, dto);
  }

  @Put('posts/:id')
  updatePost(@Param('id') id: string, @Body() dto: UpsertContentPostDto) {
    return this.contentService.updatePost(id, dto);
  }

  @Patch('posts/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateContentStatusDto,
  ) {
    return this.contentService.updateStatus(id, dto.status);
  }

  @Delete('posts/:id')
  deletePost(@Param('id') id: string) {
    return this.contentService.deletePost(id);
  }
}
