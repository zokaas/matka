import { Test, TestingModule } from "@nestjs/testing";
import { RefreshController } from "./refresh.controller";
import { AuthenticationService, RefreshService } from "../services";
import { RefreshSessionDto, SessionDto, SessionResponseDto } from "../dtos";

describe("RefreshController", () => {
  let controller: RefreshController;
  let mockRefreshService: Partial<RefreshService>;
  let mockAuthService: Partial<AuthenticationService>;

  beforeEach(async () => {
    mockRefreshService = {
      refreshSession: jest.fn(),
    };

    mockAuthService = {
      sessionData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefreshController],
      providers: [
        {
          provide: RefreshService,
          useValue: mockRefreshService,
        },
        {
          provide: AuthenticationService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<RefreshController>(RefreshController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  describe("refreshSession", () => {
    it("should call services and return refreshed session", async () => {
      const sessionId = "Bearer abc123";
      const kcClientId = "client-id";
      const sessionUser: SessionDto = {
        userId: "user1",
      } as unknown as SessionDto;

      const sessionResponse: SessionResponseDto = {
        sessionId: "abc123",
      } as SessionResponseDto;

      const refreshResponse: RefreshSessionDto = {
        token: "new-token",
      } as RefreshSessionDto;

      // Mock implementations
      (mockAuthService.sessionData as jest.Mock).mockResolvedValue(
        sessionResponse
      );
      (mockRefreshService.refreshSession as jest.Mock).mockResolvedValue(
        refreshResponse
      );

      const result = await controller.refreshSession(
        sessionId,
        kcClientId,
        sessionUser
      );

      expect(mockAuthService.sessionData).toHaveBeenCalledWith(
        "POST",
        `session/${sessionId}`,
        sessionUser
      );

      expect(mockRefreshService.refreshSession).toHaveBeenCalledWith(
        sessionResponse.sessionId,
        kcClientId
      );

      expect(result).toEqual(refreshResponse);
    });
  });
});
