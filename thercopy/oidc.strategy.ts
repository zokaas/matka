import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Client, Strategy, TokenSet } from "openid-client";
import { OidcLoginOptionsDto } from "./dtos";
import { UserSessionService } from "./services/user-session.service";

@Injectable()
export class OidcStrategy extends PassportStrategy(Strategy, "oidc") {
  client: Client;
  oidcLoginOptions: OidcLoginOptionsDto;
  formId: string;

  constructor(
    private readonly userSessionService: UserSessionService,
    client: Client,
    private readonly oidcOptions: OidcLoginOptionsDto,
    formId: string,
    private readonly kcClientId
  ) {
    super({
      client,
      params: oidcOptions,
      passReqToCallback: false,
      usePKCE: false,
    });

    this.client = client;
    this.formId = formId;

    //NestJS already registers the strategy, so manually calling passport.use(this); is redundant
    //passport.use(this);
  }

  async validate(tokenSet: TokenSet): Promise<unknown> {
    return await this.userSessionService.getSessionUser(
      this.client,
      tokenSet,
      this.kcClientId
    );
  }
}
