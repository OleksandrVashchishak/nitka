import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ContactModule } from '../contact/contact.module';
import { AdminAnalyticsController } from './admin-analytics.controller';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminInsightsService } from './admin-insights.service';
import { AdminWebsitesService } from './admin-websites.service';
import { SuperadminGuard } from './superadmin.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me',
    }),
    ContactModule,
  ],
  controllers: [AdminAuthController, AdminAnalyticsController],
  providers: [
    AdminAuthService,
    AdminAnalyticsService,
    AdminInsightsService,
    AdminWebsitesService,
    SuperadminGuard,
  ],
})
export class AdminModule {}
