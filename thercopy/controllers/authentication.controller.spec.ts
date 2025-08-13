import { Test, TestingModule } from "@nestjs/testing";
import { Request } from "express";
import { Session } from "express-session";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService, RefreshService } from "../services";
import {
  EndSessionResponseDto,
  SessionDto,
  SessionResponseDto,
  VerifySessionDto,
} from "../dtos";
import { mockSessionDataReference, mockTokenSet, mockIdToken } from "../test";

interface MockSessionRequest extends Request {
  session: Session & {
    client_id: string;
    messages: string[];
  };
}

describe("AuthenticationController", () => {
  let controller: AuthenticationController;
  let authService: jest.Mocked<AuthenticationService>;

  const mockSessionUser: SessionDto = mockSessionDataReference;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            handleLoginError: jest.fn(),
            sessionData: jest.fn(),
            getRedirectSuccessUrl: jest.fn(),
            logoutUser: jest.fn(),
            verifySession: jest.fn(),
          },
        },
        {
          provide: RefreshService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    authService = module.get(AuthenticationService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("loginFlowErrorCallback", () => {
    it("should return a redirect url from login error handler", async () => {
      const mockReq: MockSessionRequest = {
        session: {
          client_id: "test-client",
          messages: ["error occurred"],
        },
      } as unknown as MockSessionRequest;

      (authService.handleLoginError as jest.Mock).mockReturnValue(
        "http://frontend/error"
      );

      const result = await controller.loginFlowErrorCallback(mockReq);
      expect(authService.handleLoginError).toHaveBeenCalledWith("test-client", [
        "error occurred",
      ]);
      expect(result).toEqual({ url: "http://frontend/error" });
    });
  });

  describe("loginCallback", () => {
    it("should return a redirect url after successful login", async () => {
      const kcClientId = "my-client";
      const sessionId = "session-abc";

      const mockSessionResponse: SessionResponseDto = {
        sessionId,
      };

      (authService.sessionData as jest.Mock).mockResolvedValue(
        mockSessionResponse
      );
      (authService.getRedirectSuccessUrl as jest.Mock).mockReturnValue(
        "http://frontend/success"
      );

      const result = await controller.loginCallback(
        kcClientId,
        mockSessionUser,
        sessionId
      );

      expect(authService.sessionData).toHaveBeenCalledWith(
        "POST",
        `session/${sessionId}`,
        mockSessionUser
      );
      expect(authService.getRedirectSuccessUrl).toHaveBeenCalledWith(
        kcClientId,
        sessionId
      );
      expect(result).toEqual({ url: "http://frontend/success" });
    });
  });

  describe("logout", () => {
    it("should call logoutUser and return its result", async () => {
      const kcClientId = "my-client";
      const sessionId = "abc-123";

      const mockLogoutResponse: EndSessionResponseDto = {
        status: 200,
        message: "logged out",
      };

      (authService.logoutUser as jest.Mock).mockResolvedValue(
        mockLogoutResponse
      );

      const result = await controller.logout(
        mockTokenSet,
        kcClientId,
        sessionId
      );

      expect(authService.logoutUser).toHaveBeenCalledWith(
        kcClientId,
        mockIdToken,
        sessionId
      );
      expect(result).toEqual(mockLogoutResponse);
    });
  });

  describe("userinfo", () => {
    it("should return session info details", () => {
      const result = controller.userinfo(mockSessionUser);
      expect(result).toEqual({
        userInfo: mockSessionUser.userInfo,
        exp: mockSessionUser.userIntrospect.exp,
        sessionRefreshCount: mockSessionUser.sessionConfig.sessionRefreshCount,
        maxSessionRefresh: mockSessionUser.sessionConfig.refreshTokenMaxReuse,
      });
    });
  });

  describe("verifySession", () => {
    it("should return result from verifySession", () => {
      const exp = 1234567890;
      const verifyResult: VerifySessionDto = { status: true, ttl: 100 };

      (authService.verifySession as jest.Mock).mockReturnValue(verifyResult);

      const result = controller.verifySession(exp);
      expect(authService.verifySession).toHaveBeenCalledWith(exp);
      expect(result).toBe(verifyResult);
    });
  });
});
