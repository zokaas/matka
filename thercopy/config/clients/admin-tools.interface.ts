import { IBasicClientConfig } from "./basic.interface";

export interface IAdminToolsClientConfig
  extends Omit<IBasicClientConfig, "providerType" | "callbackUrl"> {
  realm: "master";
  idp: "admin-tools";
  callbackUrl: {
    host: string;
    loginPath: string;
    logoutPath: string;
    loginQueryParam: string;
  };
}
