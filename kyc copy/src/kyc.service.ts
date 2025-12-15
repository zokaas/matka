import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosRequestConfig, Method } from "axios";
import { catchError, lastValueFrom, map } from "rxjs";
import { ApiFormDto, OptionDto } from "./dtos";
import { KycFormParser } from "./utils";

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly kycFormParser: KycFormParser
  ) {}

  getHello(): { status: string } {
    return {
      status: "Hello from kyc",
    };
  }

  private getRequestConfig<T>(
    path: string,
    method: Method,
    contentType?: string,
    params?: T
  ): AxiosRequestConfig {
    const baseUrl = this.configService.get("kycApi.url");
    const xApiKey = this.configService.get("kycApi.xApiKey");

    const url = encodeURI(`${baseUrl}/${path}`);

    return {
      url,
      method,
      headers: {
        "Content-Type": contentType,
        "x-apikey": xApiKey,
      },
      params,
    };
  }

  private async sendRequestToApi<R>(
    path: string,
    requestConfig: AxiosRequestConfig
  ): Promise<R> {
    return await lastValueFrom<R>(
      this.httpService.request(requestConfig).pipe(
        map((res) => res.data),
        catchError((err) => {
          throw new HttpException(err.response.data, err.response.status);
        })
      )
    );
  }

  async getProductData(
    productId: string,
    kycType: string
  ): Promise<ApiFormDto> {
    const apiPath = `form/${productId}/${kycType}`;
    const requestConfig = this.getRequestConfig(apiPath, "GET");

    const response = await this.sendRequestToApi<ApiFormDto>(
      apiPath,
      requestConfig
    );
    return response;
  }

  async getCountryList(productId: string): Promise<Array<OptionDto>> {
    const mockCountryList: Array<OptionDto> = [
      { id: 1, value: 50, text: "Afganistan" },
      { id: 2, value: 50, text: "Myanmar" },
      { id:5 , value: 0, text: "Norge" },
      { id: 6, value: 0, text: "Danmark" },
      { id: 7, value: 0, text: "Island" },
    ];

    // const lang = this.kycFormParser.getLang(productId);
    // const apiPath = `countrylist/${lang}`;
    // const requestConfig = this.getRequestConfig(apiPath, "GET");
    // const response = await this.sendRequestToApi<Array<OptionDto>>(
    //   apiPath,
    //   requestConfig
    // );
    return this.kycFormParser.parseCountryList(mockCountryList, productId);
  }

  async sendFormData<R = unknown>(
    payload: unknown,
    apiPath: string
  ): Promise<R> {
    const requestConfig: AxiosRequestConfig = {
      ...this.getRequestConfig(apiPath, "POST", "application/json"),
      data: payload,
    };
    this.logger.log(requestConfig);
    const response = await this.sendRequestToApi<R>(apiPath, requestConfig);
    return response;
  }
}
