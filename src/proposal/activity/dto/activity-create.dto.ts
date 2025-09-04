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
import { DocumentTemplateCreateDto } from 'src/proposal/document-template/dto/document-template-create.dto';

export class ActivityCreateDto {
  @ApiProperty({
    description: 'Proposal type ID',
    type: String,
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  proposal_type_id: string;

  @ApiProperty({ description: 'Activity name', example: 'Data Collection' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'URL-friendly slug', example: 'data-collection' })
  @IsString()
  @IsNotEmpty()
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

export class ActivityTemplateCreateDto {
  @ApiProperty({
    description: 'Proposal type ID',
    type: String,
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  proposalType_id: string;

  @ApiProperty({ description: 'Activity name', example: 'Data Collection' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'URL-friendly slug', example: 'data-collection' })
  @IsString()
  @IsNotEmpty()
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

  @ValidateNested({ each: true })
  @Type(() => DocumentTemplateNestedCreateDto)
  documentTemplates: DocumentTemplateNestedCreateDto[];
}

export class DocumentTemplateNestedCreateDto {
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
