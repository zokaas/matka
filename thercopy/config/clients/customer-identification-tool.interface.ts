import { IBasicClientConfig } from "./basic.interface";

export interface ICustomerIdToolClientConfig
  extends Omit<IBasicClientConfig, "callbackUrl"> {
  callbackUrl: {
    host: string;
    loginPath: string;
    loginQueryParam: string;
    errorPath: string;
  };
}
