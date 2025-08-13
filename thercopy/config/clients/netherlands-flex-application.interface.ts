import { IBasicClientConfig } from "./basic.interface";

export interface INetherlandsFlexApplicationClientConfig
  extends Pick<
    IBasicClientConfig,
    "callbackUrl" | "encodedClientCredentials" | "realm"
  > {
  userHandling: {
    admin: string;
    password: string;
  };
}
