import { SessionRefreshMiddleware } from "./refresh.middleware";
import { AuthenticationClientService, SessionService } from "../services";
import { UserSessionService } from "../services/user-session.service";
import { IRequestWithUser } from "../interfaces";
import { Response, NextFunction } from "express";
import { HttpException, HttpStatus } from "@nestjs/common";
import { mockSessionDataSsn } from "../test";
import { BaseClient } from "openid-client";

describe("SessionRefreshMiddleware", () => {
  let middleware: SessionRefreshMiddleware;
  let authClientService: jest.Mocked<AuthenticationClientService>;
  let sessionService: jest.Mocked<SessionService>;
  let userSessionService: jest.Mocked<UserSessionService>;

  let req: IRequestWithUser;
  const res = {} as Response;
  let next: NextFunction;

  const mockSessionId = "mock-session-id";
  const mockKcClientId = "test-client";

  const mockSessionData = mockSessionDataSsn;

  const mockRefreshedTokenSet = {
    access_token: "new-access",
    refresh_token: "new-refresh",
    expires_at: 1234569999,
  };

  const mockSessionUser = {
    id: "user-id",
    email: "user@example.com",
  };

  beforeEach(() => {
    authClientService = {
      buildOpenIdClient: jest.fn().mockResolvedValue({
        refresh: jest.fn().mockResolvedValue(mockRefreshedTokenSet),
      }),
    } as unknown as jest.Mocked<AuthenticationClientService>;

    sessionService = {
      getSessionData: jest.fn().mockResolvedValue(mockSessionData),
      removeSessionData: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<SessionService>;

    userSessionService = {
      getSessionUser: jest.fn().mockResolvedValue(mockSessionUser),
    } as unknown as jest.Mocked<UserSessionService>;

    middleware = new SessionRefreshMiddleware(
      authClientService,
      sessionService,
      userSessionService
    );

    req = {
      header: jest.fn().mockReturnValue(mockSessionId),
      params: { kcClientId: mockKcClientId },
    } as unknown as IRequestWithUser;

    next = jest.fn();
  });

  it("should be defined", () => {
    expect(
      new SessionRefreshMiddleware(
        authClientService,
        sessionService,
        userSessionService
      )
    ).toBeDefined();
  });

  describe("use", () => {
    it("should refresh session and attach user", async () => {
      await middleware.use(req, res, next);

      expect(req.header).toHaveBeenCalledWith("authorization");
      expect(sessionService.getSessionData).toHaveBeenCalledWith(mockSessionId);
      expect(authClientService.buildOpenIdClient).toHaveBeenCalledWith(
        mockKcClientId
      );
      expect(req.user).toEqual(mockSessionUser);
      expect(next).toHaveBeenCalled();
    });

    it("should throw if sessionRefreshCount exceeds max", async () => {
      mockSessionData.sessionConfig.sessionRefreshCount = 5;

      sessionService.getSessionData.mockResolvedValueOnce(mockSessionData);

      await expect(middleware.use(req, res, next)).rejects.toThrow(
        new HttpException("session refresh failed", HttpStatus.FORBIDDEN)
      );

      expect(sessionService.removeSessionData).toHaveBeenCalledWith(
        mockSessionId
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle token refresh error gracefully", async () => {
      const clientMock = {
        refresh: jest.fn().mockRejectedValue(new Error("refresh error")),
      };

      authClientService.buildOpenIdClient.mockResolvedValueOnce(
        clientMock as unknown as BaseClient
      );

      await expect(middleware.use(req, res, next)).rejects.toThrow(
        new HttpException("session refresh failed", HttpStatus.FORBIDDEN)
      );

      expect(sessionService.removeSessionData).toHaveBeenCalledWith(
        mockSessionId
      );
      expect(next).not.toHaveBeenCalled();
    });
  });
});
