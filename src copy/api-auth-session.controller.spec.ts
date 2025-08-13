import { Test, TestingModule } from "@nestjs/testing";
import { ApiAuthSessionController } from "./api-auth-session.controller";
import { ApiAuthSessionService } from "./api-auth-session.service";
import { getRedisToken } from "@songkeys/nestjs-redis";
import {
  mockSessionDataSsn,
  mockSessionId,
  saveSessionResponse,
  mockTokenSet,
  mockUserInfoSsn,
  mockAccessToken,
  mockIdToken,
  mockRefreshToken,
} from "../test";

describe("ApiAuthSessionController", () => {
  let appController: ApiAuthSessionController;

  const getHelloResolveValue = "Hello, world";
  const mockTokenResponse = {
    access_token: mockAccessToken,
    id_token: mockIdToken,
    refresh_token: mockRefreshToken,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApiAuthSessionController],
      providers: [
        {
          provide: ApiAuthSessionService,
          useValue: {
            getHello: jest.fn().mockReturnValue(getHelloResolveValue),
            saveSessionToRedis: jest.fn().mockResolvedValue(mockSessionId),
            saveAdminSessionToRedis: jest.fn().mockResolvedValue(mockTokenSet),
            getAllSessionData: jest.fn().mockResolvedValue(mockSessionDataSsn),
            getUserInfoFromSession: jest
              .fn()
              .mockResolvedValue(mockUserInfoSsn),
            getAccessTokenFromSession: jest
              .fn()
              .mockResolvedValue(mockAccessToken),
            getIdTokenFromSession: jest.fn().mockResolvedValue(mockIdToken),
            getRefreshTokenFromSession: jest
              .fn()
              .mockResolvedValue(mockRefreshToken),
            destroyUserSession: jest.fn().mockResolvedValue(1),
            getSessionRefreshCountFromSession: jest.fn().mockResolvedValue(2),
          },
        },
        {
          provide: getRedisToken("default"),
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            expire: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<ApiAuthSessionController>(ApiAuthSessionController);
  });

  it("should be defined", () => {
    expect(appController).toBeDefined();
  });

  describe("health", () => {
    it("should return mock value", () => {
      expect(appController.getHello()).toBe(getHelloResolveValue);
    });
  });

  describe("saveSession", () => {
    it("should return mock sessionId", async () => {
      expect(await appController.saveSession(mockSessionDataSsn)).toStrictEqual(
        saveSessionResponse
      );
    });
  });

  describe("adminSession", () => {
    it("should return mock admin sessionData", async () => {
      expect(
        await appController.saveAdminSessionWithId(mockTokenSet, mockSessionId)
      ).toStrictEqual(mockTokenSet);
    });
  });

  describe("sessionWithId", () => {
    it("should save and return given session id", async () => {
      expect(
        await appController.saveSessionWithId(mockSessionDataSsn, mockSessionId)
      ).toStrictEqual(saveSessionResponse);
    });

    it("should return session with given session id", async () => {
      expect(await appController.getSession(mockSessionId)).toStrictEqual(
        mockSessionDataSsn
      );
    });

    it("should return user info from session data with given session id", async () => {
      expect(await appController.getUserInfo(mockSessionId)).toStrictEqual(
        mockUserInfoSsn
      );
    });

    it("should return tokenset with given session id", async () => {
      expect(await appController.getAccessToken(mockSessionId)).toStrictEqual(
        mockTokenResponse
      );
    });

    it("should return 1 when session is deleted on given session id", async () => {
      expect(await appController.removeSession(mockSessionId)).toBe(1);
    });

    it("should return count of session refresh on given session id", async () => {
      expect(await appController.getSessionRefreshCount(mockSessionId)).toBe(2);
    });
  });
});
