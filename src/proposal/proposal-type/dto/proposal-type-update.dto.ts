import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProposalTypeUpdateDto {
  @ApiProperty({
    description: 'Proposal type name',
    example: 'Research Proposal',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'research-proposal',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
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

  @ApiProperty({
    description: 'Display order',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  display_order: number;
}
