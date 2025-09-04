import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class ActivityUpdateDto {
  @ApiProperty({
    description: 'Activity name',
    example: 'Data Collection',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'data-collection',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  slug: string;

  @ApiProperty({
    description: 'Activity description',
    example: 'Collecting research data',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'Display order', example: 1, required: false })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  display_order: number;
}

export class DocumentTemplateNestedUpdateDto {
  @ApiProperty({
    description: 'Document template ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsUUID()
  id: string;

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
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Display order', example: 1 })
  @IsOptional()
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
export class ActivityTemplateUpdateDto {
  @ApiProperty({
    description: 'Activity name',
    example: 'Data Collection',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'data-collection',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  slug: string;

  @ApiProperty({
    description: 'Activity description',
    example: 'Collecting research data',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'Display order', example: 1, required: false })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  display_order: number;

  @ApiProperty({
    description: 'Document templates associated with the activity',
    type: [DocumentTemplateNestedUpdateDto],
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DocumentTemplateNestedUpdateDto)
  documentTemplates: DocumentTemplateNestedUpdateDto[];
}
