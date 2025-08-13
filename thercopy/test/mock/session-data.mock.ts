import {
  SessionDto,
  TokenSetDto,
  UserAttributesDto,
  UserInfoDto,
  UserIntrospectDto,
  UserIntrospectRestDto,
} from "../../dtos";

export const mockSessionId = "123-123-123";

export const saveSessionResponse = {
  sessionId: mockSessionId,
};

export const mockIdToken: string = "id_token-test";
export const mockAccessToken: string = "access_token-test";
export const mockRefreshToken: string = "refresh_token-test";

export const mockTokenSet: TokenSetDto = {
  id_token: mockIdToken,
  access_token: mockAccessToken,
  refresh_token: mockRefreshToken,
  token_type: "Bearer",
  session_state: "123-123-123",
  scope: "openid profile",
};

/* Reference */
export const mockAttrsReference: UserAttributesDto = {
  bank: "Spider-bank",
  birthdate: "19.08.1990",
  firstname: "Peter",
  lastname: "Parker",
  fullname: "Peter Parker",
  reference: "19081990-123C",
  refType: "SSN",
};

export const mockUserInfoReference: UserInfoDto = {
  sub: "some-sub",
  email_verified: false,
  name: "Peter Parker",
  preferred_username: "peter.parker",
  user_roles: ["admin", "god"],
  given_name: "Peter",
  family_name: "Parker",
  attrs: mockAttrsReference,
};

export const mockUserIntrospectRest: UserIntrospectRestDto = {
  "allowed-origins": ["origin1", "origin2"],
  exp: 123123123,
  iat: 987987987,
  auth_time: 123123000,
  jti: "jti",
  iss: "iss",
  aud: ["audience1"],
  typ: "typ",
  azp: "azp",
  sid: "sid",
  acr: "acr",
  realm_access: {
    roles: ["admin", "user"],
  },
  resource_access: {
    broker: {
      roles: ["admin", "broker-user"],
    },
    account: {
      roles: ["admin", "account-user"],
    },
  },
  client_id: "client-id",
  username: "some-username",
  token_type: "Bearer",
  active: true,
};

export const mockUserIntrospectReference: UserIntrospectDto = {
  ...mockUserInfoReference,
  ...mockUserIntrospectRest,
};

export const mockSessionDataReference: SessionDto = {
  tokenSet: mockTokenSet,
  userInfo: mockUserInfoReference,
  userIntrospect: mockUserIntrospectReference,
  sessionConfig: {
    revokeRefreshToken: false,
    refreshTokenMaxReuse: 0,
    sessionRefreshCount: 0,
  },
};

/* SSN */
export const mockAttrsSsn: UserAttributesDto = {
  bank: "Spider-bank",
  birthdate: "19.08.1990",
  firstname: "Peter",
  lastname: "Parker",
  fullname: "Peter Parker",
  refType: "SSN",
  ssn: "19081990-123C",
};

export const mockUserInfoSsn: UserInfoDto = {
  sub: "some-sub",
  email_verified: false,
  name: "Peter Parker",
  preferred_username: "peter.parker",
  user_roles: ["admin", "god"],
  given_name: "Peter",
  family_name: "Parker",
  attrs: mockAttrsSsn,
};

export const mockUserIntrospectSsn: UserIntrospectDto = {
  ...mockUserInfoSsn,
  ...mockUserIntrospectRest,
};

export const mockSessionDataSsn: SessionDto = {
  tokenSet: mockTokenSet,
  userInfo: mockUserInfoSsn,
  userIntrospect: mockUserIntrospectSsn,
  sessionConfig: {
    revokeRefreshToken: false,
    refreshTokenMaxReuse: 0,
    sessionRefreshCount: 0,
  },
};

/* No attrs */
export const mockUserInfoNoAttrs: UserInfoDto = {
  sub: "some-sub",
  email_verified: false,
  name: "Peter Parker",
  preferred_username: "peter.parker",
  user_roles: ["admin", "god"],
  given_name: "Peter",
  family_name: "Parker",
  attrs: {},
};

export const mockUserIntrospectNoAttrs: UserIntrospectDto = {
  ...mockUserInfoNoAttrs,
  ...mockUserIntrospectRest,
};

export const mockSessionDataNoAttrs: SessionDto = {
  tokenSet: mockTokenSet,
  userInfo: mockUserInfoNoAttrs,
  userIntrospect: mockUserIntrospectNoAttrs,
  sessionConfig: {
    revokeRefreshToken: false,
    refreshTokenMaxReuse: 0,
    sessionRefreshCount: 0,
  },
};
