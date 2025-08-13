import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { IRequestWithUser } from "../interfaces";
import { SessionService } from "../services";

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SessionMiddleware.name);

  constructor(private readonly sessionService: SessionService) {}
  async use(req: IRequestWithUser, _res: Response, next: () => void) {
    try {
      const sessionId = req.header("authorization");
      const userInfo = await this.sessionService.getUserData(sessionId);
      const sessionData = await this.sessionService.getSessionData(sessionId);

      req.user = sessionData;
      req.userInfo = userInfo;
      req.sessionId = sessionId;
    } catch (error) {
      this.logger.error("Error in SessionMiddleware:", error.message);
    }

    next();
  }
}
