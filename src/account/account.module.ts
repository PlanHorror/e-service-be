import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AccountService, PrismaService],
})
export class AccountModule {}
