import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalCreateDto } from './dto/proposal-create.dto';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  ProposalAllQueryDto,
  ProposalQueryDto,
} from './dto/proposal-query.dto';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get('all')
  async getAllProposals(@Query() query: ProposalAllQueryDto) {
    return this.proposalService.getProposalService(
      query.page,
      query.limit,
      query.order,
      query.status,
    );
  }

  @Get('find/:id')
  async getProposalById(@Param('id') id: string) {
    return this.proposalService.getProposalById(id);
  }

  @Post('find')
  async findProposalsByCode(@Body() query: ProposalQueryDto) {
    return this.proposalService.findProposalsByCodeService(query);
  }

  @Post('send')
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
    return this.proposalService.createProposalService(data, files);
    // console.log(files);
  }

  @Delete(':id')
  async deleteProposal(@Param('id') id: string) {
    return this.proposalService.deleteProposal(id);
  }
}
