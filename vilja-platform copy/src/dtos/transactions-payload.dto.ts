import { IsArray } from "class-validator";
import { VpResponseTransactionsDataDto } from "./vp-response-transactions-data.dto";

export class TransactionsPayloadDto {
  @IsArray()
  statementTransactions: Array<VpResponseTransactionsDataDto>;
}
