import { Test, TestingModule } from "@nestjs/testing";
import { AuthenticationService } from "./authentication.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { LoggerService } from "@opr-finance/logger";
import { of, throwError } from "rxjs";
import { HttpException, HttpStatus } from "@nestjs/common";
import { AxiosHeaders, AxiosResponse } from "axios";
import { mockSessionDataReference, mockIdToken, mockSessionId } from "../test";

describe("AuthenticationService", () => {
  let service: AuthenticationService;
  let configService: ConfigService;
  let httpService: HttpService;
  let loggerService: LoggerService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case "authentication.clients.client-id":
          return {
            realm: "realm-id",
            clientId: "client-id",
          };
        case "authentication":
          return {
            host: "http://keycloak",
          };
        case "authentication.clients.client-id.callbackUrl":
          return {
            host: "http://client-app",
            loginPath: "/login/success",
            loginQueryParam: "sessionId",
            errorPath: "/login/error",
          };
        default:
          return undefined;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: {
            request: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            logError: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getRedirectSuccessUrl", () => {
    it("should return correct success URL", () => {
      const result = service.getRedirectSuccessUrl("client-id", "abc123");
      expect(result).toBe("http://client-app/login/success?sessionId=abc123");
    });
  });

  describe("getRedirectErrorUrl", () => {
    it("should return correct error URL", () => {
      const result = service.getRedirectErrorUrl("client-id");
      expect(result).toBe("http://client-app/login/error");
    });
  });

  describe("handleLoginError", () => {
    it("should log error and return redirect URL", () => {
      const logSpy = jest.spyOn(loggerService, "logError");
      const result = service.handleLoginError("client-id", [
        "Something went wrong",
      ]);
      expect(logSpy).toHaveBeenCalled();
      expect(result).toBe("http://client-app/login/error");
    });
  });

  describe("verifySession", () => {
    it("should return session status and ttl", () => {
      const exp = Math.floor(Date.now() / 1000) + 60;
      const result = service.verifySession(exp);
      expect(result.status).toBe(true);
      expect(result.ttl).toBeGreaterThan(0);
    });

    it("should return false if session is expired", () => {
      const exp = Math.floor(Date.now() / 1000) - 10;
      const result = service.verifySession(exp);
      expect(result.status).toBe(false);
      expect(result.ttl).toBeLessThan(0);
    });
  });

  describe("logoutUser", () => {
    it("should call Keycloak and delete session successfully", async () => {
      const kcResponse: AxiosResponse = {
        data: {},
        status: HttpStatus.OK,
        statusText: "OK",
        headers: {},
        config: {
          headers: new AxiosHeaders(),
          method: "get",
          url: "http://keycloak/realms/realm-id/protocol/openid-connect/logout",
        },
      };

      const apiSessionDeleteResponse = {
        status: HttpStatus.OK,
        message: "User logged out",
      };

      const requestMock = jest
        .fn()
        .mockReturnValueOnce(of(kcResponse)) // Keycloak logout
        .mockReturnValueOnce(
          of({ data: apiSessionDeleteResponse, status: HttpStatus.OK })
        ); // DELETE session

      (httpService.request as jest.Mock) = requestMock;

      const result = await service.logoutUser(
        "client-id",
        mockIdToken,
        mockSessionId
      );
      expect(result).toEqual(apiSessionDeleteResponse);
      expect(requestMock).toHaveBeenCalledTimes(2);
    });

    it("should handle error during logout", async () => {
      const errorResponse = {
        response: {
          status: 500,
          data: { message: "Something went wrong" },
        },
      };
      (httpService.request as jest.Mock).mockReturnValueOnce(
        throwError(() => errorResponse)
      );

      await expect(
        service.logoutUser("client-id", mockIdToken, mockSessionId)
      ).rejects.toThrow(HttpException);
    });
  });

  describe("sessionData", () => {
    it("should make a request and return data", async () => {
      const mockResult = { sessionId: mockSessionId };
      const requestMock = jest
        .fn()
        .mockReturnValueOnce(of({ data: mockResult, status: HttpStatus.OK }));
      (httpService.request as jest.Mock) = requestMock;

      const result = await service.sessionData(
        "POST",
        "session",
        mockSessionDataReference
      );
      expect(result).toEqual(mockResult);
    });
  });
});
