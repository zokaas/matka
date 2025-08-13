import { IRedisClientConfigModule } from "@opr-finance/redis-client";
import { IAuthSessionGeneralProps } from "./auth-session-general-props.interface";

export interface IAuthSessionConfiguration extends IAuthSessionGeneralProps {
  redis: IRedisClientConfigModule;
  bff: {
    baseUrl: string;
    basePath: string;
  };
}
