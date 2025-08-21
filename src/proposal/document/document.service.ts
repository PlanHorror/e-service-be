import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllDocuments() {
    return this.prisma.documentProposal.findMany();
  }

  async getDocumentById(id: string) {
    try {
      const document = await this.prisma.documentProposal.findUnique({
        where: { id },
      });
      if (!document) {
        throw new NotFoundException('Document not found');
      }
      return document;
    } catch (error) {
      throw new NotFoundException('Document not found');
    }
  }

  async createDocument(data: any) {
    try {
      return await this.prisma.documentProposal.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating document');
    }
  }

  async updateDocument(id: string, data: any) {
    await this.getDocumentById(id);
    try {
      return await this.prisma.documentProposal.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating document');
    }
  }

  async deleteDocument(id: string) {
    await this.getDocumentById(id);
    try {
      await this.prisma.documentProposal.delete({
        where: { id },
      });
      return { message: 'Document deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting document');
    }
  }
}
