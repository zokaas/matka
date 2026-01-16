import { httpFaker, WithAuthToken, DefaultInitializerType } from "@opr-finance/utils";
import * as Leandev from "@opr-finance/api-definitions";

export type KycRequest = {
    
} & DefaultInitializerType;

export async function kyc(
    data: KycRequest
): Promise<Leandev.AuthenticationAccessToken | null> {
    const url = `${data.gwUrl}/api/url`;
    const method = "POST";

    if (data.mockApiCalls) {
        return httpFaker<KycRequest, Leandev.AuthenticationAccessToken>(url, method, data, {

        });
    }

    const response = await fetch(url, {
        method,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            
        }),
    });

    return await response.json();
}
