import { getEnv } from "~/environment";

export const buildUrl = (path: string, clientId: string): string => {
  const baseUrl = getEnv(process.env).BFF_BASE_URL;
  return `${baseUrl}/${path}/${clientId}`;
};
