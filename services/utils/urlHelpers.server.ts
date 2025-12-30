import { appConfig } from "~/config";

export const buildUrl = (path: string, param?: string): string => {
    const { bffBaseUrl } = appConfig;

    if (!param) return `${bffBaseUrl}/${path}`;

    return `${bffBaseUrl}/${path}/${param}`;
};
