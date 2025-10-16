import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalCreateDto } from './dto/proposal-create.dto';
import { ProposalUpdateDto } from './dto/proposal-update.dto';
import {
  AnyFilesInterceptor,
} from '@nestjs/platform-express';
import {
  ProposalAllQueryDto,
  ProposalQueryDto,
} from './dto/proposal-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Proposals')
@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all proposals with pagination' })
  @ApiResponse({ status: 200, description: 'Proposals retrieved successfully' })
  async getAllProposals(@Query() query: ProposalAllQueryDto) {
    return this.proposalService.getProposalService(
      query.page,
      query.limit,
      query.order,
      query.status,
    );
  }

  @Get('find/:id')
  @ApiOperation({ summary: 'Get proposal by ID' })
  @ApiResponse({ status: 200, description: 'Proposal retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  async getProposalById(@Param('id') id: string) {
    return this.proposalService.getProposalById(id);
  }

  @Get('find')
  @ApiOperation({ summary: 'Get proposal by email' })
  @ApiResponse({ status: 200, description: 'Proposal retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  async getProposalByEmail(@Query('email') email: string) {
    return this.proposalService.getProposalByEmail(email);
  }

  @Post('find')
  @ApiOperation({ summary: 'Find proposal by code and security code' })
  @ApiResponse({ status: 200, description: 'Proposal found' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  async findProposalsByCode(@Body() query: ProposalQueryDto) {
    return this.proposalService.findProposalsByCodeService(query);
  }

  @Post('send')
  @ApiOperation({ summary: 'Create new proposal with documents and extra files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Proposal data with required documents and optional extra files with metadata',
    schema: {
      type: 'object',
      properties: {
        activity_id: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        full_name: {
          type: 'string',
          example: 'John Doe',
        },
        email: {
          type: 'string',
          example: 'john@example.com',
        },
        phone: {
          type: 'string',
          example: '+84987654321',
        },
        address: {
          type: 'string',
          example: '123 Main St',
        },
        state: {
          type: 'string',
          enum: ['DRAFT', 'SUBMITTED', 'PUBLIC'],
          example: 'SUBMITTED',
          description: 'Proposal state (optional, defaults to DRAFT)',
        },
        note: {
          type: 'string',
          example: 'Special requirements',
          description: 'Additional notes (optional)',
        },
        'files[documentTemplateId]': {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Required document files (fieldname format: files[templateId])',
        },
        extraFiles: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Additional optional files',
        },
        'extraFilesMetadata[0][name]': {
          type: 'string',
          example: 'Additional Certificate',
          description: 'Name for extra file at index 0 (optional)',
        },
        'extraFilesMetadata[0][description]': {
          type: 'string',
          example: 'Extra certification document',
          description: 'Description for extra file at index 0 (optional)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Proposal created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or missing files' })
  @ApiResponse({ status: 422, description: 'File validation failed' })
  @UseInterceptors(AnyFilesInterceptor())
  async createProposal(
    @Body() data: ProposalCreateDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
  ) {
    const requiredFiles = files.filter((file) => file.fieldname.startsWith('files['));
    const extraFiles = files.filter((file) => file.fieldname === 'extraFiles');

    return this.proposalService.createProposalService(
      data,
      requiredFiles,
      extraFiles.length > 0 ? extraFiles : undefined,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update proposal with optional new documents and extra files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update proposal data with optional new files',
    schema: {
      type: 'object',
      properties: {
        full_name: {
          type: 'string',
          example: 'John Doe',
          description: 'Full name (optional)',
        },
        email: {
          type: 'string',
          example: 'john@example.com',
          description: 'Email address (optional)',
        },
        phone: {
          type: 'string',
          example: '+84987654321',
          description: 'Phone number (optional)',
        },
        address: {
          type: 'string',
          example: '123 Main St',
          description: 'Address (optional)',
        },
        state: {
          type: 'string',
          enum: ['DRAFT', 'SUBMITTED', 'PUBLIC'],
          example: 'SUBMITTED',
          description: 'Proposal state (optional)',
        },
        status: {
          type: 'string',
          enum: ['PENDING', 'AIAPPROVED', 'MANAGERAPPROVED', 'REJECTED'],
          example: 'PENDING',
          description: 'Proposal status (optional)',
        },
        note: {
          type: 'string',
          example: 'Updated requirements',
          description: 'Additional notes (optional)',
        },
        respond: {
          type: 'string',
          example: 'Approved with conditions',
          description: 'Admin/Manager response (optional)',
        },
        'files[documentTemplateId]': {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'New document files to add (optional, fieldname format: files[templateId])',
        },
        extraFiles: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'New extra files to add (optional)',
        },
        'extraFilesMetadata[0][name]': {
          type: 'string',
          example: 'New Certificate',
          description: 'Name for new extra file at index 0 (optional)',
        },
        'extraFilesMetadata[0][description]': {
          type: 'string',
          example: 'New document description',
          description: 'Description for new extra file at index 0 (optional)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Proposal updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  @ApiResponse({ status: 422, description: 'File validation failed' })
  @UseInterceptors(AnyFilesInterceptor())
  
  async updateProposal(
    @Param('id') id: string,
    @Body() data: ProposalUpdateDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files?: Array<Express.Multer.File>,
  ) {
    const requiredFiles = files?.filter((file) => file.fieldname.startsWith('files['));
    const extraFiles = files?.filter((file) => file.fieldname === 'extraFiles');

    return this.proposalService.updateProposalService(
      id,
      data,
      requiredFiles,
      (extraFiles ?? []).length > 0 ? extraFiles : undefined,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete proposal by ID' })
  @ApiResponse({ status: 200, description: 'Proposal deleted successfully' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  async deleteProposal(@Param('id') id: string) {
    return this.proposalService.deleteProposal(id);
  }
}