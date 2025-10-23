import { getEnv } from "~/environment";
//import { T_SendFormDataResponse, T_Payload } from "~/types/apiTypes";
import { postRequest } from "../utils/apiHelpers.server";

export async function sendFormData(
    /* data: T_Payload, */
    //TODO: remove any
    data: any,
    productId: string = "",
    kycType: string = "",
    applicationId: string = "",
    sessionId: string = ""
    /* ): Promise<T_SendFormDataResponse> { */
    //TODO: remove any
): Promise<any> {
    const sendFormPath = "answers";
    const apiBaseUrl = getEnv(process.env).BFF_BASE_URL;
    const apiBasePath = getEnv(process.env).BFF_KYC_BASE_PATH;
    const url = `${apiBaseUrl}/${apiBasePath}/form/${sendFormPath}/${productId}/${kycType}/${applicationId}`;

    //const url = `${getEnv(process.env).API_BASE_URL}/${sendFormPath}/2/1/3`;
    return postRequest(url, sessionId, data);
}
