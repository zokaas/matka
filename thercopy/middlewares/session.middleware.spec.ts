import { SessionMiddleware } from "./session.middleware";
import { SessionService } from "../services";
import { IRequestWithUser } from "../interfaces";
import { SessionDto, UserInfoDto } from "../dtos/session";
import { NextFunction } from "express";
import { mockSessionDataSsn, mockUserInfoSsn } from "../test";

describe("SessionMiddleware", () => {
  let middleware: SessionMiddleware;
  let sessionService: jest.Mocked<SessionService>;

  const mockSessionId = "mock-session-id";
  const mockUserInfo: UserInfoDto = mockUserInfoSsn;
  const mockSessionData: SessionDto = mockSessionDataSsn;

  let req: IRequestWithUser;
  const res = {} as unknown as Response;
  let next: NextFunction;

  beforeEach(() => {
    sessionService = {
      getUserData: jest.fn().mockResolvedValue(mockUserInfo),
      getSessionData: jest.fn().mockResolvedValue(mockSessionData),
    } as unknown as jest.Mocked<SessionService>;

    middleware = new SessionMiddleware(sessionService);

    req = {
      header: jest.fn().mockReturnValue(mockSessionId),
    } as unknown as IRequestWithUser;

    next = jest.fn();
  });

  it("should be defined", () => {
    expect(new SessionMiddleware(sessionService)).toBeDefined();
  });

  describe("use", () => {
    it("should attach session info to request and call next()", async () => {
      await middleware.use(req, res, next);

      expect(req.header).toHaveBeenCalledWith("authorization");
      expect(sessionService.getUserData).toHaveBeenCalledWith(mockSessionId);
      expect(sessionService.getSessionData).toHaveBeenCalledWith(mockSessionId);

      expect(req.userInfo).toEqual(mockUserInfo);
      expect(req.user).toEqual(mockSessionData);
      expect(req.sessionId).toBe(mockSessionId);
      expect(next).toHaveBeenCalled();
    });

    it("should log error and still call next() on failure", async () => {
      sessionService.getUserData.mockRejectedValueOnce(new Error("boom"));

      const loggerSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await middleware.use(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(sessionService.getUserData).toHaveBeenCalled();

      loggerSpy.mockRestore();
    });
  });
});
