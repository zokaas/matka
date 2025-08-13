import { Test, TestingModule } from "@nestjs/testing";
import { AdminSessionService } from "./admin-session.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { LoggerService } from "@opr-finance/logger";
import { mockTokenSet, TestableAdminSessionService } from "../test";
import { of } from "rxjs";

describe("AdminSessionService", () => {
  let service: AdminSessionService;

  const mockLoggerService = {
    logError: jest.fn(),
  };

  const mockHttpService = {
    request: jest.fn(() =>
      of({
        data: mockTokenSet,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      })
    ),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case "apiAuthSession.baseUrl":
          return "http://localhost:3000";
        case "apiAuthSession.basePath":
          return "auth";
        case "authentication":
          return { host: "http://keycloak.local" };
        case "authentication.adminSession.test-realm":
          return {
            username: "admin",
            password: "adminpass",
          };
        default:
          return null;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: AdminSessionService, useClass: TestableAdminSessionService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<AdminSessionService>(AdminSessionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("sessionData", () => {
    it("should make a request and return session data", async () => {
      jest
        .spyOn(service as TestableAdminSessionService, "makeRequest")
        .mockResolvedValue(mockTokenSet);

      const result = await service.sessionData("GET", "session/test-realm");
      expect(result).toEqual(mockTokenSet);
    });
  });

  describe("createAdminSession", () => {
    it("should create an admin session and return token set", async () => {
      jest
        .spyOn(service as TestableAdminSessionService, "makeRequest")
        .mockResolvedValue(mockTokenSet);

      const result = await service.createAdminSession("test-realm");
      expect(result).toEqual(mockTokenSet);
    });
  });

  describe("returnAdminSession", () => {
    it("should return existing session if available", async () => {
      jest.spyOn(service, "sessionData").mockResolvedValueOnce(mockTokenSet);

      const result = await service.returnAdminSession("test-realm");
      expect(result).toEqual(mockTokenSet);
    });

    it("should create and save session if not available", async () => {
      jest
        .spyOn(service, "sessionData")
        .mockResolvedValueOnce(null) // No session found
        .mockResolvedValueOnce(mockTokenSet); // Save session

      jest.spyOn(service, "createAdminSession").mockResolvedValue(mockTokenSet);

      const result = await service.returnAdminSession("test-realm");
      expect(result).toEqual(mockTokenSet);
    });
  });

  describe("getRealmRepresentation", () => {
    it("should return realm representation", async () => {
      const mockRealm = {
        revokeRefreshToken: true,
        refreshTokenMaxReuse: 2,
      };

      jest
        .spyOn(service as TestableAdminSessionService, "makeRequest")
        .mockResolvedValue(mockRealm);

      const result = await service.getRealmRepresentation(
        "test-realm",
        "mock-token"
      );
      expect(result).toEqual(mockRealm);
    });
  });

  describe("getRefreshTokenRealmSettings", () => {
    it("should return refresh token realm settings", async () => {
      jest.spyOn(service, "returnAdminSession").mockResolvedValue(mockTokenSet);

      const mockRealmConfig = {
        revokeRefreshToken: true,
        refreshTokenMaxReuse: 1,
      };

      jest
        .spyOn(service, "getRealmRepresentation")
        .mockResolvedValue(mockRealmConfig);

      const result = await service.getRefreshTokenRealmSettings("test-realm");
      expect(result).toEqual(mockRealmConfig);
    });
  });
});
