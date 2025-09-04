import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  ActivityCreateDto,
  ActivityTemplateCreateDto,
} from './dto/activity-create.dto';
import { ProposalTypeService } from '../proposal-type/proposal-type.service';
import {
  ActivityTemplateUpdateDto,
  ActivityUpdateDto,
} from './dto/activity-update.dto';
import { Prisma } from '@prisma/client';
import { generateUniqueFileName, saveFile } from 'src/common';
import path from 'path';

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
    await this.getActivityById(id);
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

  async createActivityTemplate(
    data: ActivityTemplateCreateDto,
    files: Express.Multer.File[],
  ) {
    const { documentTemplates, ...activityData } = data;
    await this.proposalTypeService.getProposalTypeById(data.proposalType_id);
    try {
      const activity = await this.prisma.activities.create({
        data: activityData,
      });
      if (documentTemplates.length !== files.length) {
        throw new BadRequestException(
          'Mismatch between document templates and files',
        );
      }
      const documentTemplatesData: Prisma.DocumentTemplateCreateManyInput[] =
        [];
      if (documentTemplates && documentTemplates.length > 0 && files) {
        documentTemplates.forEach((template, index) => {
          const file = files.find(
            (f) => f.fieldname === `documentTemplates[${index}][file]`,
          );
          if (!file) {
            throw new BadRequestException(
              `File for document template ${template.name} is missing`,
            );
          }
          const path = `attachments/${generateUniqueFileName(file)}`;
          saveFile(file, path);
          documentTemplatesData.push({
            quantity: template.quantity,
            is_required: template.is_required,
            name: template.name,
            path,
            activity_id: activity.id,
          });
        });
        await this.prisma.documentTemplate.createMany({
          data: documentTemplatesData,
        });
      }
      return activity;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Activity with this slug already exists');
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Error creating activity template',
      );
    }
  }

  async updateActivityTemplate(
    activity_id: string,
    data: ActivityTemplateUpdateDto,
    files: Express.Multer.File[],
  ) {
    const activity = await this.getActivityById(activity_id);
    const { documentTemplates, ...activityData } = data;
    await this.prisma.activities.update({
      where: { id: activity.id },
      data: activityData,
    });

    if (documentTemplates && documentTemplates.length > 0) {
      const documentTemplatesCreateData: Prisma.DocumentTemplateCreateManyInput[] =
        [];
      documentTemplates.forEach((template, index) => {
        if (template.id) {
          const oldData = activity.documentTemplates.find(
            (dt) => dt.id === template.id,
          );
          if (!oldData) {
            throw new BadRequestException(
              `Document template with ID ${template.id} not found`,
            );
          }
          const file = files.find(
            (f) => f.fieldname === `documentTemplates[${index}][file]`,
          );
          const { id, ...rest } = template;
          if (file) {
            const path = `attachments/${generateUniqueFileName(file)}`;
            saveFile(file, path);

            documentTemplatesCreateData.push({
              ...rest,
              path,
              activity_id: activity.id,
            });
          } else {
            documentTemplatesCreateData.push({
              ...rest,
              activity_id: activity.id,
              path: oldData.path,
            });
          }
        } else {
          const file = files.find(
            (f) => f.fieldname === `documentTemplates[${index}][file]`,
          );
          if (file) {
            const path = `attachments/${generateUniqueFileName(file)}`;
            saveFile(file, path);
            documentTemplatesCreateData.push({
              ...template,
              path,
              activity_id: activity.id,
            });
          } else {
            throw new BadRequestException(
              `File for document template ${template.name} is missing`,
            );
          }
        }
      });
      try {
        // console.log(documentTemplatesCreateData);
        await this.prisma.documentTemplate.deleteMany({
          where: { activity_id: activity.id },
        });
        if (documentTemplatesCreateData.length > 0) {
          await this.prisma.documentTemplate.createMany({
            data: documentTemplatesCreateData,
          });
        }
      } catch (error) {
        if (error.code === 'P2002') {
          throw new ConflictException('Activity with this slug already exists');
        }
        console.error(error);
        throw new InternalServerErrorException(
          'Error updating activity template',
        );
      }
    }
  }
}
