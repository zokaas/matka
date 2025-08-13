import { Test, TestingModule } from "@nestjs/testing";
import { ApiAuthSessionService } from "./api-auth-session.service";
import { getRedisToken } from "@songkeys/nestjs-redis";
import {
  mockSessionDataSsn,
  mockSessionDataNoAttrs,
  mockSessionId,
  mockTokenSet,
  mockSessionDataReference,
  mockUserInfoSsn,
  mockUserIntrospectSsn,
} from "../test";

describe("ApiAuthSessionService", () => {
  let service: ApiAuthSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRedisToken("default"),
          useValue: {
            get: jest
              .fn()
              .mockImplementationOnce(null)
              .mockImplementation(() => JSON.stringify(mockSessionDataSsn)),
            set: jest.fn(),
            expire: jest.fn(),
            del: jest.fn(() => 1),
          },
        },
        ApiAuthSessionService,
      ],
    }).compile();
    service = module.get<ApiAuthSessionService>(ApiAuthSessionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getHello", () => {
    it("should return ocject with status property", () => {
      expect(service.getHello()).toHaveProperty(
        "status",
        "Never gonna give you up, never gonna let you down"
      );
    });
  });

  describe("saveSession", () => {
    it("should save admin session and return token set", async () => {
      const data = await service.saveAdminSessionToRedis(
        mockTokenSet,
        mockSessionId
      );
      expect(data).toStrictEqual(mockTokenSet);
    });

    it("should save session and return generated uuid", async () => {
      const uuidRegex = new RegExp(
        /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$/i
      );

      // ssn
      const uuid = await service.saveSessionToRedis(mockSessionDataSsn);
      expect(uuid).toMatch(uuidRegex);

      // session id given
      const providedUuid = await service.saveSessionToRedis(
        mockSessionDataSsn,
        mockSessionId
      );
      expect(providedUuid).toMatch(mockSessionId);

      // refernce
      const referenceUuid = await service.saveSessionToRedis(
        mockSessionDataReference
      );
      expect(referenceUuid).toMatch(uuidRegex);
    });
  });

  describe("throw an error", () => {
    let serviceToFail: ApiAuthSessionService;

    beforeEach(async () => {
      const newModule: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: getRedisToken("default"),
            useValue: {
              get: jest.fn(),
              set: jest.fn().mockRejectedValue("Error happened with redis"),
              expire: jest.fn(),
              del: jest.fn(),
            },
          },
          ApiAuthSessionService,
        ],
      }).compile();
      serviceToFail = newModule.get<ApiAuthSessionService>(
        ApiAuthSessionService
      );
    });

    it("should throw an error while saving the data", async () => {
      await expect(
        serviceToFail.saveAdminSessionToRedis(mockTokenSet, mockSessionId)
      ).rejects.toThrow("Unable to store data to memory");

      await expect(
        serviceToFail.saveSessionToRedis(mockSessionDataSsn, mockSessionId)
      ).rejects.toThrow("Unable to store data to memory");
    });

    it("should throw an error on missing reference", async () => {
      await expect(
        service.saveSessionToRedis(mockSessionDataNoAttrs)
      ).rejects.toThrow(
        "No user reference, check user data in authorisation platform"
      );
    });
  });

  describe("get session data", () => {
    it("should return null or user data", async () => {
      const nullData = await service.getAllSessionData("2");
      expect(nullData).toBeNull();

      const data = await service.getAllSessionData(mockSessionId);
      expect(data).toMatchObject(mockSessionDataSsn);
    });

    it("should return user data", async () => {
      const nullData = await service.getUserInfoFromSession("2");
      expect(nullData).toBeNull();

      const data = await service.getUserInfoFromSession(mockSessionId);
      expect(data).toMatchObject(mockUserInfoSsn);
    });

    it("should return introspect", async () => {
      const nullData = await service.getIntrospectFromSession("2");
      expect(nullData).toBeNull();

      const data = await service.getIntrospectFromSession(mockSessionId);
      expect(data).toMatchObject(mockUserIntrospectSsn);
    });

    it("should return access token", async () => {
      const nullData = await service.getAccessTokenFromSession("2");
      expect(nullData).toBeNull();

      const data = await service.getAccessTokenFromSession(mockSessionId);
      expect(data).toBe(mockTokenSet.access_token);
    });

    it("should return id token", async () => {
      const nullData = await service.getIdTokenFromSession("2");
      expect(nullData).toBeNull();

      const data = await service.getIdTokenFromSession(mockSessionId);
      expect(data).toBe(mockTokenSet.id_token);
    });

    it("should return refresh token", async () => {
      const nullData = await service.getRefreshTokenFromSession("2");
      expect(nullData).toBeNull();

      const data = await service.getRefreshTokenFromSession(mockSessionId);
      expect(data).toBe(mockTokenSet.refresh_token);
    });

    it("should return session refresh count token", async () => {
      const nullData = await service.getSessionRefreshCountFromSession("2");
      expect(nullData).toBeNull();

      const data =
        await service.getSessionRefreshCountFromSession(mockSessionId);
      expect(data).toBe(0);
    });

    it("should return number when redis key is deleted", async () => {
      const data = await service.destroyUserSession(mockSessionId);
      expect(data).toBe(1);
    });
  });
});
