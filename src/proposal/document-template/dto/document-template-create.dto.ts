import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class DocumentTemplateCreateDto {
  @IsUUID()
  @IsNotEmpty()
  activity_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  display_order: number;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => Boolean(value))
  is_required: boolean;
}
