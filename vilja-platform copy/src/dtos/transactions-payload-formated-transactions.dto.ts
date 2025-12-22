import { IsNumber, IsOptional, IsString } from "class-validator";

export class FormattedTransactionsDto {
  @IsString()
  @IsOptional()
  formattedDate: string;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsString()
  @IsOptional()
  formattedTitle: string;

  @IsString()
  @IsOptional()
  transactionType: string;

  @IsString()
  @IsOptional()
  formattedAmount: string;

  @IsString()
  @IsOptional()
  transactionDate: string;
}
