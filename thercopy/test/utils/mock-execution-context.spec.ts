import { createMockExecutionContext } from "./mock-execution-context";
import { IRequestWithUser } from "../../interfaces";
import { ExecutionContext } from "@nestjs/common";
import { mockSessionDataSsn } from "../mock";

describe("createMockExecutionContext", () => {
  const mockRequest: IRequestWithUser = {
    user: mockSessionDataSsn,
  } as IRequestWithUser;

  it("should return a mock ExecutionContext with default controllerName", () => {
    const context: ExecutionContext = createMockExecutionContext(mockRequest);

    // Check basic structure
    expect(typeof context.switchToHttp).toBe("function");
    expect(typeof context.getClass).toBe("function");
    expect(typeof context.getHandler).toBe("function");
    expect(typeof context.getArgs).toBe("function");
    expect(typeof context.getArgByIndex).toBe("function");
    expect(typeof context.getType).toBe("function");

    // Check returned values
    const http = context.switchToHttp();
    expect(http.getRequest()).toBe(mockRequest);
    expect(typeof http.getResponse()).toBe("object");
    expect(typeof http.getNext()).toBe("function");
    expect(context.getClass().name).toBe("TestController");
    expect(context.getHandler()).toBeDefined();
    expect(context.getArgs()).toEqual([]);
    expect(context.getArgByIndex(0)).toBeUndefined();
    expect(context.getType()).toBe("http");
  });

  it("should return a mock ExecutionContext with custom controllerName", () => {
    const context: ExecutionContext = createMockExecutionContext(
      mockRequest,
      "CustomController"
    );
    expect(context.getClass().name).toBe("CustomController");
  });
});
