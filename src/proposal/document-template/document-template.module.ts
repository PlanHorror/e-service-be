import { Module } from '@nestjs/common';
import { DocumentTemplateService } from './document-template.service';
import { DocumentTemplateController } from './document-template.controller';
import { PrismaService } from '../../prisma.service';
import { ActivityModule } from '../activity/activity.module';

@Module({
  providers: [DocumentTemplateService, PrismaService],
  controllers: [DocumentTemplateController],
  imports: [ActivityModule],
})
export class DocumentTemplateModule {}
