import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewCreateDto {
  @ApiProperty({
    description: 'The UUID of the proposal being reviewed',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  proposal_id: string;

  @ApiProperty({
    description: 'Optional comment for the review',
    example: 'This proposal looks good but needs some improvements',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    description: 'Whether the proposal is accepted or rejected',
    example: true,
    type: 'boolean',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => Boolean(value))
  accepted: boolean;
}
