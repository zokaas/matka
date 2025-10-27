// app copy/services/api/api-kyc.server.ts
import { getEnv } from "~/environment";
import { postRequest } from "../utils/apiHelpers.server";

export async function sendFormData(
    data: any,
    productId: string = "",
    kycType: string = "",
    applicationId: string = "",
    sessionId: string = ""
): Promise<any> {
    const apiBaseUrl = getEnv(process.env).BFF_BASE_URL;
    const apiBasePath = getEnv(process.env).BFF_KYC_BASE_PATH;
    
    // Current URL being built:
    const url = `${apiBaseUrl}/${apiBasePath}/form/${productId}/${kycType}/${applicationId}`;
    
    console.log("=== SENDING TO API ===");
    console.log("Full URL:", url);
    console.log("Data being sent:", JSON.stringify(data, null, 2));
    console.log("Session ID:", sessionId);
    
    return postRequest(url, sessionId, data);
}