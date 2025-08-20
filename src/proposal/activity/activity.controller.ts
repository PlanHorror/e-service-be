import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityUpdateDto } from './dto/activity-update.dto';
import { ActivityCreateDto } from './dto/activity-create.dto';

@Controller('proposal/activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async getAllActivities() {
    return this.activityService.getAllActivities();
  }

  @Get(':id')
  async getActivityById(@Param('id') id: string) {
    return this.activityService.getActivityById(id);
  }

  @Post()
  async createActivity(@Body() data: ActivityCreateDto) {
    return this.activityService.createActivity(data);
  }

  @Patch(':id')
  async updateActivity(
    @Param('id') id: string,
    @Body() data: ActivityUpdateDto,
  ) {
    return this.activityService.updateActivity(id, data);
  }

  @Delete(':id')
  async deleteActivity(@Param('id') id: string) {
    return this.activityService.deleteActivity(id);
  }
}
