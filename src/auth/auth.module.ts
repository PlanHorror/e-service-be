import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';
import { PrismaService } from '../prisma.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../account/account.module';

@Module({
  providers: [AuthService, AuthStrategy, PrismaService],
  exports: [AuthService, AuthStrategy],
  controllers: [AuthController],
  imports: [AccountModule],
})
export class AuthModule {}
