import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IBasicClientConfig } from "../config";

@Injectable()
export class ImpersonateService {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(ImpersonateService.name);

  getRedirectUrl(
    kcClientId: string,
    ref: string,
    refType: string,
    sessionId: string
  ): string {
    const {
      callbackUrl: { host, loginPath, loginQueryParam },
    } = this.configService.get<IBasicClientConfig>(
      `session.uiClients.${kcClientId}`
    );
    return `${host + loginPath}?${loginQueryParam}=${sessionId}&ref=${ref}&refType=${refType}&role=act-as-customer`;
  }
}
