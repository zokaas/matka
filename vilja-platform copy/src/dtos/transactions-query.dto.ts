import { IsOptional } from "class-validator";
import { E_Country } from "../types";
export class TransactionsQueryDto {
  @IsOptional()
  shownInStatement: boolean;
  @IsOptional()
  page: number;
  @IsOptional()
  size: number;
  @IsOptional()
  excludeTransactionTypes: string;
  @IsOptional()
  country: E_Country;
  @IsOptional()
  startDate: string;
  @IsOptional()
  endDate: string;
}
