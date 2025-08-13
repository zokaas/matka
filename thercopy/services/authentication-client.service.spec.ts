import { Test, TestingModule } from "@nestjs/testing";
import { AuthenticationClientService } from "./authentication-client.service";
import { ConfigService } from "@nestjs/config";
import { Issuer } from "openid-client";

jest.mock("openid-client", () => {
  return {
    generators: {
      state: jest.fn(() => "mock-state"),
      nonce: jest.fn(() => "mock-nonce"),
    },
    Issuer: {
      discover: jest.fn(),
    },
    Client: jest.fn(),
  };
});

describe("AuthenticationClientService", () => {
  let service: AuthenticationClientService;
  let configServiceMock: { get: jest.Mock };

  beforeEach(async () => {
    configServiceMock = {
      get: jest.fn((key: string) => {
        if (key === "authentication") {
          return { host: "http://keycloak.local" };
        }

        if (key === "authentication.clients.test-client") {
          return {
            clientId: "test-client-id",
            clientSecret: "test-secret",
            realm: "test-realm",
            redirectUrl: "http://localhost/redirect",
          };
        }

        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ConfigService, useValue: configServiceMock },
        AuthenticationClientService,
      ],
    }).compile();

    service = module.get<AuthenticationClientService>(
      AuthenticationClientService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getOidcLoginOptions", () => {
    it('should return correct login options for realm "fi"', () => {
      const result = service.getOidcLoginOptions(
        "nordea",
        "en",
        "bankid",
        "fi"
      );
      expect(result).toMatchObject({
        kc_idp_hint: "bankid",
        acr_values: "urn:signicat:oidc:method:nordea",
      });

      expect(result.state).toBeDefined();
      expect(result.nonce).toBeDefined();
    });
  });

  describe("buildOpenIdClient", () => {
    it("should build and return an OpenID client", async () => {
      const mockClient = {
        client_id: "test-client-id",
      };

      const mockIssuer = {
        Client: jest.fn().mockReturnValue(mockClient),
      };

      // Mock Issuer.discover
      (Issuer.discover as jest.Mock).mockResolvedValue(mockIssuer);

      const client = await service.buildOpenIdClient("test-client");

      expect(Issuer.discover).toHaveBeenCalledWith(
        "http://keycloak.local/realms/test-realm/.well-known/openid-configuration"
      );

      expect(mockIssuer.Client).toHaveBeenCalledWith({
        client_id: "test-client-id",
        client_secret: "test-secret",
        redirect_uris: ["http://localhost/redirect"],
        token_endpoint_auth_method: "client_secret_post",
        revocation_endpoint_auth_method: "client_secret_post",
      });

      expect(client).toBe(mockClient);
    });
  });
});
