import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

export class DocumentCreateDto {
  @IsUUID()
  @IsNotEmpty()
  proposal_id: string;

  @IsUUID()
  @IsNotEmpty()
  document_id: string;
}

export class DocumentNested {
  @IsUUID()
  @IsNotEmpty()
  document_id: string;
}
