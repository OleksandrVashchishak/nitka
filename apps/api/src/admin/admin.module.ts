import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ContactModule } from '../contact/contact.module';
import { AdminAnalyticsController } from './admin-analytics.controller';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { SuperadminGuard } from './superadmin.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me',
    }),
    ContactModule,
  ],
  controllers: [AdminAuthController, AdminAnalyticsController],
  providers: [AdminAuthService, AdminAnalyticsService, SuperadminGuard],
})
export class AdminModule {}
