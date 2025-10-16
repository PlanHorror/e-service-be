import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ProposalState } from '@prisma/client';
import { Type } from 'class-transformer';

export class ExtraFileMetadataDto {
  @ApiProperty({
    description: 'Name of the extra document',
    example: 'Additional Certificate',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description of the extra document',
    example: 'Extra certification document',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class ProposalCreateDto {
  @ApiProperty({ description: 'Activity ID', type: String, format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  activity_id: string;

  @ApiProperty({ description: 'Full name of proposer', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number', example: '+84987654321' })
  @IsPhoneNumber('VN')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Address', example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'State of the proposal',
    enum: ProposalState,
    example: ProposalState.SUBMITTED,
    required: false,
    default: ProposalState.DRAFT,
  })
  @IsEnum(ProposalState)
  @IsOptional()
  state?: ProposalState;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Special requirements',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: 'Metadata for extra files (names and descriptions)',
    type: [ExtraFileMetadataDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ExtraFileMetadataDto)
  extraFilesMetadata?: ExtraFileMetadataDto[];
}