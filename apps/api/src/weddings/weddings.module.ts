import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WeddingsController } from './weddings.controller';
import { WeddingsService } from './weddings.service';

@Module({
  imports: [AuthModule],
  controllers: [WeddingsController],
  providers: [WeddingsService],
  exports: [WeddingsService],
})
export class WeddingsModule {}
