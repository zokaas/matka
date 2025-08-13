import { sessionIdFactory } from "./session-id.decorator";
import { createMockExecutionContext } from "../test";
import { v4 as uuidv4 } from "uuid";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid"),
}));

describe("sessionIdFactory", () => {
  it("should return sessionId from request if present", () => {
    const mockRequest = {
      sessionId: "existing-session-id",
    };

    const ctx = createMockExecutionContext(mockRequest);
    const result = sessionIdFactory(undefined, ctx);

    expect(result).toBe("existing-session-id");
  });

  it("should generate and return a new sessionId if not present in request", () => {
    const mockRequest = {}; // no sessionId
    const ctx = createMockExecutionContext(mockRequest);

    const result = sessionIdFactory(undefined, ctx);

    expect(result).toBe("mocked-uuid");
    expect(uuidv4).toHaveBeenCalled();
  });
});
