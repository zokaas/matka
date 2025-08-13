import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestMiddleware,
} from "@nestjs/common";
import { Response } from "express";

import {
  AuthenticationClientService,
  MAX_REFRESH_COUNT,
  SessionService,
} from "../services";
import { IRequestWithUser } from "../interfaces";
import { UserSessionService } from "../services/user-session.service";

@Injectable()
export class SessionRefreshMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SessionRefreshMiddleware.name);

  constructor(
    private readonly authenticationClientService: AuthenticationClientService,
    private readonly sessionService: SessionService,
    private readonly userSessionService: UserSessionService
  ) {}

  async use(req: IRequestWithUser, _res: Response, next: () => void) {
    const sessionId = req.header("authorization");
    try {
      const { kcClientId } = req.params;
      const sessionData = await this.sessionService.getSessionData(sessionId);
      const {
        tokenSet,
        sessionConfig: {
          sessionRefreshCount,
          revokeRefreshToken,
          refreshTokenMaxReuse,
        },
      } = sessionData;

      // Determine the maximum number of times a refresh token can be reused
      const maxRefreshTokenReuse = revokeRefreshToken
        ? refreshTokenMaxReuse
        : MAX_REFRESH_COUNT;

      if (sessionRefreshCount >= maxRefreshTokenReuse) {
        throw new HttpException(
          "session refresh not succeeded",
          HttpStatus.FORBIDDEN
        );
      }

      const client =
        await this.authenticationClientService.buildOpenIdClient(kcClientId);

      const newTokenSet = await client.refresh(tokenSet.refresh_token);
      this.logger.debug(`session refreshed ${sessionRefreshCount + 1} time(s)`);

      const sessionUser = await this.userSessionService.getSessionUser(
        client,
        newTokenSet,
        kcClientId,
        sessionRefreshCount + 1,
        tokenSet.refresh_token
      );
      req.user = sessionUser;

      next();
    } catch (error) {
      this.logger.error(`Error in session refresh: ${error.message}`);

      // Remove session data from Redis
      await this.sessionService.removeSessionData(sessionId);

      throw new HttpException("session refresh failed", HttpStatus.FORBIDDEN);
    }
  }
}
