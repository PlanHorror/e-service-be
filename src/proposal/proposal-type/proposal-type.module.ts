import { Module } from '@nestjs/common';
import { ProposalTypeController } from './proposal-type.controller';
import { ProposalTypeService } from './proposal-type.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [ProposalTypeController],
  providers: [ProposalTypeService, PrismaService],
  exports: [ProposalTypeService],
})
export class ProposalTypeModule {}
