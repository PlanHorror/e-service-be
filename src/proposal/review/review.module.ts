import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from '../../prisma.service';
import { ProposalModule } from '../proposal.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  providers: [ReviewService, PrismaService],
  controllers: [ReviewController],
  imports: [ProposalModule, AuthModule],
})
export class ReviewModule {}
