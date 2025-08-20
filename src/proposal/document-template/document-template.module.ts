import { Module } from '@nestjs/common';
import { DocumentTemplateService } from './document-template.service';
import { DocumentTemplateController } from './document-template.controller';

@Module({
  providers: [DocumentTemplateService],
  controllers: [DocumentTemplateController]
})
export class DocumentTemplateModule {}
