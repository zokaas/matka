import { IAuthSessionConfiguration } from "../interfaces/auth-session-configuration.interface";
import { localConfiguration } from "./local.environment";

export const localWithLBConfiguration: IAuthSessionConfiguration = {
  ...localConfiguration,
  redis: {
    host: "api-auth-session-redis-lb",
    password: "redis",
    port: 6379,
  },
  bff: {
    baseUrl: "http://nginx:3500",
    basePath: "v2/gw",
  },
};
