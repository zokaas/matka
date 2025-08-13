import { Injectable, NestMiddleware } from "@nestjs/common";
import { IRequestWithAdmin } from "../interfaces";
import { AdminSessionService } from "../services/admin-session.service";
import { ConfigService } from "@nestjs/config";
import { IBasicClientConfig } from "../config";

@Injectable()
export class AdminSessionMiddleware implements NestMiddleware {
  constructor(
    private readonly adminSessionService: AdminSessionService,
    private readonly configService: ConfigService
  ) {}
  async use(req: IRequestWithAdmin, _res: Response, next: () => void) {
    const {
      params: { kcClientId },
    } = req;

    const { realm } = this.configService.get<IBasicClientConfig>(
      `authentication.clients.${kcClientId}`
    );

    const adminSession =
      await this.adminSessionService.returnAdminSession(realm);

    req.adminSession = adminSession;

    next();
  }
}
