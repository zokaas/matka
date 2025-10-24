import React from "react";
import { ActionFunctionArgs, redirect } from "react-router";
import { mapDataForPayload } from "~/services/utils/mapDataForPayload.server";
import { sendFormData } from "~/services/api/api-kyc.server";
import { T_Answers } from "~/types";
import { T_AnswerObject } from "~/types/formData";

export async function action({ request, params }: ActionFunctionArgs) {
  const { productId, kycType } = params;
  
  if (!productId || !kycType) {
    return 
  }
  
  try {
    const formData = await request.formData();
    
    // Extract form values from the formData
    const formValuesStr = formData.get('formValues') as string;
    const userId = formData.get('userId') as string;
    const applicationId = formData.get('applicationId') as string;
    const sessionId = formData.get('sessionId') as string;
    
    
    const formValuesEntries: [string, T_AnswerObject][] = JSON.parse(formValuesStr);
    const formValues: T_Answers = new Map(formValuesEntries);
    
    const payload = mapDataForPayload(
      formValues,
      userId,
      applicationId,
      productId,
    );
    
    const response = await sendFormData(payload, productId, kycType, applicationId, sessionId);
    
    if (response.success) {
      return redirect("/thank-you");
    }
    
    
  } catch (error) {
    console.error("Error processing form submission:", error);
  }
}

export default function Submit() {
  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold">Processing your submission...</h2>
      <p>Please wait while we process your form submission.</p>
    </div>
  );
}