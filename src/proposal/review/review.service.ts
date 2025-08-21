import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewCreateDto } from './dto/review-create.dto';
import { ProposalReview, ProposalStatus, User } from 'generated/prisma';
import { Review } from 'src/common';
import { ProposalService } from '../proposal.service';
import { ReviewUpdateDto } from './dto/review-update.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly proposalService: ProposalService,
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
    if (
      proposal.status === ProposalStatus.REJECTED ||
      proposal.status === ProposalStatus.MANAGERAPPROVED
    ) {
      throw new BadRequestException(
        'Cannot create review for rejected or manager-approved proposals',
      );
    }
    this.proposalService.updateProposal(proposal.id, {
      status: data.accepted
        ? ProposalStatus.MANAGERAPPROVED
        : ProposalStatus.REJECTED,
    });
    // Create the review
    return this.createReview({
      proposal_id: data.proposal_id,
      reviewer_id: user.id,
      comments: data.comments,
      accepted: data.accepted,
    });
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
