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
  @IsUUID()
  @IsNotEmpty()
  activity_id: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber('VN')
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  note: string;
}
