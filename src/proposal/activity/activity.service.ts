import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllActivities() {
    return this.prisma.activities.findMany();
  }

  async getActivityById(id: string) {
    try {
      const activity = await this.prisma.activities.findUnique({
        where: { id },
      });
      if (!activity) {
        throw new NotFoundException('Activity not found');
      }
      return activity;
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Activity not found');
    }
  }

  async createActivity(data: any) {
    try {
      return await this.prisma.activities.create({ data });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error creating activity');
    }
  }

  async updateActivity(id: string, data: any) {
    try {
      return await this.prisma.activities.update({ where: { id }, data });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error updating activity');
    }
  }

  async deleteActivity(id: string) {
    await this.getActivityById(id);
    try {
      return await this.prisma.activities.delete({ where: { id } });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error deleting activity');
    }
  }
}
