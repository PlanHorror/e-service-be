import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role, User } from 'generated/prisma';
import { LoginDto, RegisterDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUser, TokenPayload } from 'src/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AccountService {
  constructor(private prismaService: PrismaService) {}

  async getAllAccounts(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async getAccountById(id: string): Promise<User> {
    try {
      const account = await this.prismaService.user.findUnique({
        where: { id },
      });
      if (!account) {
        throw new NotFoundException('Account not found');
      }
      return account;
    } catch (error) {
      throw new NotFoundException('Account not found');
    }
  }

  async createAccount(data: CreateUser): Promise<User> {
    try {
      return await this.prismaService.user.create({
        data,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Username or email already exists');
      }
      throw new InternalServerErrorException('Error creating account');
    }
  }

  async updateAccount(id: string, data: Partial<User>): Promise<User> {
    try {
      await this.getAccountById(id);
      return await this.prismaService.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Username or email already exists');
      }
      throw new InternalServerErrorException('Error updating account');
    }
  }

  async deleteAccount(id: string): Promise<User> {
    await this.getAccountById(id);
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  async newAccount(data: RegisterDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = await this.createAccount({
      ...data,
      password: hashedPassword,
      is_active: true,
    });
    return user;
  }

  async verifyAccount(data: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { username: data.username },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.is_active) {
      throw new UnauthorizedException('User is not active');
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload: TokenPayload = {
      ...user,
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'defaultSecret', {});
  }
}
