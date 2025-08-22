import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewCreateDto } from './dto/review-create.dto';
import { ReviewUpdateDto } from './dto/review-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators';
import { User } from 'generated/prisma';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAllReviews() {
    return this.reviewService.getAllReview();
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    return this.reviewService.getReview(id);
  }

  // @Post()
  // async createReview(@Body() data: ReviewCreateDto) {
  //   return this.reviewService.createReview(data);
  // }

  // @Patch(':id')
  // async updateReview(@Param('id') id: string, @Body() data: ReviewUpdateDto) {
  //   return this.reviewService.updateReview(id, data);
  // }

  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    return this.reviewService.deleteReview(id);
  }

  @Post('send')
  @UseGuards(AuthGuard('auth'))
  async sendReview(@Body() data: ReviewCreateDto, @GetUser() user: User) {
    return this.reviewService.createReviewService(data, user);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard('auth'))
  async updateReview(
    @Param('id') id: string,
    @Body() data: ReviewUpdateDto,
    @GetUser() user: User,
  ) {
    return this.reviewService.updateReviewService(id, data, user);
  }
}
