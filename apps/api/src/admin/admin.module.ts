import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { VendorsModule } from '../vendors/vendors.module';
import { WeddingsModule } from '../weddings/weddings.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [AuthModule, VendorsModule, WeddingsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
