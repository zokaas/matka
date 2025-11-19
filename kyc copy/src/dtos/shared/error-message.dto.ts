import { IsNumber, IsOptional, IsString } from "class-validator";

export class ErrorMessageDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  documentId?: string;

  @IsString()
  error: string;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  createdAt?: string;

  @IsString()
  @IsOptional()
  updatedAt?: string; 

  @IsString()
  @IsOptional()
  publishedAt?: string;
}
