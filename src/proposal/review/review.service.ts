import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ReviewCreateDto } from './dto/review-create.dto';
import { ProposalReview, ProposalStatus, User } from '@prisma/client';
import { Review } from '../../common';
import { ProposalService } from '../proposal.service';
import { ReviewUpdateDto } from './dto/review-update.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly proposalService: ProposalService,
    private readonly mailService: MailService,
  ) {}

  async getAllReview() {
    return this.prisma.proposalReview.findMany();
  }

  async getReview(id: string) {
    try {
      const review = await this.prisma.proposalReview.findUnique({
        where: { id },
        include: {
          proposal: true,
          reviewer: true,
        },
      });
      if (!review) {
        throw new NotFoundException('Review not found');
      }
      return review;
    } catch (error) {
      throw new NotFoundException(`Review not found`);
    }
  }

  async createReview(data: Review) {
    try {
      return await this.prisma.proposalReview.create({
        data,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('You have already reviewed this proposal');
      }
      throw new InternalServerErrorException(
        `Failed to create review: ${error.message}`,
      );
    }
  }

  async updateReview(id: string, data: Partial<ProposalReview>) {
    try {
      return await this.prisma.proposalReview.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('You have already reviewed this proposal');
      }
      throw new InternalServerErrorException(
        `Failed to update review: ${error.message}`,
      );
    }
  }

  async deleteReview(id: string) {
    try {
      await this.prisma.proposalReview.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete review: ${error.message}`,
      );
    }
  }

  async createReviewService(data: ReviewCreateDto, user: User) {
    const proposal = await this.proposalService.getProposalById(
      data.proposal_id,
    );
    data.document_ids.forEach((document_id) => {
      const document = proposal.documents.find((doc) => doc.id === document_id);
      if (!document) {
        throw new BadRequestException(`Document ID ${document_id} is invalid`);
      }
    });
    if (
      proposal.status === ProposalStatus.REJECTED ||
      proposal.status === ProposalStatus.MANAGERAPPROVED
    ) {
      throw new BadRequestException(
        'Cannot create review for rejected or manager-approved proposals',
      );
    }
    // Cập nhật status proposal
    await this.proposalService.updateProposal(proposal.id, {
      status: data.accepted
        ? ProposalStatus.MANAGERAPPROVED
        : ProposalStatus.REJECTED,
    });
    // Set status mới trực tiếp vào object (tốt hơn: tránh query thừa)
    proposal.status = data.accepted
      ? ProposalStatus.MANAGERAPPROVED
      : ProposalStatus.REJECTED;
    // Change all documents' pass status
    try {
      await this.prisma.documentProposal.updateMany({
        where: {
          id: { in: data.document_ids },
        },
        data: {
          pass: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update document status: ${error.message}`,
      );
    }
    // Tạo review
    const review = await this.createReview({
      proposal_id: data.proposal_id,
      reviewer_id: user.id,
      comments: data.comments,
      accepted: data.accepted,
    });
    // Gửi email thông báo cho user
    this.mailService.sendReviewNotification(proposal, review);
    return proposal;
  }

  async updateReviewService(id: string, data: ReviewUpdateDto, user: User) {
    const review = await this.getReview(id);
    if (review.reviewer_id !== user.id) {
      throw new UnauthorizedException(
        'You are not allowed to update this review',
      );
    }
    if (
      review.proposal.status !== ProposalStatus.REJECTED &&
      review.proposal.status !== ProposalStatus.MANAGERAPPROVED
    ) {
      throw new BadRequestException('Cannot update review for this proposal');
    } else {
      this.proposalService.updateProposal(review.proposal_id, {
        status: data.accepted
          ? ProposalStatus.MANAGERAPPROVED
          : ProposalStatus.REJECTED,
      });
    }
    // Update the review
    return this.updateReview(id, {
      reviewer_id: user.id,
      comments: data.comments,
      accepted: data.accepted,
    });
  }
}
