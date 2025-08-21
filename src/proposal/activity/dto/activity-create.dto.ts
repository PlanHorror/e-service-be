import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

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

  @ApiProperty({ description: 'Display order', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  display_order: number;
}
