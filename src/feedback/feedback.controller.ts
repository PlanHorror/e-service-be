import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { FeedbackResponseDto } from './dto/feedback-response.dto';
import { Feedback } from '@prisma/client';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo feedback mới' })
  @ApiBody({ type: CreateFeedbackDto })
  @ApiResponse({ status: 201, description: 'Feedback created successfully', type: FeedbackResponseDto })
  async createFeedback(@Body() data: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.createFeedback(data);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả feedback' })
  @ApiResponse({ status: 200, description: 'List of feedbacks', type: [FeedbackResponseDto] })
  async getAllFeedbacks(): Promise<Feedback[]> {
    return this.feedbackService.getAllFeedbacks();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy feedback theo ID' })
  @ApiParam({ name: 'id', description: 'Feedback ID', example: 'uuid-string' })
  @ApiResponse({ status: 200, description: 'Feedback details', type: FeedbackResponseDto })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  async getFeedbackById(@Param('id') id: string): Promise<Feedback> {
    return this.feedbackService.getFeedbackById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật feedback theo ID' })
  @ApiParam({ name: 'id', description: 'Feedback ID', example: 'uuid-string' })
  @ApiBody({ type: UpdateFeedbackDto })
  @ApiResponse({ status: 200, description: 'Feedback updated successfully', type: FeedbackResponseDto })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  async updateFeedback(@Param('id') id: string, @Body() data: UpdateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.updateFeedback(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa feedback theo ID' })
  @ApiParam({ name: 'id', description: 'Feedback ID', example: 'uuid-string' })
  @ApiResponse({ status: 200, description: 'Feedback deleted successfully', type: FeedbackResponseDto })
  @ApiResponse({ status: 404, description: 'Feedback not found' })
  async deleteFeedback(@Param('id') id: string): Promise<Feedback> {
    return this.feedbackService.deleteFeedback(id);
  }
}