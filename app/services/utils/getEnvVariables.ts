import { getEnv } from "~/environment";
import { T_EnvVariables } from "./types";

export const getEnvVariables = (): T_EnvVariables => {
    const apiBasePath: string = getEnv(process.env).BFF_KYC_BASE_PATH;
    const apiBaseUrl: string = getEnv(process.env).BFF_BASE_URL;
    const completeBaseUrl: string = `${apiBaseUrl}/${apiBasePath}`;

    return {
        apiBasePath,
        apiBaseUrl,
        completeBaseUrl,
    };
};
