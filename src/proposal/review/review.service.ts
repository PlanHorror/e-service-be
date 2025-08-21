import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewCreateDto } from './dto/review-create.dto';
import { ProposalReview, User } from 'generated/prisma';
import { Review } from 'src/common';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllReview() {
    return this.prisma.proposalReview.findMany();
  }

  async getReview(id: string) {
    try {
      const review = await this.prisma.proposalReview.findUnique({
        where: { id },
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
}
