import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFeedbackDto } from './dto/feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async createFeedback(data: CreateFeedbackDto): Promise<Feedback> {
    return this.prisma.feedback.create({
      data,
    });
  }

  async getAllFeedbacks(): Promise<Feedback[]> {
    return this.prisma.feedback.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async getFeedbackById(id: string): Promise<Feedback> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
    });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    return feedback;
  }

  async updateFeedback(id: string, data: UpdateFeedbackDto): Promise<Feedback> {
    await this.getFeedbackById(id); // Kiểm tra tồn tại
    return this.prisma.feedback.update({
      where: { id },
      data,
    });
  }

  async deleteFeedback(id: string): Promise<Feedback> {
    await this.getFeedbackById(id); // Kiểm tra tồn tại
    return this.prisma.feedback.delete({
      where: { id },
    });
  }
}