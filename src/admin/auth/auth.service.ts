import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Prisma, User } from 'generated/prisma';
import { TokenPayload } from 'src/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AdminAuthService {
  constructor(private prismaService: PrismaService) {}

  async validateUser(payload: TokenPayload): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.is_active) {
      throw new UnauthorizedException('User is not active');
    }
    return user;
  }
}
