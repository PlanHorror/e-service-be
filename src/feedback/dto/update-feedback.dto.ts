import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { FeedbackCategory } from '@prisma/client';

export class UpdateFeedbackDto {
  @ApiProperty({ description: 'Họ và tên (tùy chọn)', example: 'Nguyễn Văn A', required: false })
  @IsString()
  @IsOptional()
  hoTen?: string;

  @ApiProperty({ description: 'Email (tùy chọn)', example: 'example@email.com', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Số điện thoại (tùy chọn)', example: '0123456789', required: false })
  @IsString()
  @IsOptional()
  soDienThoai?: string;

  @ApiProperty({ description: 'Địa chỉ (tùy chọn)', example: '123 Đường ABC, TP.HCM', required: false })
  @IsString()
  @IsOptional()
  diaChi?: string;

  @ApiProperty({ description: 'Danh mục feedback (tùy chọn)', enum: FeedbackCategory, example: 'DICHVUCONG', required: false })
  @IsEnum(FeedbackCategory)
  @IsOptional()
  danhMuc?: FeedbackCategory;

  @ApiProperty({ description: 'Tiêu đề (tùy chọn)', example: 'Góp ý về dịch vụ', required: false })
  @IsString()
  @IsOptional()
  tieuDe?: string;

  @ApiProperty({ description: 'Nội dung (tùy chọn)', example: 'Dịch vụ rất tốt, nhưng có thể cải thiện...', required: false })
  @IsString()
  @IsOptional()
  noiDung?: string;

  @ApiProperty({ description: 'Ghi chú (tùy chọn)', example: 'Thêm thông tin nếu cần', required: false })
  @IsString()
  @IsOptional()
  ghiChu?: string;
}