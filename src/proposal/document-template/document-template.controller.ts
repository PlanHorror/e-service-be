import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentTemplateService } from './document-template.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentTemplateCreateDto } from './dto/document-template-create.dto';
import { DocumentTemplateUpdateDto } from './dto/document-template-update.dto';

@Controller('proposal/template')
export class DocumentTemplateController {
  constructor(
    private readonly documentTemplateService: DocumentTemplateService,
  ) {}

  @Get()
  async getAllTemplates() {
    return this.documentTemplateService.getAllDocumentTemplates();
  }

  @Get(':id')
  async getTemplateById(@Param('id') id: string) {
    return this.documentTemplateService.getDocumentTemplateById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createTemplate(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() body: DocumentTemplateCreateDto,
  ) {
    return this.documentTemplateService.createDocumentTemplateService(
      body,
      file,
    );
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateTemplate(
    @Param('id') id: string,
    @Body() body: DocumentTemplateUpdateDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return this.documentTemplateService.updateDocumentTemplateService(
      id,
      body,
      file,
    );
  }

  @Delete(':id')
  async deleteTemplate(@Param('id') id: string) {
    return this.documentTemplateService.deleteDocumentTemplate(id);
  }
}
