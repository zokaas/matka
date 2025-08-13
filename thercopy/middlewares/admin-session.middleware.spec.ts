import { AdminSessionMiddleware } from "./admin-session.middleware";
import { AdminSessionService } from "../services";
import { ConfigService } from "@nestjs/config";
import { IRequestWithAdmin } from "../interfaces";
import { IBasicClientConfig } from "../config";
import { NextFunction } from "express";

describe("AdminSessionMiddleware", () => {
  let middleware: AdminSessionMiddleware;
  let adminSessionService: jest.Mocked<AdminSessionService>;
  let configService: jest.Mocked<ConfigService>;

  const mockAdminSession = { token: "mock-token", expiresAt: 123456 };
  const mockRealm = "test-realm";
  const mockKcClientId = "test-client";

  let req: IRequestWithAdmin;
  const res = {} as unknown as Response;
  let next: NextFunction;

  beforeEach(() => {
    adminSessionService = {
      returnAdminSession: jest.fn().mockResolvedValue(mockAdminSession),
    } as unknown as jest.Mocked<AdminSessionService>;

    configService = {
      get: jest
        .fn()
        .mockReturnValue({ realm: mockRealm } as unknown as IBasicClientConfig),
    } as unknown as jest.Mocked<ConfigService>;

    middleware = new AdminSessionMiddleware(adminSessionService, configService);

    // Create typed mocks
    req = {
      params: { kcClientId: mockKcClientId },
    } as IRequestWithAdmin;

    next = jest.fn();
  });
  it("should be defined", () => {
    expect(
      new AdminSessionMiddleware(adminSessionService, configService)
    ).toBeDefined();
  });

  describe("use", () => {
    it("should attach admin session and call next()", async () => {
      await middleware.use(req, res, next);

      expect(configService.get).toHaveBeenCalledWith(
        `authentication.clients.${mockKcClientId}`
      );
      expect(adminSessionService.returnAdminSession).toHaveBeenCalledWith(
        mockRealm
      );
      expect(req.adminSession).toEqual(mockAdminSession);
      expect(next).toHaveBeenCalled();
    });
  });
});
