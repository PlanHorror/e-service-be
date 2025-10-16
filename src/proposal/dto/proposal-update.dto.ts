import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ProposalState, ProposalStatus } from '@prisma/client';
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

export class ProposalUpdateDto {
  @ApiProperty({
    description: 'Full name of proposer',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+84987654321',
    required: false,
  })
  @IsPhoneNumber('VN')
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Address',
    example: '123 Main St',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'State of the proposal',
    enum: ProposalState,
    example: ProposalState.SUBMITTED,
    required: false,
  })
  @IsEnum(ProposalState)
  @IsOptional()
  state?: ProposalState;

  @ApiProperty({
    description: 'Status of the proposal',
    enum: ProposalStatus,
    example: ProposalStatus.PENDING,
    required: false,
  })
  @IsEnum(ProposalStatus)
  @IsOptional()
  status?: ProposalStatus;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Special requirements',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: 'Response from admin/manager',
    example: 'Approved with conditions',
    required: false,
  })
  @IsString()
  @IsOptional()
  respond?: string;

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