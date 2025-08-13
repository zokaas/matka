import { IBasicClientConfig } from "./basic.interface";

export interface INetherlandsFlexOnlineClientConfig
  extends Omit<IBasicClientConfig, "idp" | "providerType"> {
  userHandling: {
    admin: string;
    password: string;
  };
}
