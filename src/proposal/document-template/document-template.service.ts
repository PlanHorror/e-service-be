import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DocumentTemplate } from 'generated/prisma';
import {
  CreateDocumentTemplate,
  deleteFile,
  generateUniqueFileName,
  saveFile,
} from 'src/common';
import { PrismaService } from 'src/prisma.service';
import { DocumentTemplateCreateDto } from './dto/document-template-create.dto';
import { DocumentTemplateUpdateDto } from './dto/document-template-update.dto';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class DocumentTemplateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
  ) {}

  async getAllDocumentTemplates() {
    return this.prisma.documentTemplate.findMany();
  }

  async getDocumentTemplateById(id: string) {
    try {
      const documentTemplate = await this.prisma.documentTemplate.findUnique({
        where: { id },
      });
      if (!documentTemplate) {
        throw new NotFoundException('Document template not found');
      }
      return documentTemplate;
    } catch (error) {
      throw new NotFoundException('Document template not found');
    }
  }

  async createDocumentTemplate(data: CreateDocumentTemplate) {
    try {
      return await this.prisma.documentTemplate.create({
        data,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to create document template',
      );
    }
  }

  async updateDocumentTemplate(id: string, data: Partial<DocumentTemplate>) {
    await this.getDocumentTemplateById(id);
    try {
      return await this.prisma.documentTemplate.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to update document template',
      );
    }
  }

  async deleteDocumentTemplate(id: string) {
    const documentTemplate = await this.getDocumentTemplateById(id);
    try {
      deleteFile(documentTemplate.path);
    } catch {
      console.error('Failed to delete file associated with document template');
    }
    try {
      return await this.prisma.documentTemplate.delete({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to delete document template',
      );
    }
  }

  async createDocumentTemplateService(
    data: DocumentTemplateCreateDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Document is required');
    }
    await this.activityService.getActivityById(data.activity_id);
    const file_name = generateUniqueFileName(file);
    const path = `${process.env.ATTACHMENTS_PATH || 'attachments'}/${file_name}`;
    try {
      saveFile(file, path);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to save the document');
    }
    return await this.createDocumentTemplate({
      ...data,
      path,
    });
  }

  async updateDocumentTemplateService(
    id: string,
    data: DocumentTemplateUpdateDto,
    file?: Express.Multer.File,
  ) {
    const existingTemplate = await this.getDocumentTemplateById(id);
    if (file) {
      // Delete old file
      deleteFile(existingTemplate.path);
      const file_name = generateUniqueFileName(file);
      const path = `${process.env.ATTACHMENTS_PATH || 'attachments'}/${file_name}`;
      try {
        saveFile(file, path);
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Failed to save the document');
      }
      return await this.updateDocumentTemplate(id, {
        ...data,
        path,
      });
    }
    return await this.updateDocumentTemplate(id, data);
  }
}
