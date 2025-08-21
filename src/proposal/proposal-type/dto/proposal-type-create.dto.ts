import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProposalTypeCreateDto {
  @ApiProperty({
    description: 'Proposal type name',
    example: 'Research Proposal',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'research-proposal',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Description of proposal type',
    example: 'For research activities',
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
