import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ProposalService, PrismaService],
  controllers: [ProposalController],
  exports: [ProposalService],
})
export class ProposalModule {}
