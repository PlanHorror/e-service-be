import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ActivityUpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  display_order: number;
}
