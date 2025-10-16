import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { LoginDto, RegisterDto, UpdateUserDto } from '../auth/dto/auth.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUser, TokenPayload } from '../common';
import * as jwt from 'jsonwebtoken';
import { ProfileUpdateDto } from './dto/profile-update.dto';

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
      console.error('Error creating account:', error);
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
    const { confirmPassword, ...userData } = data;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = await this.createAccount({
      ...userData,
      password: hashedPassword,
      is_active: true,
    });
    return user;
  }

  async updateAccountService(id: string, data: UpdateUserDto) {
    let updateData: Partial<User> = { ...data };
    if (data.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(data.password, salt);
      updateData.password = hashedPassword;
    } else {
      // Loại bỏ password khỏi updateData nếu không có
      delete updateData.password;
    }

    return this.updateAccount(id, updateData);
  }

  async getProfile(userId: string, options?: { includeActivity?: boolean; includeProposals?: boolean }) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        phone: true,
        address: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        ...(options?.includeProposals && {
          news: {
            select: {
              id: true,
              title: true,
              created_at: true,
            },
          },
        }),
        ...(options?.includeActivity && {
          proposalReviews: {
            select: {
              id: true,
              comments: true,
              created_at: true,
            },
          },
        }),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getProfileById(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        phone: true,
        address: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, profileData: ProfileUpdateDto) {
    // Check if user exists
    const existingUser = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check if email is already taken by another user
    if (profileData.email !== existingUser.email) {
      const emailExists = await this.prismaService.user.findUnique({
        where: { email: profileData.email },
      });

      if (emailExists) {
        throw new BadRequestException('Email already exists');
      }
    }

    try {
      const updatedUser = await this.prismaService.user.update({
        where: { id: userId },
        data: {
          full_name: profileData.full_name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
        },
        select: {
          id: true,
          email: true,
          username: true,
          full_name: true,
          phone: true,
          address: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
      });

      return updatedUser;
    } catch (error) {
      throw new BadRequestException('Error updating profile');
    }
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
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'defaultSecret', {});
  }
}