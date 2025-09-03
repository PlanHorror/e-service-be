import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { PrismaService } from '../prisma.service';  // Thêm import

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, PrismaService],  // Thêm PrismaService vào providers
})
export class FeedbackModule {}