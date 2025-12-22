import { IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { VpResponseTransactionsDataDto } from "./vp-response-transactions-data.dto";

export class EmbeddedDataDto {
  @IsOptional()
  @Type(() => VpResponseTransactionsDataDto)
  data: VpResponseTransactionsDataDto[];
}
