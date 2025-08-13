import { IAuthSessionConfiguration } from "../interfaces/auth-session-configuration.interface";

const basePath: string = "http://localhost:3501";
const globalPathPrefix: string = "v1/api-auth-session";

export const localConfiguration: IAuthSessionConfiguration = {
  app: {
    port: 3501,
    swaggerDocsEnabled: false,
    sessionSecret: "ss",
    corsWhitelistedUrls: [
      "http://localhost:3500",
    ],
    globalPathPrefix,
    basePath,
  },
  redis: {
    host: "localhost",
    password: "redis",
    port: 6380,
  },
  bff: {
    baseUrl: "http://localhost:3500",
    basePath: "v2/gw",
  },
};
