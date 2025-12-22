import { Injectable, Logger } from "@nestjs/common";
import { AdminDto, BoardMemberDto, IndividualGuarantorDto } from "../dtos";
import { AxiosRequestConfig, Method } from "axios";
import { ViljaPlatformRequestsService } from "./vilja-platform-requests.service";

@Injectable()
export class ViljaApplicationService {
  private readonly logger = new Logger(ViljaApplicationService.name);

  constructor(
    private readonly viljaPlatformRequestsService: ViljaPlatformRequestsService
  ) {}

  private payloadMapper(
    smeId: string,
    // GuarantorInfo Dto is just temprary fix and should be checked when refacroting admint-tools
    guarantor: AdminDto | BoardMemberDto | IndividualGuarantorDto,
    role: string
  ): AdminDto | BoardMemberDto {
    const {
      reference,
      referenceType,
      givenName,
      surname,
      birthDate,
      email,
      phone,
      address,
    } = guarantor;

    return {
      ...(role === "boardMembers" && { boardMemberRole: "GUARANTOR" }),
      smeId,
      reference,
      referenceType,
      givenName,
      surname,
      birthDate,
      address,
      email,
      phone,
    };
  }

  async addRoleToCompany<P = never, R = unknown>(
    kcClientId: string,
    path: string,
    contentType: string,
    role: string,
    // Check comment in payload mapper
    guarantor: AdminDto | BoardMemberDto | IndividualGuarantorDto,
    smeId: string,
    params?: P
  ): Promise<R> {
    const payload = this.payloadMapper(smeId, guarantor, role);
    const apiPath: string = `${path}/${smeId}/${role}`;

    const requestConfig: AxiosRequestConfig = {
      ...this.viljaPlatformRequestsService.getRequestConfig(
        kcClientId,
        apiPath,
        "POST",
        contentType,
        params
      ),
      data: payload,
    };

    const response = await this.viljaPlatformRequestsService.sendRequestToVp<R>(
      kcClientId,
      apiPath,
      requestConfig
    );

    return response;
  }

  async createCompany<P = never, R = unknown, T = unknown>(
    kcClientId: string,
    path: string,
    contentType: string,
    payload: T,
    params?: P
  ): Promise<R> {
    const requestConfig: AxiosRequestConfig = {
      ...this.viljaPlatformRequestsService.getRequestConfig(
        kcClientId,
        path,
        "POST",
        contentType,
        params
      ),
      data: payload,
    };

    const response =
      await this.viljaPlatformRequestsService.sendSmeRequestToVP<R>(
        kcClientId,
        path,
        requestConfig
      );

    return response;
  }

  async createOrUpdateApplication<P = never, R = unknown, T = unknown>(
    kcClientId: string,
    path: string,
    method: Method,
    contentType: string,
    payload: T,
    params?: P
  ): Promise<R> {
    const requestConfig: AxiosRequestConfig = {
      ...this.viljaPlatformRequestsService.getRequestConfig(
        kcClientId,
        path,
        method,
        contentType,
        params
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
}
