import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DocumentService } from './document/document.service';
import { ProposalCreateDto } from './dto/proposal-create.dto';
import { ActivityService } from './activity/activity.service';
import { Proposal, ProposalStatus } from '@prisma/client';
import { generateCode, generateSecurityCode, ProposalCreate } from '../common';
import { ProposalQueryDto } from './dto/proposal-query.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ProposalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documentService: DocumentService,
    private readonly activityService: ActivityService,
    private readonly mailService: MailService,
  ) {}

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

  async createProposal(data: ProposalCreate) {
    try {
      return await this.prisma.proposal.create({
        data,
      });
    } catch {
      throw new InternalServerErrorException('Error creating proposal');
    }
  }

  async updateProposal(id: string, data: Partial<Proposal>) {
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

  async findProposalsByCodeService(query: ProposalQueryDto) {
    const proposals = await this.prisma.proposal.findUnique({
      where: {
        security_code: query.security_code,
        code: query.code,
      },
      include: {
        activity: {
          include: {
            proposalType: true,
          },
        },
      },
    });
    if (!proposals) {
      throw new NotFoundException('Proposals not found');
    }
    return proposals;
  }

  async createProposalService(
    data: ProposalCreateDto,
    files: Express.Multer.File[],
  ) {
    const activity = await this.activityService.getActivityById(
      data.activity_id,
    );
    activity.documentTemplates.forEach((template) => {
      const filename = `files[${template.id}]`;
      const list_file = files.filter((file) =>
        file.fieldname.startsWith(filename),
      );
      if (list_file.length !== template.quantity) {
        throw new BadRequestException(
          `Invalid number of files for document template ${template.name}`,
        );
      }
    });
    let code: string;
    while (true) {
      code = generateCode();
      const existingProposal = await this.prisma.proposal.findUnique({
        where: { code },
      });
      if (!existingProposal) {
        code = code;
        break;
      }
    }
    const security_code = generateSecurityCode();
    const proposal = await this.createProposal({
      activity_id: data.activity_id,
      code,
      security_code,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      note: data.note,
    });
    const documents = this.documentService.createMultipleDocument(
      proposal.id,
      activity.documentTemplates,
      files,
    );
    await this.mailService.sendProposalCreationConfirmation(proposal);
    await this.mailService.sendManagerNotification(proposal);
    return {
      proposal,
      documents,
    };
  }

  async getProposalService(status: string, from: number, to: number) {
    if (status) {
      let statusEnum: ProposalStatus;
      switch (status) {
        case 'PENDING':
          statusEnum = ProposalStatus.PENDING;
          break;
        case 'AIAPPROVED':
          statusEnum = ProposalStatus.AIAPPROVED;
          break;
        case 'MANAGER_APPROVED':
          statusEnum = ProposalStatus.MANAGERAPPROVED;
          break;
        case 'REJECTED':
          statusEnum = ProposalStatus.REJECTED;
          break;
        default:
          throw new BadRequestException('Invalid status');
      }
      return this.prisma.proposal.findMany({
        where: { status: statusEnum },
        take: to,
        include: {
          activity: {
            include: {
              proposalType: true,
            },
          },
          documents: true,
        },
        skip: from,
        orderBy: {
          created_at: 'desc',
        },
      });
    }

    return this.prisma.proposal.findMany({
      take: to,
      include: {
        activity: {
          include: {
            proposalType: true,
          },
        },
        documents: true,
      },
      skip: from,
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
