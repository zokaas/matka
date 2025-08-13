import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TRealmConfigKeys } from "../types";
import { OidcLoginOptionsDto, OidcRealmConfigMapValuesDto } from "../dtos";
import { Client, generators, Issuer } from "openid-client";
import {
  IAuthenticationConfigurationModule,
  IBasicClientConfig,
} from "../config";

@Injectable()
export class AuthenticationClientService {
  constructor(private readonly configService: ConfigService) {}
  private getRealmLoginOptions(
    bank: string,
    idp: string,
    realm: TRealmConfigKeys
  ): OidcRealmConfigMapValuesDto {
    const realmOptionsMap = new Map<
      TRealmConfigKeys,
      OidcRealmConfigMapValuesDto
    >([
      [
        "fi",
        { kc_idp_hint: idp, acr_values: `urn:signicat:oidc:method:${bank}` },
      ],
      ["se", { kc_idp_hint: idp, acr_values: "urn:signicat:oidc:method:sbid" }],
      ["nl", {}],
      ["master", { kc_idp_hint: idp }],
    ]);

    return realmOptionsMap.get(realm) || {};
  }

  getOidcLoginOptions(
    bank: string,
    lang: string,
    idp: string,
    realm: TRealmConfigKeys
  ): OidcLoginOptionsDto {
    const state = generators.state();
    const nonce = generators.nonce();

    return {
      session: true,
      profile: true,
      scope: ["openid"],
      nonce,
      state,
      provider: null,
      response_type: "code",
      lang,
      ...this.getRealmLoginOptions(bank, idp, realm),
    };
  }

  async buildOpenIdClient(kcClientId: string): Promise<Client> {
    const { host } =
      this.configService.get<IAuthenticationConfigurationModule>(
        "authentication"
      );

    const { clientId, clientSecret, realm, redirectUrl } =
      this.configService.get<IBasicClientConfig>(
        `authentication.clients.${kcClientId}`
      );

    const TrustIssuer = await Issuer.discover(
      `${host}/realms/${realm}/.well-known/openid-configuration`
    );

    const client = new TrustIssuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUrl],
      token_endpoint_auth_method: "client_secret_post",
      revocation_endpoint_auth_method: "client_secret_post",
    });

    return client;
  }
}
