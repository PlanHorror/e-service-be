import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { AccountModule } from 'src/account/account.module';

@Module({
  providers: [AuthService, AuthStrategy, PrismaService],
  exports: [AuthService, AuthStrategy],
  controllers: [AuthController],
  imports: [AccountModule],
})
export class AuthModule {}
