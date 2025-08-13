import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { AxiosRequestConfig, Method } from "axios";
import { catchError, lastValueFrom, map } from "rxjs";
import { LoggerService } from "@opr-finance/logger";
import { EndSessionResponseDto, SessionDto } from "../dtos";
import {
  IAuthenticationConfigurationModule,
  IBasicClientConfig,
} from "../config";
import { VerifySessionDto } from "../dtos/session/verify-session.dto";
import { BaseRequest } from "libs/helpers";

@Injectable()
export class AuthenticationService extends BaseRequest {
  constructor(
    private readonly configService: ConfigService,
    private readonly _httpService: HttpService,
    private readonly _loggerService: LoggerService
  ) {
    super(_httpService, _loggerService);
  }

  private readonly logger = new Logger(AuthenticationService.name);
  private readonly apiAuthSessionBaseUrl: string =
    this.configService.get<string>("apiAuthSession.baseUrl");
  private readonly apiAuthSessionBasePath: string =
    this.configService.get<string>("apiAuthSession.basePath");
  private readonly apiAuthSessionUrl: string = `${this.apiAuthSessionBaseUrl}/${this.apiAuthSessionBasePath}`;

  /**
   *
   * @param method Request method (GET, POST, DELETE)
   * @param path Path corresponding path in api-auth-session (/session, /session/{sessionId}, /session/{sessionId}/userinfo, etc)
   * @param data Body containing session data. Set to null by default if missing from method call.
   * @returns response from api-auth-session
   * T = UserInfoDto | number | SessionResponseDto | TokensDto
   */

  async sessionData<T>(
    method: Method,
    path: string,
    data: SessionDto | null = null
  ): Promise<T> {
    const url = encodeURI(`${this.apiAuthSessionUrl}/${path}`);
    const requestConfig = this.getRequestConfig<SessionDto>(
      url,
      method,
      "application/json",
      data
    );

    const response = await this.makeRequest<T>(
      requestConfig,
      url,
      AuthenticationService.name
    );
    return response;
  }

  getRedirectSuccessUrl(kcClientId: string, sessionId?: string): string {
    const { host, loginPath, loginQueryParam } = this.configService.get<
      IBasicClientConfig["callbackUrl"]
    >(`authentication.clients.${kcClientId}.callbackUrl`);
    return `${host}${loginPath}?${loginQueryParam}=${sessionId}`;
  }

  getRedirectErrorUrl(kcClientId: string): string {
    const { host, errorPath } = this.configService.get<
      IBasicClientConfig["callbackUrl"]
    >(`authentication.clients.${kcClientId}.callbackUrl`);
    return `${host}${errorPath}`;
  }

  handleLoginError(kcClientId: string, messages: string[]): string {
    this._loggerService.logError(
      `${kcClientId} - error in authentication flow`,
      {
        messages,
      }
    );
    return this.getRedirectErrorUrl(kcClientId);
  }

  async logoutUser(
    kcClientId: string,
    idToken: string,
    sessionId: string
  ): Promise<EndSessionResponseDto> {
    const { realm, clientId } = this.configService.get<IBasicClientConfig>(
      `authentication.clients.${kcClientId}`
    );
    const { host } =
      this.configService.get<IAuthenticationConfigurationModule>(
        `authentication`
      );

    const kc_url = encodeURI(
      `${host}/realms/${realm}/protocol/openid-connect/logout`
    );
    const params: { client_id: string; id_token_hint: string } = {
      client_id: clientId,
      id_token_hint: idToken,
    };

    const requestConfig: AxiosRequestConfig = {
      url: kc_url,
      method: "GET",
      params,
    };

    const response = await lastValueFrom(
      this._httpService.request(requestConfig).pipe(
        map(async (res) => {
          if (res.status === HttpStatus.OK) {
            const api_auth_session_url = encodeURI(
              `${this.apiAuthSessionUrl}/session/${sessionId}`
            );
            const requestConfig = this.getRequestConfig(
              api_auth_session_url,
              "DELETE",
              "application/json"
            );
            const result = await this.makeRequest(
              requestConfig,
              api_auth_session_url,
              AuthenticationService.name
            );
            this.logger.log(result);

            return { status: HttpStatus.OK, message: "User logged out" };
          }
          throw new Error("Error while logging out user");
        }),
        catchError((err) => {
          this._loggerService.logError(
            `authentication.service - logout - ${err.response.status}`,
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
  verifySession(exp: number): VerifySessionDto {
    const now = Math.floor(Date.now() / 1000);
    const ttl = exp - now;
    return {
      status: ttl > 0,
      ttl,
    };
  }
}
