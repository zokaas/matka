import { HttpService } from "@nestjs/axios";
import {
  HttpException,
  Injectable,
  Logger,
  StreamableFile,
} from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { catchError, lastValueFrom, map } from "rxjs";
import { LoggerService } from "@opr-finance/logger";
import {
  CreateApplicationDto,
  CreateApplicationDynamicFieldsDto,
  CreateTrancheDto,
  ReferenceDto,
  TransactionsQueryDto,
} from "../dtos";
import { ViljaPlatformRequestsService } from "./vilja-platform-requests.service";

@Injectable()
export class ViljaPlatformService {
  private readonly logger = new Logger(ViljaPlatformService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly loggerService: LoggerService,
    private readonly viljaPlatformRequestsService: ViljaPlatformRequestsService
  ) {}

  private createPayload(
    originalPayload: CreateApplicationDto | CreateApplicationDynamicFieldsDto,
    clientIP: string
  ): CreateApplicationDto | CreateApplicationDynamicFieldsDto {
    const extras = {
      ...originalPayload.extras,
      clientIP,
    };

    if ((<CreateApplicationDynamicFieldsDto>originalPayload).dynamicFields) {
      const payloadTypeCast = <CreateApplicationDynamicFieldsDto>(
        originalPayload
      );
      const dynamicFields = {
        ...payloadTypeCast.dynamicFields,
        clientIP,
      };
      const dataWithDynamicFields: CreateApplicationDynamicFieldsDto = {
        ...originalPayload,
        extras,
        dynamicFields,
      };

      return dataWithDynamicFields;
    }

    return {
      ...originalPayload,
      extras,
    };
  }

  // Get data
  async getDataFromVp<R = unknown>(
    kcClientId: string,
    path: string,
    contentType: string,
    params?: TransactionsQueryDto
  ): Promise<R> {
    const requestConfig = this.viljaPlatformRequestsService.getRequestConfig(
      kcClientId,
      path,
      "GET",
      contentType,
      params
    );

    const response = this.viljaPlatformRequestsService.sendRequestToVp<R>(
      kcClientId,
      path,
      requestConfig
    );

    return response;
  }

  // Get file
  async getFileFromVp(
    kcClientId: string,
    path: string,
    contentType: string
  ): Promise<StreamableFile> {
    const requestConfig: AxiosRequestConfig = {
      ...this.viljaPlatformRequestsService.getRequestConfig(
        kcClientId,
        path,
        "GET",
        contentType
      ),
      responseType: "arraybuffer",
    };

    const response = await lastValueFrom(
      this.httpService.request(requestConfig).pipe(
        map((res) => {
          const buffer = Buffer.from(res.data, "utf-8");
          return new StreamableFile(buffer);
        }),
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

    return response;
  }

  // Update profile
  async updateCustomerData<T, R = unknown>(
    kcClientId: string,
    path: string,
    contentType: string,
    payload: T
  ): Promise<R> {
    const requestConfig: AxiosRequestConfig = {
      ...this.viljaPlatformRequestsService.getRequestConfig(
        kcClientId,
        path,
        "PATCH",
        contentType
      ),
      data: payload,
    };

    const response = await this.viljaPlatformRequestsService.sendRequestToVp<R>(
      kcClientId,
      path,
      requestConfig
    );

    return response;
  }

  // Create or update bank account
  async handleBankAccountOperation<T, R>(
    kcClientId: string,
    path: string,
    contentType: string,
    payload: T,
    method: "POST" | "PUT"
  ): Promise<R> {
    const requestConfig: AxiosRequestConfig = {
      ...this.viljaPlatformRequestsService.getRequestConfig(
        kcClientId,
        path,
        method,
        contentType
      ),
      data: payload,
    };

    const response = await this.viljaPlatformRequestsService.sendRequestToVp<R>(
      kcClientId,
      path,
      requestConfig
    );

    return response;
  }

  // Create top up
  async createTopup<R = unknown>(
    kcClientId: string,
    path: string,
    contentType: string,
    clientIP: string,
    payload: CreateApplicationDto | CreateApplicationDynamicFieldsDto
  ): Promise<R> {
    const data: CreateApplicationDto | CreateApplicationDynamicFieldsDto =
      this.createPayload(payload, clientIP);

    const requestConfig: AxiosRequestConfig = {
      ...this.viljaPlatformRequestsService.getRequestConfig(
        kcClientId,
        path,
        "POST",
        contentType
      ),
      data,
    };

    const response = await this.viljaPlatformRequestsService.sendRequestToVp<R>(
      kcClientId,
      path,
      requestConfig
    );

    return response;
  }

  // Create withdraw / tranche request
  async createTranche<R = unknown>(
    kcClientId: string,
    path: string,
    contentType: string,
    payload: CreateTrancheDto
  ): Promise<R> {
    const requestConfig: AxiosRequestConfig = {
      ...this.viljaPlatformRequestsService.getRequestConfig(
        kcClientId,
        path,
        "POST",
        contentType
      ),
      data: payload,
    };

    const response = await this.viljaPlatformRequestsService.sendRequestToVp<R>(
      kcClientId,
      path,
      requestConfig
    );

    return response;
  }

  // Get customer engagements
  async getCustomerEngagementsFromVp<R = unknown>(
    kcClientId: string,
    path: string,
    contentType: string,
    reference: string,
    referenceType: string
  ): Promise<R> {
    const params: ReferenceDto = {
      reference,
      referenceType,
    };

    const requestConfig: AxiosRequestConfig =
      this.viljaPlatformRequestsService.getRequestConfig<ReferenceDto>(
        kcClientId,
        path,
        "GET",
        contentType,
        params
      );

    const response = await this.viljaPlatformRequestsService.sendRequestToVp<R>(
      kcClientId,
      path,
      requestConfig
    );

    return response;
  }
}
