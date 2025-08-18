import { Module } from '@nestjs/common';
import { DeNghiService } from './de-nghi.service';
import { DeNghiController } from './de-nghi.controller';

@Module({
  providers: [DeNghiService],
  controllers: [DeNghiController]
})
export class DeNghiModule {}
