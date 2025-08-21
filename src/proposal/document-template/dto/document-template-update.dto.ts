import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class DocumentTemplateUpdateDto {
  @ApiProperty({
    description: 'Document template name',
    example: 'Research Plan',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Required quantity',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  quantity: number;

  @ApiProperty({
    description: 'Display order',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  display_order: number;

  @ApiProperty({
    description: 'Is this document required',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  is_required: boolean;
}
