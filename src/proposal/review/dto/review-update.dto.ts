import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReviewUpdateDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  comments: string;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  accepted: boolean;
}
