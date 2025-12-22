import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "@opr-finance/logger";
import { BaseRequest } from "libs/helpers";
import {
  KvkBackendRequestParamsDto,
  KvkCompaniesListResponseDto,
  KvkCompanyDataDto,
  NlPostCodeResponseDto,
} from "../dtos";
import { IS_KVK_NUMBER, IS_KVK_NAME } from "../constants";

@Injectable()
export class ApplicationToolsService extends BaseRequest {
  private readonly kvkApiKey;
  private readonly kvkBaseUrl;
  private readonly postCodeBaseUrl;
  private readonly postCodeApiKey;

  constructor(
    private readonly configService: ConfigService,
    private readonly _httpService: HttpService,
    private readonly _loggerService: LoggerService
  ) {
    super(_httpService, _loggerService);
    this.kvkBaseUrl = this.configService.get<string>(
      "companyLoanFlexNl.kvkBaseUrl"
    );
    this.kvkApiKey = this.configService.get<string>(
      "companyLoanFlexNl.kvkApiKey"
    );
    this.postCodeBaseUrl = this.configService.get<string>(
      "companyLoanFlexNl.postCodeBaseUrl"
    );
    this.postCodeApiKey = this.configService.get<string>(
      "companyLoanFlexNl.postCodeApiKey"
    );
  }

  private buildKvkRequestUrl(queryText: string): KvkBackendRequestParamsDto {
    const isDigit = new RegExp(/^\d+$/);

    return isDigit.test(queryText)
      ? {
          [IS_KVK_NUMBER]: queryText,
          [IS_KVK_NAME]: null,
        }
      : {
          [IS_KVK_NUMBER]: null,
          [IS_KVK_NAME]: queryText,
        };
  }

  async getCompaniesList(
    queryText: string
  ): Promise<KvkCompaniesListResponseDto> {
    const url = `${this.kvkBaseUrl}/v2/zoeken`;
    const params: KvkBackendRequestParamsDto =
      this.buildKvkRequestUrl(queryText);
    const config = this.getRequestConfig<null, KvkBackendRequestParamsDto>(
      url,
      "GET",
      "application/json",
      null,
      this.kvkApiKey,
      "apiKey",
      params
    );

    const response = await this.makeRequest<KvkCompaniesListResponseDto>(
      config,
      "",
      ApplicationToolsService.name
    );
    return response;
  }

  async getCompanyBasicInfo(kvkNumber: string): Promise<KvkCompanyDataDto> {
    const url = `${this.kvkBaseUrl}/v1/basisprofielen/${kvkNumber}`;
    const config = this.getRequestConfig<null, null>(
      url,
      "GET",
      "application/json",
      null,
      this.kvkApiKey,
      "apiKey",
      null
    );

    const response = await this.makeRequest<KvkCompanyDataDto>(
      config,
      "",
      ApplicationToolsService.name
    );
    return response;
  }

  async getStreet(
    zipCode: string,
    houseNumber: string
  ): Promise<NlPostCodeResponseDto> {
    const url = `${this.postCodeBaseUrl}/${zipCode}/${houseNumber}`;

    const config = this.getRequestConfig<null, null>(
      url,
      "GET",
      "application/json",
      null,
      this.postCodeApiKey,
      "X-Api-Key",
      null
    );
    const response = await this.makeRequest<NlPostCodeResponseDto>(
      config,
      "",
      ApplicationToolsService.name
    );
    return response;
  }
}
