import { getEnv } from "~/environment";
import { postRequest } from "../utils/apiHelpers.server";

type T_SendAnswersPayload = {
  userId: string;
  applicationId: string;
  productId: string;
  questionSetId: string;
  answers: Array<{
    questionId: string;
    question: string;
    // 'answer' may be string | number | boolean | string[] | object (e.g., beneficialOwners[])
    // Keep it broad but typed:
    answer: unknown;
  }>;
};

export async function sendFormData(
  data: T_SendAnswersPayload,
  productId: string = "",
  kycType: string = "",
  applicationId: string = "",
  sessionId: string = ""
): Promise<any> {
  const sendFormPath = "answers";
  const { BFF_BASE_URL, BFF_KYC_BASE_PATH } = getEnv(process.env);

  if (!productId || !kycType || !applicationId) {
    throw new Error(
      `sendFormData: missing required params (productId: "${productId}", kycType: "${kycType}", applicationId: "${applicationId}")`
    );
  }

  const url = `${BFF_BASE_URL}/${BFF_KYC_BASE_PATH}/form/${sendFormPath}/${encodeURIComponent(
    productId
  )}/${encodeURIComponent(kycType)}/${encodeURIComponent(applicationId)}`;

  return postRequest(url, sessionId, data);
}
