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

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  display_order: number;

  @IsBoolean()
  @IsNotEmpty()
  is_required: boolean;
}
