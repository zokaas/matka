import { Test, TestingModule } from "@nestjs/testing";
import { RefreshService } from "./refresh.service";
import { SessionService } from "./session.service";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("RefreshService", () => {
  let service: RefreshService;

  const mockSessionService = {
    getSessionData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        RefreshService,
      ],
    }).compile();

    service = module.get<RefreshService>(RefreshService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("refreshSession", () => {
    it("should return session refresh data successfully", async () => {
      const sessionId = "abc123";
      const kcClientId = "test-client";
      const mockSessionData = {
        userIntrospect: { exp: 1712345678 },
        sessionConfig: { sessionRefreshCount: 3 },
      };
      mockSessionService.getSessionData.mockResolvedValue(mockSessionData);
      const result = await service.refreshSession(sessionId, kcClientId);
      expect(result).toEqual({
        sessionId,
        exp: 1712345678,
        sessionRefreshCount: 3,
      });
    });

    it("should throw HttpException if getSessionData fails", async () => {
      const sessionId = "bad-session";
      const kcClientId = "client-error";
      mockSessionService.getSessionData.mockRejectedValue(
        new Error("error refresing session")
      );
      await expect(
        service.refreshSession(sessionId, kcClientId)
      ).rejects.toThrow("Failed to refresh session");
    });
  });
});
