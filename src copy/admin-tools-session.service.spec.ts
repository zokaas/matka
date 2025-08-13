import { AdminToolsSessionService } from "./admin-tools-session.service";
import { mockTokenSet, mockSessionId } from "../test";

describe("AdminToolsSessionService", () => {
  let service: AdminToolsSessionService;
  const mockRedis = {
    get: jest.fn(),
  };

  beforeEach(() => {
    service = new AdminToolsSessionService(mockRedis as any);
  });

  it("should return parsed tokenSet from Redis", async () => {
    // Arrange
    const redisKey = `admin-tools-session:${mockSessionId}`;
    mockRedis.get.mockResolvedValueOnce(JSON.stringify(mockTokenSet));

    // Act
    const result = await service.getAdminSessionFromRedis(mockSessionId);

    // Assert
    expect(mockRedis.get).toHaveBeenCalledWith(redisKey);
    expect(result).toEqual(mockTokenSet);
  });

  it("should return null if no session exists in Redis", async () => {
    // Arrange
    mockRedis.get.mockResolvedValueOnce(null);

    // Act
    const result = await service.getAdminSessionFromRedis("unknown-session");

    // Assert
    expect(result).toBeNull();
  });
});
