import { getRequest } from "../utils/apiHelpers.server";
import { T_ApiFormResponse, T_ParsedFormData } from "~/types";
import { parseResponse } from "../utils/parseResponse.server";
import { getEnvVariables, T_EnvVariables } from "../utils";
import { getCountryList } from "./get-country-list.server";

// If we use mockoon, mock data is not necessary anymore
// Mock data can be found in JSON files un .mockoon folder

export const getAndParseFormData = async (
    productId: string,
    kycType: string,
    sessionId: string
): Promise<T_ParsedFormData> => {
    const envData: T_EnvVariables = getEnvVariables();
    const url: string = `${envData.completeBaseUrl}/form/${productId}/${kycType}`;

    const response = await getRequest<T_ApiFormResponse>(url, sessionId);

    const parsedFormData: T_ParsedFormData = parseResponse(response);

    if (parsedFormData.generalFormData.useCountryList)
        parsedFormData.countryList = await getCountryList(productId, sessionId);

    return parsedFormData;
};
