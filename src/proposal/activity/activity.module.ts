import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { PrismaService } from 'src/prisma.service';
import { ProposalTypeModule } from '../proposal-type/proposal-type.module';

@Module({
  providers: [ActivityService, PrismaService],
  controllers: [ActivityController],
  imports: [ProposalTypeModule],
})
export class ActivityModule {}
