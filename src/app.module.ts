import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeNghiModule } from './de-nghi/de-nghi.module';

@Module({
  imports: [DeNghiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
