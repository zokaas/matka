import { AuthenticationMiddleware } from "./authentication.middleware";
import { AuthenticationClientService } from "../services";
import { ConfigService } from "@nestjs/config";
import { UserSessionService } from "../services/user-session.service";
import { TRequestWithSession } from "../types";
import { Response, NextFunction } from "express";
import { OidcLoginOptionsDto } from "../dtos";
import * as passport from "passport";
import { BaseClient } from "openid-client";

jest.mock("passport");

jest.mock("../oidc.strategy", () => {
  return {
    OidcStrategy: jest.fn().mockImplementation(() => ({
      name: "mock-strategy",
    })),
  };
});

describe("AuthenticationMiddleware", () => {
  let middleware: AuthenticationMiddleware;
  let authenticationClientService: jest.Mocked<AuthenticationClientService>;
  let configService: jest.Mocked<ConfigService>;
  let userSessionService: jest.Mocked<UserSessionService>;

  let req: TRequestWithSession;
  const res = {} as Response;
  let next: NextFunction;

  const mockClientId = "client123";
  const mockFormId = "form456";
  const mockBank = "bank789";
  const mockLang = "en";

  const mockOidcLoginOptions: OidcLoginOptionsDto = {
    session: true,
    profile: true,
    scope: ["openid", "profile"],
    nonce: "abc123",
    state: "xyz456",
    provider: null,
    response_type: "code",
    lang: "en",
  };

  const mockOidcClient = {
    issuer: "mock-issuer",
  } as unknown as BaseClient;

  beforeEach(() => {
    authenticationClientService = {
      getOidcLoginOptions: jest.fn().mockReturnValue(mockOidcLoginOptions),
      buildOpenIdClient: jest.fn().mockResolvedValue(mockOidcClient),
    } as unknown as jest.Mocked<AuthenticationClientService>;

    configService = {
      get: jest.fn().mockReturnValue({ realm: "myrealm", idp: "myidp" }),
    } as unknown as jest.Mocked<ConfigService>;

    userSessionService = {} as unknown as jest.Mocked<UserSessionService>;

    middleware = new AuthenticationMiddleware(
      authenticationClientService,
      configService,
      userSessionService
    );

    req = {
      params: { kcClientId: mockClientId },
      query: {
        bank: mockBank,
        lang: mockLang,
        formId: mockFormId,
      },
      session: {},
    } as unknown as TRequestWithSession;

    next = jest.fn();
  });

  it("should build client, setup strategy and call next()", async () => {
    await middleware.use(req, res, next);

    expect(configService.get).toHaveBeenCalledWith(
      `authentication.clients.${mockClientId}`
    );

    expect(
      authenticationClientService.getOidcLoginOptions
    ).toHaveBeenCalledWith(mockBank, mockLang, "myidp", "myrealm");

    expect(authenticationClientService.buildOpenIdClient).toHaveBeenCalledWith(
      mockClientId
    );

    expect(passport.use).toHaveBeenCalledTimes(1);
    expect(typeof middleware.client).toBe("object");
    expect(middleware.oidcLoginOptions).toEqual(mockOidcLoginOptions);

    expect(req.session.client_id).toBe(mockClientId);
    expect(req.session.formId).toBe(mockFormId);
    expect(req.sessionId).toBe(mockFormId);

    expect(next).toHaveBeenCalled();
  });
});
