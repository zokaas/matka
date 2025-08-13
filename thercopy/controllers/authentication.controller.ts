import {
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  Redirect,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthenticationService, RefreshService } from "../services";
import { AuthenticationGuard, OidcLoginGuard } from "../guards";
import { GetExpiration, SessionId, SessionUser, Tokenset } from "../decorators";
import {
  EndSessionResponseDto,
  SessionDto,
  SessionResponseDto,
  TokenSetDto,
  VerifySessionDto,
} from "../dtos";
import { SessionInfoResponseDto } from "../dtos/session/session-info-response.dto";
import { Request as ExpressRequest } from "express";

@Controller("authenticate")
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly refreshService: RefreshService
  ) {}

  @UseGuards(OidcLoginGuard)
  @Get("/start/:kcClientId")
  startAuthentication() {
    return;
  }

  @Get("/login/cancel")
  async loginCancelCallback() {
    // TODO: Implement loginCancelCallback
    // Maybe we need some cancellation handler / routes also in frontends
  }

  @Get("/login/error")
  @Redirect("", 302)
  async loginFlowErrorCallback(@Request() req: ExpressRequest) {
    this.logger.log(req.session);
    const { client_id, messages } = req.session;

    // log to Datadog and redirect to frontend error page
    const url = this.authenticationService.handleLoginError(
      client_id,
      messages
    );
    return { url };
  }

  @Get("/login/:kcClientId")
  @Redirect("", 302)
  async loginCallback(
    @Param("kcClientId") kcClientId: string,
    @SessionUser() sessionUser: SessionDto,
    @SessionId() sessionId: string
  ) {
    const session =
      await this.authenticationService.sessionData<SessionResponseDto>(
        "POST",
        `session/${sessionId}`,
        sessionUser
      );
    const url = this.authenticationService.getRedirectSuccessUrl(
      kcClientId,
      session.sessionId
    );
    return { url };
  }

  @Get("/logout/:kcClientId")
  @UseGuards(AuthenticationGuard)
  async logout(
    @Tokenset() tokenset: TokenSetDto,
    @Param("kcClientId") kcClientId: string,
    @Headers("authorization") sessionId: string
  ): Promise<EndSessionResponseDto> {
    const logoutResult = await this.authenticationService.logoutUser(
      kcClientId,
      tokenset.id_token,
      sessionId
    );

    return logoutResult;
  }

  @Get(["/sessioninfo/:kcClientId", "/userinfo/:kcClientId"])
  @UseGuards(AuthenticationGuard)
  userinfo(@SessionUser() sessionUser: SessionDto): SessionInfoResponseDto {
    const {
      userInfo,
      sessionConfig: { sessionRefreshCount, refreshTokenMaxReuse },
      userIntrospect: { exp },
    } = sessionUser;
    return {
      userInfo,
      exp,
      sessionRefreshCount,
      maxSessionRefresh: refreshTokenMaxReuse,
    };
  }

  @Get("/verify/:kcClientId")
  @UseGuards(AuthenticationGuard)
  verifySession(@GetExpiration() exp: number): VerifySessionDto {
    const verifyResponse = this.authenticationService.verifySession(exp);
    return verifyResponse;
  }
}
