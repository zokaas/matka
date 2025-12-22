import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EMPTY, Observable, lastValueFrom } from "rxjs";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { map, catchError, expand, reduce, takeWhile } from "rxjs/operators";

import { LoggerService } from "@opr-finance/logger";
import { notInStatementTransactionsTypes, interestTypes } from "../constants";
import { TransactionsQueryDto } from "../dtos/transactions-query.dto";
import { TransactionsPayloadDto } from "../dtos/transactions-payload.dto";
import { VpResponseTransactionsDto } from "../dtos/vp-response-transactions.dto";
import { VpResponseTransactionsDataDto } from "../dtos/vp-response-transactions-data.dto";
import { TransactionsRequestConfigDto } from "../dtos/transactions-request-config.dto";

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  private kcClientId: string;
  private path: string;
  private contentType: string;
  private params: TransactionsQueryDto;
  private method: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService
  ) {}

  // Function to extract an actual code for merging interest rows (or just saving row)
  private summarizeInterest(
    transactions: Array<VpResponseTransactionsDataDto>
  ): Array<VpResponseTransactionsDataDto> {
    if (transactions.length === 1) return transactions;
    const newRow: Array<VpResponseTransactionsDataDto> =
      this.reduceTransactionsByInterest(transactions);

    return newRow;
  }

  //? REFACTOR: Refator this method to be more understandable
  private reduceTransactionsByInterest(
    transactions: VpResponseTransactionsDataDto[]
  ): Array<VpResponseTransactionsDataDto> {
    const newRow: Array<VpResponseTransactionsDataDto> = [];
    let countedRow: VpResponseTransactionsDataDto;
    transactions.forEach((item, index) => {
      const found = interestTypes.find(
        (interestType) => interestType === item.transactionType
      );
      if (!found) {
        newRow.push(item);
      } else {
        if (!countedRow) {
          countedRow = item;
        } else {
          if (countedRow.amount != undefined) {
            if (item.amount != undefined) {
              countedRow.amount += item.amount;
            }
          } else if (item.amount != undefined) {
            countedRow.amount = item.amount;
          }
        }
      }
      if (index === transactions.length - 1 && countedRow !== undefined) {
        countedRow.transactionType = "summarizedInterest";
        newRow.push(countedRow);
      }
    });
    return newRow;
  }

  private mapTransactionsToFilter(
    transactions: Array<VpResponseTransactionsDataDto>
  ): Array<VpResponseTransactionsDataDto> {
    const mapTransactions = new Map<
      string,
      Array<VpResponseTransactionsDataDto>
    >();
    transactions.forEach((item) => {
      if (!mapTransactions.has(item.transactionDate)) {
        mapTransactions.set(item.transactionDate, [item]);
      } else {
        const data = mapTransactions.get(item.transactionDate) || [];
        mapTransactions.set(item.transactionDate, [...data, item]);
      }
    });

    const mappedTransactions = new Map<
      string,
      Array<VpResponseTransactionsDataDto>
    >();
    for (const entry of mapTransactions.entries()) {
      const summarizedData = this.summarizeInterest(entry[1]);
      mappedTransactions.set(entry[0], summarizedData);
    }
    const arrayOfTransactions = Array.from(mappedTransactions.values());
    const flatArray = arrayOfTransactions.flat();

    return flatArray;
  }

  private filterSmeTransactions(
    transactions: Array<VpResponseTransactionsDataDto>
  ): TransactionsPayloadDto {
    const statementTransactions = transactions.filter(
      (transaction) =>
        !notInStatementTransactionsTypes.includes(transaction.transactionType)
    );
    const summarizedByInterestType = this.mapTransactionsToFilter(
      statementTransactions
    );

    return {
      statementTransactions: summarizedByInterestType,
    };
  }

  private extractPageNumber(href: string): number {
    const firstSubstring = "page=";
    const secondSubstring = "&size=";
    const index = href.indexOf(firstSubstring) + firstSubstring.length;
    const foundSubstring = href.substring(
      index,
      href.indexOf(secondSubstring, index)
    );
    return Number(foundSubstring);
  }

  private createConfigForRequest(): AxiosRequestConfig<TransactionsRequestConfigDto> {
    const baseUrl = this.configService.get<string>(
      `viljaPlatform.${this.kcClientId}.baseUrl`
    );
    const predefinedToken = this.configService.get<string>(
      `viljaPlatform.${this.kcClientId}.token`
    );
    const url = encodeURI(`${baseUrl}/${this.path}`);

    const config = {
      url,
      method: this.method,
      headers: {
        "Content-Type": this.contentType,
        Authorization: predefinedToken,
      },
      params: this.params,
    };
    return config;
  }

  private async fetchAllTransactions(): Promise<
    Observable<VpResponseTransactionsDataDto[]>
  > {
    const config: AxiosRequestConfig<TransactionsRequestConfigDto> =
      this.createConfigForRequest();

    const allTransactions = (await this.fetchDataFromVP(config)).pipe(
      expand(async (res) => {
        if (
          res.currentPage &&
          res._links?.last?.href &&
          res.currentPage < this.extractPageNumber(res._links.last.href)
        ) {
          this.params = { ...this.params, page: res.currentPage + 1 };
          const newConfig = this.createConfigForRequest();
          const newData = lastValueFrom(await this.fetchDataFromVP(newConfig));
          return newData;
        } else {
          return EMPTY;
        }
      }),
      takeWhile((data) => data !== EMPTY),
      reduce(
        (
          acc: VpResponseTransactionsDataDto[],
          curr: VpResponseTransactionsDto
        ) => acc.concat(curr._embedded.data),
        []
      ),
      catchError((err) => {
        throw new Error("error in allTransactions" + err);
      })
    );

    return allTransactions;
  }

  private readonly fetchDataFromVP = async (
    config: AxiosRequestConfig<TransactionsRequestConfigDto>
  ): Promise<Observable<VpResponseTransactionsDto>> => {
    const vpResponce = this.httpService.request(config).pipe(
      map((res: AxiosResponse<VpResponseTransactionsDto>) => res.data),
      catchError((err) => {
        this.loggerService.logError(
          `transactions.service - ${this.kcClientId} - V2 - ${this.path} - ${err.response.status}`,
          {
            response: {
              statusCode: err.response.status,
              data: err.response.data,
            },
            request: config,
          }
        );
        throw new HttpException(err.response.data, err.response.status);
      })
    );
    this.logger.log("VP RESPONSE ", vpResponce);
    return vpResponce;
  };

  async getFilteredTransactions(
    kcClientId: string,
    path: string,
    contentType: string,
    params?: TransactionsQueryDto,
    method: string = "GET"
  ): Promise<TransactionsPayloadDto> {
    this.kcClientId = kcClientId;
    this.path = path;
    this.contentType = contentType;
    this.params = { ...params };
    this.method = method;
    try {
      const allTransactions = await lastValueFrom(
        await this.fetchAllTransactions()
      );

      const filteredTransactions = this.filterSmeTransactions(allTransactions);
      return filteredTransactions;
    } catch (e) {
      console.log(e);
    }
  }
}
