import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { FeedbackCategory } from '@prisma/client';

export class CreateFeedbackDto {
  @ApiProperty({ description: 'Họ và tên', example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  hoTen: string;

  @ApiProperty({ description: 'Email', example: 'example@email.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Số điện thoại', example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  soDienThoai: string;

  @ApiProperty({ description: 'Địa chỉ', example: '123 Đường ABC, TP.HCM' })
  @IsString()
  @IsNotEmpty()
  diaChi: string;

  @ApiProperty({ description: 'Danh mục feedback', enum: FeedbackCategory, example: 'DICHVUCONG' })
  @IsEnum(FeedbackCategory)
  @IsNotEmpty()
  danhMuc: FeedbackCategory;

  @ApiProperty({ description: 'Tiêu đề', example: 'Góp ý về dịch vụ' })
  @IsString()
  @IsNotEmpty()
  tieuDe: string;

  @ApiProperty({ description: 'Nội dung', example: 'Dịch vụ rất tốt!' })
  @IsString()
  @IsNotEmpty()
  noiDung: string;

  @ApiProperty({ description: 'Ghi chú (optional)', example: 'Thêm thông tin nếu cần', required: false })
  @IsString()
  @IsOptional()
  ghiChu?: string;
}