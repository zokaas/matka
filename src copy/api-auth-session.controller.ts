import {
  SessionDto,
  TokenSetDto,
  UserInfoDto,
} from "@opr-finance/authentication/dtos";
import { ApiAuthSessionService } from "./api-auth-session.service";

import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";

@Controller()
export class ApiAuthSessionController {
  constructor(private readonly apiAuthSessionService: ApiAuthSessionService) {}

  @Get("/health")
  getHello(): { status: string } {
    return this.apiAuthSessionService.getHello();
  }

  @Post("/session")
  async saveSession(@Body() sessionUser: SessionDto) {
    const uuid =
      await this.apiAuthSessionService.saveSessionToRedis(sessionUser);

    return { sessionId: uuid };
  }

  @Post("/admin/session/:sessionId")
  async saveAdminSessionWithId(
    @Body() sessionUser: TokenSetDto,
    @Param("sessionId") sessionId: string
  ): Promise<TokenSetDto> {
    const sessionData =
      await this.apiAuthSessionService.saveAdminSessionToRedis(
        sessionUser,
        sessionId
      );

    return sessionData;
  }

  @Post("/session/:sessionId")
  async saveSessionWithId(
    @Body() sessionUser: SessionDto,
    @Param("sessionId") sessionId: string
  ) {
    const uuid = await this.apiAuthSessionService.saveSessionToRedis(
      sessionUser,
      sessionId
    );

    return { sessionId: uuid };
  }

  @Get("/session/:sessionId")
  async getSession(@Param("sessionId") sessionId: string) {
    const sessionData: SessionDto =
      await this.apiAuthSessionService.getAllSessionData(sessionId);

    return sessionData;
  }

  @Get("/session/:sessionId/userinfo")
  async getUserInfo(@Param("sessionId") sessionId: string) {
    const userInfo: UserInfoDto =
      await this.apiAuthSessionService.getUserInfoFromSession(sessionId);

    return userInfo;
  }

  @Get("/session/:sessionId/token")
  async getAccessToken(@Param("sessionId") sessionId: string): Promise<{
    access_token: string;
    id_token: string;
    refresh_token: string;
  }> {
    const access_token: string =
      await this.apiAuthSessionService.getAccessTokenFromSession(sessionId);
    const id_token: string =
      await this.apiAuthSessionService.getIdTokenFromSession(sessionId);
    const refresh_token: string =
      await this.apiAuthSessionService.getRefreshTokenFromSession(sessionId);
    return { access_token, id_token, refresh_token };
  }

  @Delete("/session/:sessionId")
  async removeSession(@Param("sessionId") sessionId: string) {
    const result =
      await this.apiAuthSessionService.destroyUserSession(sessionId);

    return result;
  }

  @Get("/session/:sessionId/refreshcount")
  async getSessionRefreshCount(
    @Param("sessionId") sessionId: string
  ): Promise<number> {
    return await this.apiAuthSessionService.getSessionRefreshCountFromSession(
      sessionId
    );
  }
}
