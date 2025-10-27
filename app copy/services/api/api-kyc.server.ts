import { getEnv } from "~/environment";
//import { T_SendFormDataResponse, T_Payload } from "~/types/apiTypes";
import { postRequest } from "../utils/apiHelpers.server";

export async function sendFormData(
    //TODO: remove any
    data: any,
    productId: string = "",
    kycType: string = "",
    applicationId: string = "",
    sessionId: string = ""
    /* ): Promise<T_SendFormDataResponse> { */
    //TODO: remove any
): Promise<any> {
    const apiBaseUrl = getEnv(process.env).BFF_BASE_URL;
    const apiBasePath = getEnv(process.env).BFF_KYC_BASE_PATH;
    
    const url = `${apiBaseUrl}/${apiBasePath}/form/${productId}/${kycType}/${applicationId}`;
    
    console.log("=== SENDING TO API ===");
    console.log("Full URL:", url);
    console.log("Data being sent:", JSON.stringify(data, null, 2));
    console.log("Session ID:", sessionId);
    
    return postRequest(url, sessionId, data);
}