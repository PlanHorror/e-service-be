import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalCreateDto } from './dto/proposal-create.dto';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get('all')
  async getAllProposals() {
    return this.proposalService.getAllProposals();
  }

  @Get('find/:id')
  async getProposalById(@Param('id') id: string) {
    return this.proposalService.getProposalById(id);
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
}
