import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminAnalyticsService } from './admin-analytics.service';
import { CreateAdminNoteDto } from './dto/admin-note.dto';
import { SuperadminGuard } from './superadmin.guard';

@Controller('admin')
@UseGuards(SuperadminGuard)
export class AdminAnalyticsController {
  constructor(private readonly analytics: AdminAnalyticsService) {}

  @Get('stats')
  getStats() {
    return this.analytics.getStats();
  }

  @Get('users')
  listUsers(
    @Query('q') q?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit?: number,
    @Query('city') city?: string,
    @Query('planningStage') planningStage?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('activity') activity?: string,
  ) {
    return this.analytics.listUsers({
      q,
      page,
      limit,
      city,
      planningStage,
      dateFrom,
      dateTo,
      activity,
    });
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.analytics.getUser(id);
  }

  @Post('users/:id/notes')
  addNote(@Param('id') id: string, @Body() dto: CreateAdminNoteDto) {
    return this.analytics.addNote(id, dto.body);
  }

  @Delete('users/:id/notes/:noteId')
  deleteNote(@Param('id') id: string, @Param('noteId') noteId: string) {
    return this.analytics.deleteNote(id, noteId);
  }
}
