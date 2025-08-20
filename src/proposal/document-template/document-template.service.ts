import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DocumentTemplate } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DocumentTemplateService {
  constructor(private readonly prisma: PrismaService) {}

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
      console.error(error);
      throw new NotFoundException('Document template not found');
    }
  }

  async createDocumentTemplate(data: any) {
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
    await this.getDocumentTemplateById(id);
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
}
