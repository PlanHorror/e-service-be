import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  DocumentCreateDto,
  DocumentNested,
} from '../document/dto/document-create.dto';
import { Type } from 'class-transformer';

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
    description: 'Additional notes',
    example: 'Special requirements',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  note: string;
}
