import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ActivityCreateDto } from './dto/activity-create.dto';
import { ProposalTypeService } from '../proposal-type/proposal-type.service';
import { ActivityUpdateDto } from './dto/activity-update.dto';

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly proposalTypeService: ProposalTypeService,
  ) {}

  async getAllActivities() {
    return this.prisma.activities.findMany();
  }

  async getActivityById(id: string) {
    try {
      const activity = await this.prisma.activities.findUnique({
        where: { id },
        include: {
          documentTemplates: true,
        },
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

  async createActivity(data: ActivityCreateDto) {
    const proposalType = await this.proposalTypeService.getProposalTypeById(
      data.proposal_type_id,
    );
    try {
      const { proposal_type_id, ...activityData } = data;
      return await this.prisma.activities.create({
        data: { ...activityData, proposalType_id: proposalType.id },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Activity with this slug already exists');
      }
      console.error(error);
      throw new InternalServerErrorException('Error creating activity');
    }
  }

  async updateActivity(id: string, data: ActivityUpdateDto) {
    try {
      return await this.prisma.activities.update({ where: { id }, data });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Activity with this slug already exists');
      }
      console.error(error);
      throw new InternalServerErrorException('Error updating activity');
    }
  }

  async deleteActivity(id: string) {
    await this.getActivityById(id);
    try {
      return await this.prisma.activities.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Error deleting activity');
    }
  }
}
