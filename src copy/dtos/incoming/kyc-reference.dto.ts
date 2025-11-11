import { IsNumber, IsString } from "class-validator";

export class KycReferenceDto {
  @IsNumber()
  id: number;

  @IsString()
  documentId: string;

  @IsString()
  formName: string;

  @IsString()
  formType: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  publishedAt: string;
}
