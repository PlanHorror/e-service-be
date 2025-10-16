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
import { Proposal, ProposalStatus, ProposalState, ExtraDocumentProposal } from '@prisma/client';
import { generateCode, generateSecurityCode, generateUniqueFileName, saveFile, ProposalCreate } from '../common';
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
        include: {
          documents: {
            include: {
              document: true,
            },
          },
        },
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
    const proposal = await this.prisma.proposal.findUnique({
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

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    if (proposal.status === ProposalStatus.REJECTED) {
      const proposalWithReviews = await this.prisma.proposal.findUnique({
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
          proposalReviews: {
            select: {
              id: true,
              comments: true,
              accepted: true,
              created_at: true,
              reviewer: {
                select: {
                  id: true,
                  email: true,
                  username: true,
                  full_name: true,
                  role: true,
                },
              },
            },
          },
        },
      });
      return proposalWithReviews;
    }

    return proposal;
  }

  async createProposalService(
    data: ProposalCreateDto,
    files: Express.Multer.File[],
    extraFiles?: Express.Multer.File[],
  ) {
    const activity = await this.activityService.getActivityById(
      data.activity_id,
    );
    activity.documentTemplates.forEach((template) => {
      const filename = `files[${template.id}]`;
      const list_file = files.filter((file) =>
        file.fieldname.startsWith(filename),
      );
      if (list_file.length < template.quantity) {
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
      state: data.state ? (data.state as ProposalState) : ProposalState.DRAFT,
    });
    const documents = this.documentService.createMultipleDocument(
      proposal.id,
      activity.documentTemplates,
      files,
    );
    let extraDocuments: ExtraDocumentProposal[] = [];
    if (extraFiles && extraFiles.length > 0) {
      extraDocuments = await Promise.all(
        extraFiles.map(async (file) => {
          const fileName = generateUniqueFileName(file);
          const path = `${process.env.ATTACHMENTS_PATH || 'attachments'}/${fileName}`;
          await saveFile(file, path);
          return this.prisma.extraDocumentProposal.create({
            data: {
              proposal_id: proposal.id,
              name: file.originalname,
              description: null,
              attachment_path: path,
              mimetype: file.mimetype,
            },
          });
        }),
      );
    }
    this.mailService.sendProposalCreationConfirmation(proposal);
    this.mailService.sendManagerNotification(proposal);
    return {
      proposal,
      documents,
      extraDocuments,
    };
  }

  async getProposalService(
    page: number = 1,
    limit: number = 10,
    order: 'asc' | 'desc' = 'desc',
    status?: string,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const whereClause = status
      ? {
          status: this.mapStatusToEnum(status),
        }
      : {};

    const data = await this.prisma.proposal.findMany({
      where: whereClause,
      take,
      skip,
      include: {
        activity: {
          include: {
            proposalType: true,
          },
        },
        documents: {
          include: {
            document: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: order,
      },
    });

    let total: number | undefined;
    if (page === 1) {
      total = await this.prisma.proposal.count({
        where: whereClause,
      });
    }

    return {
      data,
      total,
      page,
      limit,
    };
  }

  private mapStatusToEnum(status: string): ProposalStatus {
    switch (status) {
      case 'PENDING':
        return ProposalStatus.PENDING;
      case 'AIAPPROVED':
        return ProposalStatus.AIAPPROVED;
      case 'MANAGERAPPROVED':
        return ProposalStatus.MANAGERAPPROVED;
      case 'REJECTED':
        return ProposalStatus.REJECTED;
      default:
        throw new BadRequestException('Invalid status');
    }
  }
}