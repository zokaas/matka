import { IAdminSessionConfig } from "./admin-session";
import { IClients } from "./clients";

export interface IAuthenticationConfigurationModule {
  host: string;
  clients: IClients;
  adminSession: IAdminSessionConfig;
}
