import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
