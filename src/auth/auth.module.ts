import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AuthService, AuthStrategy, PrismaService],
  exports: [AuthService, AuthStrategy],
})
export class AuthModule {}
