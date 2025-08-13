import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "@opr-finance/logger";
import { BaseRequest } from "libs/helpers";
import { SessionDto, TokenSetDto, UserInfoDto } from "../dtos";

@Injectable()
export class SessionService extends BaseRequest {
  constructor(
    private readonly configService: ConfigService,
    private readonly _httpService: HttpService,
    private readonly _loggerService: LoggerService
  ) {
    super(_httpService, _loggerService);
  }

  private readonly logger = new Logger(SessionService.name);
  private readonly apiAuthSessionBaseUrl: string =
    this.configService.get<string>("apiAuthSession.baseUrl");
  private readonly apiAuthSessionBasePath: string =
    this.configService.get<string>("apiAuthSession.basePath");
  private readonly apiAuthSessionUrl: string = `${this.apiAuthSessionBaseUrl}/${this.apiAuthSessionBasePath}`;

  async getSessionData(sessionId: string): Promise<SessionDto> {
    const url = encodeURI(`${this.apiAuthSessionUrl}/session/${sessionId}`);
    const requestConfig = this.getRequestConfig(url, "GET", "application/json");

    const response = await this.makeRequest<SessionDto>(
      requestConfig,
      `${sessionId}/`,
      SessionService.name
    );

    return response;
  }

  async getUserData(sessionId: string): Promise<UserInfoDto> {
    const url = encodeURI(
      `${this.apiAuthSessionUrl}/session/${sessionId}/userinfo`
    );
    const requestConfig = this.getRequestConfig(url, "GET", "application/json");

    const response = await this.makeRequest<UserInfoDto>(
      requestConfig,
      `${sessionId}/userinfo`,
      SessionService.name
    );

    return response;
  }

  async getTokens(sessionId: string): Promise<TokenSetDto> {
    const url = encodeURI(
      `${this.apiAuthSessionUrl}/session/${sessionId}/token`
    );
    const requestConfig = this.getRequestConfig(url, "GET", "application/json");

    const response = await this.makeRequest<TokenSetDto>(
      requestConfig,
      `${sessionId}/token`,
      SessionService.name
    );

    return response;
  }

  async getSessionRefreshCount(sessionId: string): Promise<number> {
    const url = encodeURI(
      `${this.apiAuthSessionUrl}/session/${sessionId}/refreshcount`
    );
    const requestConfig = this.getRequestConfig(url, "GET", "application/json");

    const response = await this.makeRequest<number>(
      requestConfig,
      `${sessionId}/refreshcount`,
      SessionService.name
    );

    return response;
  }

  async removeSessionData(sessionId: string) {
    const url = encodeURI(`${this.apiAuthSessionUrl}/session/${sessionId}`);
    const requestConfig = this.getRequestConfig(
      url,
      "DELETE",
      "application/json"
    );

    const response = await this.makeRequest<UserInfoDto>(
      requestConfig,
      `${sessionId}`,
      SessionService.name
    );
    return response;
  }
}
