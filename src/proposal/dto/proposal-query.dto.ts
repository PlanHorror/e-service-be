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
    description: 'Pagination start index',
    example: 0,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  from: number;

  @ApiProperty({
    description: 'Pagination end index',
    example: 10,
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  to: number;

  @ApiProperty({
    description: 'Proposal status',
    example: 'PENDING',
  })
  @IsEnum(['PENDING', 'AIAPPROVED', 'MANAGER_APPROVED', 'REJECTED'])
  @IsOptional()
  status: string;
}
