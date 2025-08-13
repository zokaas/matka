import { IEnvironments } from "@opr-finance/config";
import { IAuthSessionConfiguration } from "./interfaces/auth-session-configuration.interface";
import { localConfiguration } from "./environments/local.environment";
import { localWithLBConfiguration } from "./environments/localWithLB.environment";
import { developmentConfiguration } from "./environments/development.environment";
import { productionConfiguration } from "./environments/production.environment";

const appConfigurationObject: IEnvironments<IAuthSessionConfiguration> = {
  local: localConfiguration,
  localWithLB: localWithLBConfiguration,
  development: developmentConfiguration,
  production: productionConfiguration,
};

// console.log(appConfigurationObject[process.env.CURRENT_ENV]);
// console.log(process.env.CURRENT_ENV);

export default () => appConfigurationObject[process.env.CURRENT_ENV]; // local / development / production
