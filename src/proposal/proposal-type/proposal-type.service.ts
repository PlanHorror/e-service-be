import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProposalTypeCreateDto } from './dto/proposal-type-create.dto';
import { ProposalTypes } from 'generated/prisma';

@Injectable()
export class ProposalTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProposalTypes() {
    return this.prisma.proposalTypes.findMany();
  }

  async getProposalTypeById(id: string) {
    try {
      const proposalType = await this.prisma.proposalTypes.findUnique({
        where: { id },
      });
      if (!proposalType) {
        throw new NotFoundException('Proposal type not found');
      }
      return proposalType;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Proposal type not found');
    }
  }

  async createProposalType(data: ProposalTypeCreateDto) {
    try {
      return await this.prisma.proposalTypes.create({
        data,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Proposal type with this slug already exists',
        );
      }
      console.log(error);
      throw new InternalServerErrorException('Error creating proposal type');
    }
  }

  async updateProposalType(id: string, data: Partial<ProposalTypes>) {
    await this.getProposalTypeById(id);
    try {
      return await this.prisma.proposalTypes.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Proposal type with this slug already exists',
        );
      }
      console.log(error);
      throw new InternalServerErrorException('Error updating proposal type');
    }
  }

  async deleteProposalType(id: string) {
    await this.getProposalTypeById(id);
    try {
      return await this.prisma.proposalTypes.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error deleting proposal type');
    }
  }
}
