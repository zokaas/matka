import { IsNumber, IsOptional, IsString } from "class-validator";

export class VpResponseTransactionsDataDto {
  @IsString()
  @IsOptional()
  transactionDate: string;

  @IsString()
  @IsOptional()
  transactionType: string;

  @IsString()
  @IsOptional()
  transactionMsg: string;

  @IsNumber()
  @IsOptional()
  amount: number;
}
