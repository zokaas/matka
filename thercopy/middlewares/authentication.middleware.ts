import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import * as passport from "passport";
import { Client /* ClientOptions */ } from "openid-client";

import { AuthenticationClientService } from "../services";
import { TRequestWithSession } from "../types";
import { OidcLoginOptionsDto } from "../dtos";
import { IBasicClientConfig } from "../config";
import { OidcStrategy } from "../oidc.strategy";
import { UserSessionService } from "../services/user-session.service";

/**
 * Check ClientOptions for options and possibilities e.g. introspect
 */

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthenticationMiddleware.name);

  constructor(
    private readonly authenticationClientService: AuthenticationClientService,
    private readonly configService: ConfigService,
    private readonly userSessionService: UserSessionService
  ) {}

  client: Client;
  oidcLoginOptions: OidcLoginOptionsDto;

  async use(req: TRequestWithSession, _res: Response, next: () => void) {
    const { kcClientId } = req.params;
    const { bank, lang, formId } = req.query;

    if (formId) req.session.formId = formId;
    if (kcClientId) req.session.client_id = kcClientId;

    if (req.session.formId) req.sessionId = req.session.formId;

    const { realm, idp } = this.configService.get<IBasicClientConfig>(
      `authentication.clients.${kcClientId}`
    );

    this.oidcLoginOptions =
      this.authenticationClientService.getOidcLoginOptions(
        bank,
        lang,
        idp,
        realm
      );

    this.client =
      await this.authenticationClientService.buildOpenIdClient(kcClientId);

    const strategy = new OidcStrategy(
      this.userSessionService,
      this.client,
      this.oidcLoginOptions,
      req.session.formId,
      kcClientId
    );

    passport.use(strategy);
    next();
  }
}
