import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { DocumentCreateDto, DocumentNested } from './dto/document-create.dto';
import {
  deleteFile,
  Document,
  generateUniqueFileName,
  saveFile,
} from '../../common';
import { DocumentProposal, DocumentTemplate, Prisma } from '@prisma/client';

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

  async createDocument(data: Document) {
    try {
      return await this.prisma.documentProposal.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating document');
    }
  }

  async updateDocument(id: string, data: Partial<DocumentProposal>) {
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

  async createMultipleDocument(
    proposal_id: string,
    data: DocumentTemplate[],
    files: Express.Multer.File[],
  ) {
    try {
      let documents: Prisma.DocumentProposalCreateManyInput[] = [];
      data.forEach((doc) => {
        const fieldnamePrefix = `files[${doc.id}]`;
        const listFile = files.filter((file) =>
          file.fieldname.startsWith(fieldnamePrefix),
        );
        listFile.forEach((file) => {
          const path = `${process.env.ATTACHMENTS_PATH || 'attachments'}/${generateUniqueFileName(file)}`;
          saveFile(file, path);
          documents.push({
            proposal_id,
            document_id: doc.id,
            attachment_path: path,
            mimetype: file.mimetype,
          });
        });
      });
      return await this.prisma.documentProposal.createMany({
        data: documents,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error creating documents');
    }
  }
}
