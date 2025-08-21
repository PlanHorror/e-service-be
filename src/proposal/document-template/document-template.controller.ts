import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
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

@ApiTags('Document Templates')
@Controller('proposal/template')
export class DocumentTemplateController {
  constructor(
    private readonly documentTemplateService: DocumentTemplateService,
  ) {}

  @ApiOperation({ summary: 'Get all document templates' })
  @ApiResponse({ status: 200, description: 'List of document templates.' })
  @Get()
  async getAllTemplates() {
    return this.documentTemplateService.getAllDocumentTemplates();
  }

  @ApiOperation({ summary: 'Get document template by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Document template ID' })
  @ApiResponse({ status: 200, description: 'Document template found.' })
  @ApiResponse({ status: 404, description: 'Document template not found.' })
  @Get(':id')
  async getTemplateById(@Param('id') id: string) {
    return this.documentTemplateService.getDocumentTemplateById(id);
  }

  @ApiOperation({ summary: 'Create a new document template' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Document template data with file',
    type: DocumentTemplateCreateDto,
  })
  @ApiResponse({ status: 201, description: 'Document template created.' })
  @ApiResponse({ status: 422, description: 'File validation failed.' })
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

  @ApiOperation({ summary: 'Update a document template' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: String, description: 'Document template ID' })
  @ApiBody({
    description: 'Document template data with optional file',
    type: DocumentTemplateUpdateDto,
  })
  @ApiResponse({ status: 200, description: 'Document template updated.' })
  @ApiResponse({ status: 404, description: 'Document template not found.' })
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

  @ApiOperation({ summary: 'Delete a document template' })
  @ApiParam({ name: 'id', type: String, description: 'Document template ID' })
  @ApiResponse({ status: 200, description: 'Document template deleted.' })
  @ApiResponse({ status: 404, description: 'Document template not found.' })
  @Delete(':id')
  async deleteTemplate(@Param('id') id: string) {
    return this.documentTemplateService.deleteDocumentTemplate(id);
  }
}
