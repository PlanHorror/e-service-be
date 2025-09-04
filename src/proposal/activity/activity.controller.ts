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
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityUpdateDto } from './dto/activity-update.dto';
import {
  ActivityCreateDto,
  ActivityTemplateCreateDto,
} from './dto/activity-create.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

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

  @Post('templates')
  @ApiOperation({ summary: 'Create a new activity template' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        proposalType_id: {
          type: 'string',
          format: 'uuid',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        name: {
          type: 'string',
          example: 'Data Collection',
        },
        slug: {
          type: 'string',
          example: 'data-collection',
        },
        description: {
          type: 'string',
          example: 'Collecting research data',
        },
        display_order: {
          type: 'number',
          example: 1,
        },
        documentTemplates: {
          type: 'array',
          example: [
            {
              name: 'Research Plan',
              quantity: 1,
              display_order: 1,
              is_required: true,
              file: 'Attachment file',
            },
            {
              name: 'Data Form',
              quantity: 2,
              display_order: 2,
              is_required: false,
              file: 'Attachment file',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Activity template created.' })
  @ApiResponse({
    status: 409,
    description: 'Activity with this slug already exists.',
  })
  @UseInterceptors(AnyFilesInterceptor())
  async createActivityTemplate(
    @Body() data: ActivityTemplateCreateDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.activityService.createActivityTemplate(data, files);
    // console.log(data, files);
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
