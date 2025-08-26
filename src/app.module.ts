import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { ProposalTypeModule } from './proposal/proposal-type/proposal-type.module';
import { ActivityModule } from './proposal/activity/activity.module';
import { DocumentTemplateModule } from './proposal/document-template/document-template.module';
import { ProposalModule } from './proposal/proposal.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DocumentModule } from './proposal/document/document.module';
import { ReviewModule } from './proposal/review/review.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    AccountModule,
    ProposalTypeModule,
    ActivityModule,
    DocumentTemplateModule,
    ProposalModule,
    DocumentModule,
    ReviewModule,
    CronModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
