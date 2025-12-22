import { HttpException, Injectable, Logger } from "@nestjs/common";
import { AxiosRequestConfig, Method } from "axios";
import { TransactionsQueryDto } from "../dtos";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "@opr-finance/logger";
import { catchError, lastValueFrom, map, of, tap } from "rxjs";

@Injectable()
export class ViljaPlatformRequestsService {
  private readonly logger = new Logger(ViljaPlatformRequestsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService
  ) {}

  //? REFACTOR: Remove TransactionsQueryDto when refactoring Transactions service and add dto in this method call there
  getRequestConfig<T = TransactionsQueryDto>(
    kcClientId: string,
    path: string,
    method: Method,
    contentType: string,
    params?: T
  ): AxiosRequestConfig {
    const baseUrl = this.configService.get(
      `viljaPlatform.${kcClientId}.baseUrl`
    );
    const token = this.configService.get(`viljaPlatform.${kcClientId}.token`);

    const url = encodeURI(`${baseUrl}/${path}`);

    return {
      url,
      method,
      headers: {
        "Content-Type": contentType,
        Authorization: token,
      },
      params,
    };
  }

  async sendRequestToVp<R = unknown>(
    kcClientId: string,
    path: string,
    requestConfig: AxiosRequestConfig
  ): Promise<R> {
    return await lastValueFrom<R>(
      this.httpService.request(requestConfig).pipe(
        tap((response) => {
          this.loggerService.logDebug(`vp.service - ${kcClientId} - ${path}`, {
            response: {
              statusCode: response.status,
              data: response.data,
            },
            request: requestConfig,
          });
        }),
        map((res) => res.data),
        catchError((err) => {
          this.loggerService.logError(
            `vilja-platform.service - ${kcClientId} - ${path} - ${err.response.status}`,
            {
              response: {
                statusCode: err.response.status,
                data: err.response.data,
              },
              request: requestConfig,
            }
          );
          throw new HttpException(err.response.data, err.response.status);
        })
      )
    );
  }

  async sendSmeRequestToVP<R = unknown>(
    kcClientId: string,
    path: string,
    requestConfig: AxiosRequestConfig
  ): Promise<R> {
    return await lastValueFrom<R>(
      this.httpService.request(requestConfig).pipe(
        map((res) => res.data),
        catchError((err) => {
          this.loggerService.logError(
            `vilja-platform.service - ${kcClientId} - ${path} - ${err.response.status}`,
            {
              response: {
                statusCode: err.response.status,
                data: err.response.data,
              },
              request: requestConfig,
            }
          );
          if (err.response.status !== 409) {
            throw new HttpException(err.response.data, err.response.status);
          }

          this.loggerService.logDebug(
            "netherlands-flex-pipeline - SME creation failed with status 409"
          );
          // Use 'of' to wrap the return value in an observable
          return of(err.response.data);
        })
      )
    );
  }
}
