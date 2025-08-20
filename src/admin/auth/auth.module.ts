import { Module } from '@nestjs/common';
import { AdminAuthService } from './auth.service';
import { AdminAuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AdminAuthService, PrismaService],
  controllers: [AdminAuthController],
})
export class AdminAuthModule {}
