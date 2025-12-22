import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";

import { ContentType, GetMethod } from "@opr-finance/decorators";
import { AuthenticationGuard } from "@opr-finance/authentication";

import { TransactionsService } from "../services/transactions.service";
import { TransactionsQueryDto } from "../dtos/transactions-query.dto";
import { TransactionsPayloadDto } from "../dtos/transactions-payload.dto";
import { SetRoles } from "../decorators";

@Controller("v2/vp/:kcClientId")
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);
  constructor(private readonly transactionsService: TransactionsService) {}

  // /transactions
  @Get(":accountId/transactions")
  @SetRoles("CUSTOMER", "ADMINISTRATOR", "B2B operations")
  @UseGuards(AuthenticationGuard)
  async getTransactions(
    @Param("kcClientId") kcClientId: string,
    @Param("accountId") accountId: string,
    @ContentType() contentType: string,
    @Query() queryParams: TransactionsQueryDto,
    @GetMethod() method: string
  ): Promise<TransactionsPayloadDto> {
    const apiPath: string = `api/loan/v8/accounts/${accountId}/transactions`;
    this.logger.log(
      `\nname = getTransactions\nkcClientId = ${kcClientId};\naccountId = ${accountId}; \ncontentType = ${contentType}; \nmethod = ${method}; \npath = ${apiPath}`
    );

    const filteredTransactions =
      await this.transactionsService.getFilteredTransactions(
        kcClientId,
        apiPath,
        contentType,
        queryParams,
        method
      );

    return filteredTransactions;
  }
}
