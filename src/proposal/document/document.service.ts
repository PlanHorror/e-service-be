import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DocumentCreateMultipleDto } from './dto/document-create.dto';
import {
  deleteFile,
  Document,
  generateUniqueFileName,
  saveFile,
} from 'src/common';

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

  async createMultipleDocument(data: Document[], files: Express.Multer.File[]) {
    let file_paths: Array<string> = [];
    try {
      files.map((file) => {
        const file_name = generateUniqueFileName(file);
        const path = `${process.env.ATTACHMENTS_PATH || 'attachments'}/${file_name}`;
        file_paths.push(path);
      });
      const documents = data.map((doc, index) => ({
        proposal_id: doc.proposal_id,
        document_id: doc.document_id,
        attachment_path: file_paths[index],
        mimetype: files[index].mimetype,
      }));
      return await this.prisma.documentProposal.createMany({
        data: documents,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating documents');
    }
  }
}
