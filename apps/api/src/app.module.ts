import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/roles.guard';
import { PrismaModule } from './prisma/prisma.module';
import { WeddingsModule } from './weddings/weddings.module';
import { GuestsModule } from './guests/guests.module';
import { BudgetModule } from './budget/budget.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadsModule } from './uploads/uploads.module';
import { ContentModule } from './content/content.module';
import { WebsiteModule } from './website/website.module';
import { InvitationsModule } from './invitations/invitations.module';
import { EmailModule } from './email/email.module';
import { VendorsModule } from './vendors/vendors.module';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    AuthModule,
    WeddingsModule,
    VendorsModule,
    GuestsModule,
    BudgetModule,
    NotificationsModule,
    UploadsModule,
    ContentModule,
    WebsiteModule,
    InvitationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
