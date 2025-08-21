import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProposalService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProposals() {
    return this.prisma.proposal.findMany();
  }

  async getProposalById(id: string) {
    try {
      const proposal = await this.prisma.proposal.findUnique({
        where: { id },
      });
      if (!proposal) {
        throw new NotFoundException('Proposal not found');
      }
      return proposal;
    } catch {
      throw new NotFoundException('Proposal not found');
    }
  }

  async createProposal(data: any) {
    try {
      return await this.prisma.proposal.create({
        data,
      });
    } catch {
      throw new InternalServerErrorException('Error creating proposal');
    }
  }

  async updateProposal(id: string, data: any) {
    await this.getProposalById(id);
    try {
      const proposal = await this.prisma.proposal.update({
        where: { id },
        data,
      });
      return proposal;
    } catch {
      throw new InternalServerErrorException('Error updating proposal');
    }
  }

  async deleteProposal(id: string) {
    await this.getProposalById(id);
    try {
      await this.prisma.proposal.delete({
        where: { id },
      });
    } catch {
      throw new InternalServerErrorException('Error deleting proposal');
    }
  }
}
