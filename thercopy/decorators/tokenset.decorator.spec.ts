// tokenset.decorator.spec.ts
import { tokenSetFactoryFn } from "./tokenset.decorator";
import { createMockExecutionContext } from "../test";

describe("tokenSetFactoryFn", () => {
  const mockTokenSet = {
    id_token: "id123",
    access_token: "access123",
    refresh_token: "refresh123",
    token_type: "Bearer",
    session_state: "xyz-session",
    scope: "openid email",
  };

  const mockRequest = {
    user: {
      tokenSet: mockTokenSet,
    },
  };

  it("should return the full tokenSet if no key is passed", () => {
    const ctx = createMockExecutionContext(mockRequest);
    const result = tokenSetFactoryFn(undefined, ctx);
    expect(result).toEqual(mockTokenSet);
  });

  it("should return a specific token value if a key is passed", () => {
    const ctx = createMockExecutionContext(mockRequest);
    const result = tokenSetFactoryFn("access_token", ctx);
    expect(result).toBe("access123");
  });

  it("should return undefined if the tokenSet does not contain the key", () => {
    const ctx = createMockExecutionContext(mockRequest);
    const result = tokenSetFactoryFn("nonexistent", ctx);
    expect(result).toBeUndefined();
  });

  it("should return undefined if user or tokenSet is missing", () => {
    const ctx = createMockExecutionContext({}); // no user or tokenSet
    const result = tokenSetFactoryFn("access_token", ctx);
    expect(result).toBeUndefined();
  });
});
