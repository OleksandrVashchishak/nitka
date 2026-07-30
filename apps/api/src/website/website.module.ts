import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';

@Module({
  imports: [AuthModule],
  controllers: [WebsiteController],
  providers: [WebsiteService],
})
export class WebsiteModule {}
