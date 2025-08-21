import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { PrismaService } from 'src/prisma.service';
import { DocumentModule } from './document/document.module';
import { ActivityModule } from './activity/activity.module';
import { ReviewModule } from './review/review.module';

@Module({
  providers: [ProposalService, PrismaService],
  controllers: [ProposalController],
  exports: [ProposalService],
  imports: [DocumentModule, ActivityModule, ReviewModule],
})
export class ProposalModule {}
