import { IAdminToolsClientConfig } from "./admin-tools.interface";
import { ICustomerIdToolClientConfig } from "./customer-identification-tool.interface";
import { IFinlandFlexOnlineClientConfig } from "./finland-flex-online.interface";
import { IFinlandTuottoaClientConfig } from "./finland-tuottoa.interface";
import { IFinlandB2bApplicationClientConfig } from "./finland-b2b-application.interface";
import { INetherlandsFlexApplicationClientConfig } from "./netherlands-flex-application.interface";
import { INetherlandsFlexOnlineClientConfig } from "./netherlands-flex-online.interface";
import { ISwedenB2bApplicationClientConfig } from "./sweden-b2b-application.interface";
import { ISwedenFlexOnlineClientConfig } from "./sweden-flex-online.interface";

export interface IClients {
  "admin-tools": IAdminToolsClientConfig;
  "customer-identification-tool": ICustomerIdToolClientConfig;
  "finland-flex-online": IFinlandFlexOnlineClientConfig;
  "finland-tuottoa-online": IFinlandTuottoaClientConfig;
  "finland-yritysluotto": IFinlandB2bApplicationClientConfig;
  "netherlands-flex-application": INetherlandsFlexApplicationClientConfig;
  "netherlands-flex-online": INetherlandsFlexOnlineClientConfig;
  "sweden-b2b-application": ISwedenB2bApplicationClientConfig;
  "sweden-flex-online": ISwedenFlexOnlineClientConfig;
}
