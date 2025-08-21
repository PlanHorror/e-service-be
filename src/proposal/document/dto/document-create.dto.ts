import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

export class DocumentCreateDto {
  @ApiProperty({ description: 'Proposal ID', type: String, format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  proposal_id: string;

  @ApiProperty({
    description: 'Document template ID',
    type: String,
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  document_id: string;
}

export class DocumentNested {
  @ApiProperty({
    description: 'Document template ID',
    type: String,
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  document_id: string;
}
