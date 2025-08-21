import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
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

@ApiTags('Proposal Types')
@Controller('proposal/type')
export class ProposalTypeController {
  constructor(private readonly proposalTypeService: ProposalTypeService) {}

  @ApiOperation({ summary: 'Get all proposal types' })
  @ApiResponse({ status: 200, description: 'List of proposal types.' })
  @Get()
  async getAllProposalTypes() {
    return this.proposalTypeService.getAllProposalTypes();
  }

  @ApiOperation({ summary: 'Get proposal type by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Proposal type ID' })
  @ApiResponse({ status: 200, description: 'Proposal type found.' })
  @ApiResponse({ status: 404, description: 'Proposal type not found.' })
  @Get(':id')
  async getProposalTypeById(@Param('id') id: string) {
    return this.proposalTypeService.getProposalTypeById(id);
  }

  @ApiOperation({ summary: 'Create a new proposal type' })
  @ApiBody({ type: ProposalTypeCreateDto })
  @ApiResponse({ status: 201, description: 'Proposal type created.' })
  @ApiResponse({
    status: 409,
    description: 'Proposal type with this slug already exists.',
  })
  @Post()
  async createProposalType(@Body() data: ProposalTypeCreateDto) {
    return this.proposalTypeService.createProposalType(data);
  }

  @ApiOperation({ summary: 'Update a proposal type' })
  @ApiParam({ name: 'id', type: String, description: 'Proposal type ID' })
  @ApiBody({ type: ProposalTypeUpdateDto })
  @ApiResponse({ status: 200, description: 'Proposal type updated.' })
  @ApiResponse({ status: 404, description: 'Proposal type not found.' })
  @Patch(':id')
  async updateProposalType(
    @Param('id') id: string,
    @Body() data: ProposalTypeUpdateDto,
  ) {
    return this.proposalTypeService.updateProposalType(id, data);
  }

  @ApiOperation({ summary: 'Delete a proposal type' })
  @ApiParam({ name: 'id', type: String, description: 'Proposal type ID' })
  @ApiResponse({ status: 200, description: 'Proposal type deleted.' })
  @ApiResponse({ status: 404, description: 'Proposal type not found.' })
  @Delete(':id')
  async deleteProposalType(@Param('id') id: string) {
    return this.proposalTypeService.deleteProposalType(id);
  }
}
