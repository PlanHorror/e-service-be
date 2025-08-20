import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class DocumentTemplateUpdateDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  display_order: number;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  is_required: boolean;
}
