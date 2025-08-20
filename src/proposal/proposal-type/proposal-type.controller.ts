import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProposalTypeService } from './proposal-type.service';
import { ProposalTypeCreateDto } from './dto/proposal-type-create.dto';
import { ProposalTypeUpdateDto } from './dto/proposal-type-update.dto';

@Controller('proposal/type')
export class ProposalTypeController {
  constructor(private readonly proposalTypeService: ProposalTypeService) {}

  @Get()
  getAllProposalTypes() {
    return this.proposalTypeService.getAllProposalTypes();
  }

  @Get(':id')
  getProposalTypeById(@Param('id') id: string) {
    return this.proposalTypeService.getProposalTypeById(id);
  }

  @Post()
  createProposalType(@Body() createProposalTypeDto: ProposalTypeCreateDto) {
    return this.proposalTypeService.createProposalType(createProposalTypeDto);
  }

  @Patch(':id')
  updateProposalType(
    @Param('id') id: string,
    @Body() updateProposalTypeDto: ProposalTypeUpdateDto,
  ) {
    return this.proposalTypeService.updateProposalType(
      id,
      updateProposalTypeDto,
    );
  }

  @Delete(':id')
  deleteProposalType(@Param('id') id: string) {
    return this.proposalTypeService.deleteProposalType(id);
  }
}
