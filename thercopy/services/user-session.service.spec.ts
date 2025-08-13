import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserSessionService } from "./user-session.service";
import { ConfigService } from "@nestjs/config";
import { AdminSessionService } from "./admin-session.service";
import { Client, TokenSet } from "openid-client";

describe("UserSessionService", () => {
  let service: UserSessionService;
  let configService: ConfigService;
  let adminSessionService: AdminSessionService;

  const mockTokenSet = {
    access_token: "access_token_test",
    id_token: "id_token_test",
    refresh_token: "refresh_token_test",
  } as TokenSet;

  const mockUserInfo = {
    sub: "user123",
    preferred_username: "user1",
  };

  const mockUserIntrospect = {
    active: true,
    exp: 1234567890,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSessionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === "authentication.clients.test-client") {
                return { realm: "test-realm" };
              }
              return null;
            }),
          },
        },
        {
          provide: AdminSessionService,
          useValue: {
            getRefreshTokenRealmSettings: jest.fn().mockResolvedValue({
              revokeRefreshToken: true,
              refreshTokenMaxReuse: 2,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UserSessionService>(UserSessionService);
    configService = module.get<ConfigService>(ConfigService);
    adminSessionService = module.get<AdminSessionService>(AdminSessionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getSessionUser", () => {
    it("should return session data successfully", async () => {
      // Mock client methods
      const client = {
        userinfo: jest.fn().mockResolvedValue(mockUserInfo),
        introspect: jest.fn().mockResolvedValue(mockUserIntrospect),
      } as unknown as Client;

      const result = await service.getSessionUser(
        client,
        mockTokenSet,
        "test-client",
        1,
        "original-refresh-token"
      );

      expect(client.userinfo).toHaveBeenCalledWith(mockTokenSet);
      expect(client.introspect).toHaveBeenCalledWith(mockTokenSet.id_token);

      expect(configService.get).toHaveBeenCalledWith(
        "authentication.clients.test-client"
      );

      expect(
        adminSessionService.getRefreshTokenRealmSettings
      ).toHaveBeenCalledWith("test-realm");

      expect(result).toMatchObject({
        tokenSet: expect.objectContaining({
          refresh_token: "original-refresh-token",
          expires_at: mockUserIntrospect.exp,
        }),
        userInfo: mockUserInfo,
        userIntrospect: mockUserIntrospect,
        sessionConfig: {
          revokeRefreshToken: true,
          refreshTokenMaxReuse: 3,
          sessionRefreshCount: 1,
        },
      });
    });

    it("should throw UnauthorizedException on error", async () => {
      const client = {
        userinfo: jest.fn().mockRejectedValue(new Error("Failed userinfo")),
        introspect: jest.fn(),
      } as unknown as Client;

      await expect(
        service.getSessionUser(client, mockTokenSet, "test-client")
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
