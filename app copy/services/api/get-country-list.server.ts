import { T_CountryArray } from "~/types";
import { getRequest } from "../utils/apiHelpers.server";
import { appConfig } from "~/config";

export const getCountryList = async (
    productId: string,
    sessionId: string
): Promise<T_CountryArray> => {
    const { apiBaseUrl } = appConfig;
    const url: string = `${apiBaseUrl}/countrylist/${productId}`;

    const response = await getRequest<T_CountryArray>(url, sessionId);

    return response;
};
