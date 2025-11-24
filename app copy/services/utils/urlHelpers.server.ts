import { getEnv } from "~/environment";

export const buildUrl = (path: string, param?: string): string => {
    const baseUrl = getEnv(process.env).BFF_BASE_URL;

    return param ? `${baseUrl}/${path}/${param}` : `${baseUrl}/${path}`;
};
