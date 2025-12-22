import { Injectable, Logger } from "@nestjs/common";
import { ViljaPlatformRequestsService } from "./vilja-platform-requests.service";
import { ReferenceDto } from "../dtos";
import { AxiosRequestConfig } from "axios";

@Injectable()
export class VpImpersonateService {
  private readonly logger = new Logger(VpImpersonateService.name);

  constructor(
    private readonly viljaPlatformRequestsService: ViljaPlatformRequestsService
  ) {}

  async getImpersonatedCustomerEngagementsFromVp<R = unknown>(
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
