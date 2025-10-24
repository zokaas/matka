import { getEnv } from "~/environment";
import { postRequest } from "../utils/apiHelpers.server";
import { T_Payload } from "../utils/mapDataForPayload.server";

export type T_SendFormDataResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export async function sendFormData(
  data: T_Payload,
  productId: string,
  kycType: string,
  applicationId: string,
  sessionId: string
): Promise<T_SendFormDataResponse> {
  const apiBaseUrl = getEnv(process.env).BFF_BASE_URL;
  const apiBasePath = getEnv(process.env).BFF_KYC_BASE_PATH;
  const url = `${apiBaseUrl}/${apiBasePath}/form/${productId}/${kycType}/${applicationId}`;

  try {
    const response = await postRequest(url, sessionId, data);
    return {
      success: true,
      message: "Form data submitted successfully",
      data: response
    };
  } catch (error) {
    console.error("Error sending form data:", error);
    return {
      success: false,
      message: "Failed to submit form data"
    };
  }
}