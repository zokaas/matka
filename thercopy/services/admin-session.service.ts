import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { Method } from "axios";
import { LoggerService } from "@opr-finance/logger";
import {
  AdminSessionRequestDto,
  RefreshTokenSettingsResponseDto,
  TokenSetDto,
} from "../dtos";
import {
  IAuthenticationConfigurationModule,
  IBasicAuthConfig,
} from "../config";
import { BaseRequest } from "libs/helpers";
import { RealmRepresentationDto } from "@opr-finance/keycloak";

@Injectable()
export class AdminSessionService extends BaseRequest {
  constructor(
    private readonly configService: ConfigService,
    readonly _httpService: HttpService,
    readonly _loggerService: LoggerService
  ) {
    super(_httpService, _loggerService);
  }

  private readonly logger = new Logger(AdminSessionService.name);
  private readonly apiAuthSessionBaseUrl: string =
    this.configService.get<string>("apiAuthSession.baseUrl");
  private readonly apiAuthSessionBasePath: string =
    this.configService.get<string>("apiAuthSession.basePath");
  private readonly apiAuthSessionUrl: string = `${this.apiAuthSessionBaseUrl}/${this.apiAuthSessionBasePath}`;

  async sessionData<T>(
    method: Method,
    path: string /** /session/${realm}-admin-session */,
    data: TokenSetDto | null = null
  ): Promise<T> {
    const url = encodeURI(`${this.apiAuthSessionUrl}/${path}`);

    const requestConfig = this.getRequestConfig<TokenSetDto>(
      url,
      method,
      "application/json",
      data
    );

    const response = await this.makeRequest<T>(
      requestConfig,
      path,
      AdminSessionService.name
    );
    return response;
  }

  async createAdminSession<T>(realm: string): Promise<T> {
    const { host } =
      this.configService.get<IAuthenticationConfigurationModule>(
        `authentication`
      );
    const { username, password } = this.configService.get<IBasicAuthConfig>(
      `authentication.adminSession.${realm}`
    );

    const url = `${host}/realms/${realm}/protocol/openid-connect/token`;

    const data: AdminSessionRequestDto = {
      client_id: "admin-cli",
      grant_type: "password",
      scope: "openid",
      username,
      password,
    };

    const requestConfig = this.getRequestConfig<AdminSessionRequestDto>(
      url,
      "POST",
      "application/x-www-form-urlencoded",
      data
    );

    const response = await this.makeRequest<T>(
      requestConfig,
      url,
      AdminSessionService.name
    );

    return response;
  }

  async returnAdminSession(realm: string): Promise<TokenSetDto> {
    const adminSessionId = `${realm}-admin-session`;

    const sessionAvailable = await this.sessionData<TokenSetDto>(
      "GET",
      `session/${adminSessionId}`
    );

    if (sessionAvailable) return sessionAvailable;

    const adminUser = await this.createAdminSession<TokenSetDto>(realm);
    const saveSession = await this.sessionData<TokenSetDto>(
      "POST",
      `admin/session/${adminSessionId}`,
      adminUser
    );
    return saveSession;
  }

  async getRealmRepresentation<T>(realm: string, token: string): Promise<T> {
    const { host } =
      this.configService.get<IAuthenticationConfigurationModule>(
        `authentication`
      );

    const url = `${host}/admin/realms/${realm}`;

    const requestConfig = this.getRequestConfig(
      url,
      "GET",
      "application/json",
      null,
      token,
      "Bearer"
    );

    const response = await this.makeRequest<T>(
      requestConfig,
      url,
      AdminSessionService.name
    );
    return response;
  }

  async getRefreshTokenRealmSettings(
    realm: string
  ): Promise<RefreshTokenSettingsResponseDto> {
    const adminUser = await this.returnAdminSession(realm);
    const adminAccessToken = adminUser.access_token;
    const realmConfig =
      await this.getRealmRepresentation<RealmRepresentationDto>(
        realm,
        adminAccessToken
      );
    const { revokeRefreshToken, refreshTokenMaxReuse } = realmConfig;
    return { revokeRefreshToken, refreshTokenMaxReuse };
  }
}
