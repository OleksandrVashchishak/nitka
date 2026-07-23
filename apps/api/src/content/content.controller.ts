import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContentKind } from '@prisma/client';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('topics')
  listTopics() {
    return this.contentService.listTopics();
  }

  @Get('topics/:slug')
  getTopic(@Param('slug') slug: string) {
    return this.contentService.getTopicBySlug(slug);
  }

  @Get()
  list(
    @Query('topic') topic?: string,
    @Query('kind') kind?: ContentKind,
    @Query('featured') featured?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.contentService.listPublished({
      topic,
      kind,
      featured: featured === '1' || featured === 'true',
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.contentService.getPublishedBySlug(slug);
  }
}
