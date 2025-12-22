import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { RequestConfigHeadersDto } from "./request-config-headers.dto";
import { TransactionsQueryDto } from "./transactions-query.dto";

export class TransactionsRequestConfigDto {
  @IsString()
  url: string;

  @IsString()
  method: string;

  @ValidateNested()
  @Type(() => RequestConfigHeadersDto)
  headers: RequestConfigHeadersDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => TransactionsQueryDto)
  params: TransactionsQueryDto;
}
