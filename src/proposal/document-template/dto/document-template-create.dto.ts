import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class DocumentTemplateCreateDto {
  @ApiProperty({ description: 'Activity ID', type: String, format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  activity_id: string;

  @ApiProperty({
    description: 'Document template name',
    example: 'Research Plan',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Required quantity', example: 1 })
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  quantity: number;

  @ApiProperty({ description: 'Display order', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  display_order: number;

  @ApiProperty({ description: 'Is this document required', example: true })
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => Boolean(value))
  is_required: boolean;
}
