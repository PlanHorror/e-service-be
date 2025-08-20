import { Module } from '@nestjs/common';
import { DocumentTemplateService } from './document-template.service';
import { DocumentTemplateController } from './document-template.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [DocumentTemplateService, PrismaService],
  controllers: [DocumentTemplateController],
})
export class DocumentTemplateModule {}
