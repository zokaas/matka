import { getEnvVariables, T_EnvVariables } from "../utils";
import { getRequest } from "../utils/apiHelpers.server";

export const getCountryList = async (
    productId: string,
    sessionId: string
): Promise<Array<string>> => {
    const envData: T_EnvVariables = getEnvVariables();
    const url: string = `${envData.completeBaseUrl}/countrylist/${productId}`;

    const response = await getRequest<Array<string>>(url, sessionId);

    return response;
};
