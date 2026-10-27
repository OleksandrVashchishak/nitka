import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from '../contact/contact.service';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminInsightsService } from './admin-insights.service';
import { AdminWebsitesService } from './admin-websites.service';
import {
  ReplyContactDto,
  UpdateContactStatusDto,
} from './dto/admin-contact.dto';
import { CreateAdminNoteDto } from './dto/admin-note.dto';
import { SetWebsiteHiddenDto } from './dto/admin-website.dto';
import { SuperadminGuard } from './superadmin.guard';

@Controller('admin')
@UseGuards(SuperadminGuard)
export class AdminAnalyticsController {
  constructor(
    private readonly analytics: AdminAnalyticsService,
    private readonly insights: AdminInsightsService,
    private readonly websites: AdminWebsitesService,
    private readonly contact: ContactService,
  ) {}

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

  @Get('contact-messages')
  listContactMessages(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    return this.contact.list({ page, limit });
  }

  @Patch('contact-messages/:id/read')
  markContactRead(@Param('id') id: string) {
    return this.contact.markRead(id);
  }

  @Patch('contact-messages/:id/status')
  setContactStatus(
    @Param('id') id: string,
    @Body() dto: UpdateContactStatusDto,
  ) {
    return this.contact.setStatus(id, dto.status);
  }

  @Post('contact-messages/:id/reply')
  replyContact(@Param('id') id: string, @Body() dto: ReplyContactDto) {
    return this.contact.reply(id, dto.body);
  }

  @Get('timeseries')
  getTimeseries(
    @Query('granularity') granularity = 'day',
    @Query('periods', new DefaultValuePipe(0), ParseIntPipe) periods?: number,
  ) {
    return this.insights.getTimeseries(granularity, periods || undefined);
  }

  @Get('cohorts')
  getCohorts(
    @Query('weeks', new DefaultValuePipe(0), ParseIntPipe) weeks?: number,
  ) {
    return this.insights.getCohorts(weeks || undefined);
  }

  @Get('websites')
  listWebsites(
    @Query('q') q?: string,
    @Query('status') status?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit?: number,
  ) {
    return this.websites.list({ q, status, page, limit });
  }

  @Patch('websites/:id/hidden')
  setWebsiteHidden(
    @Param('id') id: string,
    @Body() dto: SetWebsiteHiddenDto,
  ) {
    return this.websites.setHidden(id, dto.hidden);
  }

  @Delete('websites/:id')
  deleteWebsite(@Param('id') id: string) {
    return this.websites.remove(id);
  }

  @Delete('contact-messages/:id')
  deleteContactMessage(@Param('id') id: string) {
    return this.contact.remove(id);
  }
}
