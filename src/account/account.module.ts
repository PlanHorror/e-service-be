import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { PrismaService } from '../prisma.service';
import { AccountController } from './account.controller';

@Module({
  providers: [AccountService, PrismaService],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
