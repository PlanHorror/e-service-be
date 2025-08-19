import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';

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

  async createAccount(data: User): Promise<User> {
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
}
