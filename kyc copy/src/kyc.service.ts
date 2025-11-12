import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosRequestConfig, Method } from "axios";
import { catchError, lastValueFrom, map } from "rxjs";
import { ApiFormDto, KycFormDto, OptionDto } from "./dtos";
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
  ): Promise<KycFormDto> {
    const apiPath = `form/${productId}/${kycType}`;
    const requestConfig = this.getRequestConfig(apiPath, "GET");

    const response = await this.sendRequestToApi<ApiFormDto>(
      apiPath,
      requestConfig
    );
    const productData = this.kycFormParser.parseProductData(
      response,
      productId
    );
    console.log("response parsed",response)
    return productData;
  }

  async getCountryList(productId: string): Promise<Array<OptionDto>> {
    const apiPath = "countrylist";
    const requestConfig = this.getRequestConfig(apiPath, "GET");
    const response = await this.sendRequestToApi<Array<string>>(
      apiPath,
      requestConfig
    );
    return this.kycFormParser.parseCountryList(response, productId);
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
