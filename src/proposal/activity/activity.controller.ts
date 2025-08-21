import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
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

@ApiTags('Activities')
@Controller('proposal/activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @ApiOperation({ summary: 'Get all activities' })
  @ApiResponse({ status: 200, description: 'List of activities.' })
  @Get()
  async getAllActivities() {
    return this.activityService.getAllActivities();
  }

  @ApiOperation({ summary: 'Get activity by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Activity ID' })
  @ApiResponse({ status: 200, description: 'Activity found.' })
  @ApiResponse({ status: 404, description: 'Activity not found.' })
  @Get(':id')
  async getActivityById(@Param('id') id: string) {
    return this.activityService.getActivityById(id);
  }

  @ApiOperation({ summary: 'Create a new activity' })
  @ApiBody({ type: ActivityCreateDto })
  @ApiResponse({ status: 201, description: 'Activity created.' })
  @ApiResponse({
    status: 409,
    description: 'Activity with this slug already exists.',
  })
  @Post()
  async createActivity(@Body() data: ActivityCreateDto) {
    return this.activityService.createActivity(data);
  }

  @ApiOperation({ summary: 'Update an activity' })
  @ApiParam({ name: 'id', type: String, description: 'Activity ID' })
  @ApiBody({ type: ActivityUpdateDto })
  @ApiResponse({ status: 200, description: 'Activity updated.' })
  @ApiResponse({ status: 404, description: 'Activity not found.' })
  @Patch(':id')
  async updateActivity(
    @Param('id') id: string,
    @Body() data: ActivityUpdateDto,
  ) {
    return this.activityService.updateActivity(id, data);
  }

  @ApiOperation({ summary: 'Delete an activity' })
  @ApiParam({ name: 'id', type: String, description: 'Activity ID' })
  @ApiResponse({ status: 200, description: 'Activity deleted.' })
  @ApiResponse({ status: 404, description: 'Activity not found.' })
  @Delete(':id')
  async deleteActivity(@Param('id') id: string) {
    return this.activityService.deleteActivity(id);
  }
}
