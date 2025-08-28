import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProposalQueryDto {
  @ApiProperty({
    description: 'Security code for proposal access',
    example: 'SEC123456',
  })
  @IsString()
  @IsNotEmpty()
  security_code: string;

  @ApiProperty({
    description: 'Proposal code identifier',
    example: 'PROP001',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
