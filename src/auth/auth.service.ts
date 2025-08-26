import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AccountService } from '../account/account.service';
import { TokenPayload } from '../common';
import { PrismaService } from '../prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private accountService: AccountService,
  ) {}

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

  async login(data: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.accountService.verifyAccount(data);
    const accessToken = await this.accountService.generateAccessToken(user);
    return { accessToken };
  }

  async register(data: RegisterDto): Promise<{ accessToken: string }> {
    const user = await this.accountService.newAccount(data);
    const accessToken = await this.accountService.generateAccessToken(user);
    if (data.confirmPassword !== data.password) {
      throw new UnauthorizedException('Passwords do not match');
    }
    return { accessToken };
  }
}
