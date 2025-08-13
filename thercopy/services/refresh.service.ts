import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { RefreshSessionDto } from "../dtos";
import { SessionService } from "./session.service";

@Injectable()
export class RefreshService {
  constructor(private readonly sessionService: SessionService) {}

  private readonly logger = new Logger(RefreshService.name);

  async refreshSession(
    sessionId: string,
    kcClientId: string
  ): Promise<RefreshSessionDto> {
    try {
      const {
        userIntrospect: { exp },
        sessionConfig: { sessionRefreshCount },
      } = await this.sessionService.getSessionData(sessionId);

      return {
        sessionId,
        exp,
        sessionRefreshCount,
      };
    } catch (error) {
      this.logger.error(
        `Error refreshing session for ${kcClientId}`,
        error.message
      );
      throw new HttpException(
        "Failed to refresh session",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
