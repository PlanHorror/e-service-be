import { IsNotEmpty, IsString } from 'class-validator';

export class ProposalQueryDto {
  @IsString()
  @IsNotEmpty()
  security_code: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
