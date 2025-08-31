import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ProposalQueryDto {
  @ApiProperty({
    description: 'Security code for proposal access',
    example: 'SEC123456',
  })
  @IsString()
  @IsNotEmpty()
  security_code: string;

  @ApiProperty({
    description: 'Proposal code identifier',
    example: 'PROP001',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class ProposalAllQueryDto {
  @ApiProperty({
    description: 'Page number (starting from 1)',
    example: 1,
    default: 1,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    description: 'Sorting order for created_at',
    example: 'desc',
    enum: ['asc', 'desc'],
    required: false,
    default: 'desc',
  })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc' = 'desc';

  @ApiProperty({
    description: 'Proposal status filter',
    example: 'PENDING',
    enum: ['PENDING', 'AIAPPROVED', 'MANAGERAPPROVED', 'REJECTED'],
    required: false,
  })
  @IsEnum(['PENDING', 'AIAPPROVED', 'MANAGERAPPROVED', 'REJECTED'])
  @IsOptional()
  status?: string;
}