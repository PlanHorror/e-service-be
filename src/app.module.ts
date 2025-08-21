import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminAuthModule } from './admin/auth/auth.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { ProposalTypeModule } from './proposal/proposal-type/proposal-type.module';
import { ActivityModule } from './proposal/activity/activity.module';
import { DocumentTemplateModule } from './proposal/document-template/document-template.module';
import { ProposalModule } from './proposal/proposal.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AuthModule,
    AccountModule,
    ProposalTypeModule,
    ActivityModule,
    AdminAuthModule,
    DocumentTemplateModule,
    ProposalModule,
    CronModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
