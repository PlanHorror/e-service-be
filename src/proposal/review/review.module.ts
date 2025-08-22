import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from 'src/prisma.service';
import { ProposalModule } from '../proposal.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ReviewService, PrismaService],
  controllers: [ReviewController],
  imports: [ProposalModule, AuthModule],
})
export class ReviewModule {}
