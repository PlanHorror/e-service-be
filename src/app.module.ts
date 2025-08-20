import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminAuthModule } from './admin/auth/auth.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { ProposalTypeModule } from './proposal/proposal-type/proposal-type.module';
import { ActivityModule } from './proposal/activity/activity.module';
import { ActivityService } from './porposal/activity/activity.service';
import { ActivityController } from './porposal/activity/activity.controller';

@Module({
  imports: [
    AuthModule,
    AccountModule,
    ProposalTypeModule,
    ActivityModule,
    AdminAuthModule,
  ],
  controllers: [AppController, ActivityController],
  providers: [AppService, ActivityService],
})
export class AppModule {}
