import { Test, TestingModule } from "@nestjs/testing";
import { SessionService } from "./session.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { LoggerService } from "@opr-finance/logger";
import { mockTokenSet } from "../test";

// Extend SessionService to expose makeRequest for testing
class TestableSessionService extends SessionService {
  public override makeRequest = super.makeRequest;
}

describe("SessionService", () => {
  let service: TestableSessionService;
  const mockSessionId = "session_abc456";
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              // Return dummy config values based on key
              if (key === "apiAuthSession.baseUrl")
                return "http://test-base-url";
              if (key === "apiAuthSession.basePath") return "api/v1";
              return null;
            }),
          },
        },
        {
          provide: HttpService,
          useValue: {
            request: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            logError: jest.fn(),
          },
        },
        TestableSessionService,
      ],
    }).compile();

    service = module.get<TestableSessionService>(TestableSessionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getSessionData", () => {
    it("calls makeRequest and returns response", async () => {
      const mockResponse = { id: mockSessionId, user: "testUser" };

      jest.spyOn(service, "makeRequest").mockResolvedValueOnce(mockResponse);

      const result = await service.getSessionData(mockSessionId);

      expect(service.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: expect.stringContaining(mockSessionId),
        }),
        expect.stringContaining(mockSessionId),
        "SessionService"
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getUserData", () => {
    it("calls makeRequest and returns user info", async () => {
      const mockResponse = { username: "user1", email: "user1@example.com" };

      jest.spyOn(service, "makeRequest").mockResolvedValueOnce(mockResponse);

      const result = await service.getUserData(mockSessionId);

      expect(service.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: expect.stringContaining(`${mockSessionId}/userinfo`),
        }),
        expect.stringContaining(`${mockSessionId}/userinfo`),
        "SessionService"
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getTokens", () => {
    it("calls makeRequest and returns token set", async () => {
      const mockResponse = mockTokenSet;

      jest.spyOn(service, "makeRequest").mockResolvedValueOnce(mockResponse);

      const result = await service.getTokens(mockSessionId);

      expect(service.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: expect.stringContaining(`${mockSessionId}/token`),
        }),
        expect.stringContaining(`${mockSessionId}/token`),
        "SessionService"
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getSessionRefreshCount", () => {
    it("calls makeRequest and returns refresh count", async () => {
      const mockSessionCount = 3;

      jest
        .spyOn(service, "makeRequest")
        .mockResolvedValueOnce(mockSessionCount);

      const result = await service.getSessionRefreshCount(mockSessionId);

      expect(service.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: expect.stringContaining(`${mockSessionId}/refreshcount`),
        }),
        expect.stringContaining(`${mockSessionId}/refreshcount`),
        "SessionService"
      );
      expect(result).toEqual(mockSessionCount);
    });
  });

  describe("removeSessionData", () => {
    it("calls makeRequest and returns userInfo on success", async () => {
      const mockResponse = { username: "user1", email: "user1@example.com" };

      jest.spyOn(service, "makeRequest").mockResolvedValueOnce(mockResponse);

      const result = await service.removeSessionData(mockSessionId);

      expect(service.makeRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "DELETE",
          url: expect.stringContaining(`session/${mockSessionId}`),
        }),
        mockSessionId,
        "SessionService"
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
