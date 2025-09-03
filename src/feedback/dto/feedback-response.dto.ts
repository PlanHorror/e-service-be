import { ApiProperty } from '@nestjs/swagger';
import { FeedbackCategory } from '@prisma/client';

export class FeedbackResponseDto {
  @ApiProperty({ description: 'Unique ID of the feedback', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: 'Họ và tên', example: 'Nguyễn Văn A' })
  hoTen: string;

  @ApiProperty({ description: 'Email', example: 'example@email.com' })
  email: string;

  @ApiProperty({ description: 'Số điện thoại', example: '0123456789' })
  soDienThoai: string;

  @ApiProperty({ description: 'Địa chỉ', example: '123 Đường ABC, TP.HCM' })
  diaChi: string;

  @ApiProperty({ description: 'Danh mục feedback', enum: FeedbackCategory, example: 'DICHVUCONG' })
  danhMuc: FeedbackCategory;

  @ApiProperty({ description: 'Tiêu đề', example: 'Góp ý về dịch vụ' })
  tieuDe: string;

  @ApiProperty({ description: 'Nội dung', example: 'Dịch vụ rất tốt!' })
  noiDung: string;

  @ApiProperty({ description: 'Ghi chú (optional)', example: 'Thêm thông tin', required: false })
  ghiChu?: string;

  @ApiProperty({ description: 'Creation timestamp', example: '2023-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ description: 'Update timestamp', example: '2023-01-01T00:00:00.000Z' })
  updated_at: Date;
}