import { IRequestWithUser } from "../../interfaces";
import { mockSessionDataReference, mockSessionId } from "../mock";

export function createMockRequest(
  overrides: Partial<IRequestWithUser> = {}
): IRequestWithUser {
  const req = {
    // Required properties
    headers: { authorization: mockSessionId },
    params: { kcClientId: "client-123", id: "test-id" },
    query: { kcClientId: "client-123", id: "test-id" },
    cookies: {},
    signedCookies: {},
    sessionId: mockSessionId,
    sessionRefreshCount: 0,
    user: mockSessionDataReference,
    userInfo: mockSessionDataReference.userInfo,
    tokenset: mockSessionDataReference.tokenSet,

    // Methods from express.Request
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
    is: jest.fn(),
    range: jest.fn(),
    param: jest.fn(),
    ...overrides,
  };

  return req as IRequestWithUser;
}
