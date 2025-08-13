// admin-session.decorator.spec.ts
import { adminSessionFactory } from "./admin-session.decorator";
import { createMockExecutionContext } from "../test";
import { TokenSetDto } from "../dtos";
import { IRequestWithUser } from "../interfaces";

describe("AdminSession Decorator Factory", () => {
  const mockAdminSession: TokenSetDto = {
    id_token: "id123",
    access_token: "access123",
    refresh_token: "refresh123",
    token_type: "Bearer",
    session_state: "xyz-session",
    scope: "openid email",
    expires_in: 3600,
    expires_at: 1720000000,
  };

  const mockRequest: IRequestWithUser = {
    adminSession: mockAdminSession,
    user: {},
    userInfo: {},
    tokenset: mockAdminSession,
    sessionId: "abc",
  } as unknown as IRequestWithUser;

  it("should return full TokenSetDto when no key is passed", () => {
    const ctx = createMockExecutionContext(mockRequest);
    const result = adminSessionFactory(undefined, ctx);
    expect(result).toEqual(mockAdminSession);
  });

  it("should return access_token from TokenSetDto", () => {
    const ctx = createMockExecutionContext(mockRequest);
    const result = adminSessionFactory("access_token", ctx);
    expect(result).toBe("access123");
  });

  it("should return undefined for missing key", () => {
    const ctx = createMockExecutionContext(mockRequest);
    const result = adminSessionFactory("nonexistent_key", ctx);
    expect(result).toBeUndefined();
  });

  it("should return undefined if adminSession is undefined", () => {
    const incompleteRequest = {
      ...mockRequest,
      adminSession: undefined,
    } as unknown as IRequestWithUser;

    const ctx = createMockExecutionContext(incompleteRequest);
    const result = adminSessionFactory("access_token", ctx);
    expect(result).toBeUndefined();
  });
});
