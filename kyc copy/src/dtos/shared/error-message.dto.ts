import { IsNumber, IsString } from "class-validator";

export class ErrorMessageDto {
  @IsNumber()
  id: number;

  @IsString()
  documentId: string;

  @IsString()
  error: string;

  @IsString()
  message: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsString()
  publishedAt: string;
}
