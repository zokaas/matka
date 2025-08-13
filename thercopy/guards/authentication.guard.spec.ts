import { AuthenticationGuard } from "./authentication.guard";
import { ExecutionContext } from "@nestjs/common";
import { createMockExecutionContext, createMockRequest } from "../test";

describe("AuthenticationGuard", () => {
  let guard: AuthenticationGuard;

  beforeEach(() => {
    guard = new AuthenticationGuard();
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("should return false if no sessionId is provided", async () => {
    const request = createMockRequest({ headers: {} });
    const context = createMockExecutionContext(request);
    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });

  it("should return false if no user is provided", async () => {
    const request = createMockRequest({ user: undefined });
    const context = createMockExecutionContext(request);
    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });

  it("should return false if session is expired", async () => {
    const expiredUser = {
      ...createMockRequest().user,
      userIntrospect: {
        ...createMockRequest().user.userIntrospect,
        exp: Math.floor(Date.now() / 1000) - 10, // expired 10 seconds ago
      },
    };

    const request = createMockRequest({ user: expiredUser });
    const context = createMockExecutionContext(request);
    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });

  it("should return true for a valid session", async () => {
    const validUser = {
      ...createMockRequest().user,
      userIntrospect: {
        ...createMockRequest().user.userIntrospect,
        exp: Math.floor(Date.now() / 1000) + 1000,
      },
    };

    const request = createMockRequest({ user: validUser });
    const context = createMockExecutionContext(request);
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it("should return false if an error is thrown", async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => {
          throw new Error("Unexpected failure");
        },
        getResponse: () => ({}),
        getNext: () => jest.fn(),
      }),
      getClass: () => ({ name: "TestController", prototype: {} }),
      getHandler: () => jest.fn(),
      getArgs: () => jest.fn(),
      getArgByIndex: () => undefined,
      getType: () => "http",
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });
});
