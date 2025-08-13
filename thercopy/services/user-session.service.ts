import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Client, TokenSet } from "openid-client";
import {
  SessionDto,
  TokenSetDto,
  UserInfoDto,
  UserIntrospectDto,
} from "../dtos";
import { AdminSessionService } from "./admin-session.service";
import { ConfigService } from "@nestjs/config";
import { IBasicClientConfig } from "../config";

@Injectable()
export class UserSessionService {
  constructor(
    private readonly adminSessionService: AdminSessionService,
    private readonly configService: ConfigService
  ) {}

  async getSessionUser(
    client: Client,
    tokenSet: TokenSet,
    kcClientId: string,
    sessionRefreshCount: number = 0,
    originRefreshToken?: string
  ): Promise<SessionDto> {
    try {
      const userInfo = await client.userinfo<UserInfoDto>(tokenSet);

      const userIntrospect = (await client.introspect(
        tokenSet.id_token
      )) as unknown as UserIntrospectDto;

      const { realm } = this.configService.get<IBasicClientConfig>(
        `authentication.clients.${kcClientId}`
      );
      const { revokeRefreshToken, refreshTokenMaxReuse } =
        await this.adminSessionService.getRefreshTokenRealmSettings(realm);

      return {
        tokenSet: {
          ...tokenSet,
          expires_at: userIntrospect.exp,
          refresh_token: originRefreshToken ?? tokenSet.refresh_token,
        } as TokenSetDto,
        userInfo,
        userIntrospect,
        sessionConfig: {
          revokeRefreshToken,
          refreshTokenMaxReuse: refreshTokenMaxReuse + 1, // Adjusting `refreshTokenMaxReuse + 1` to reflect the actual allowed reuse attempts.
          sessionRefreshCount,
        },
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException("Failed to build user session");
    }
  }
}
