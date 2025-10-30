import { T_CountryArray } from "~/types";
import { getEnvVariables, T_EnvVariables } from "../utils";
import { getRequest } from "../utils/apiHelpers.server";

export const getCountryList = async (
    productId: string,
    sessionId: string
): Promise<T_CountryArray> => {
    const envData: T_EnvVariables = getEnvVariables();
    const url: string = `${envData.completeBaseUrl}/countrylist/${productId}`;

    const response = await getRequest<T_CountryArray>(url, sessionId);

    return response;
};
