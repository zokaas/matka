import { DefaultInitializerType } from "@opr-finance/utils";
import { CreateFrendsWithdrawRequest, FrendsWithdrawResponse } from "../types/withdraw";

export type CreateWithdrawRequest = {
    body: CreateFrendsWithdrawRequest;
} & DefaultInitializerType;

export async function withdraw(request: CreateWithdrawRequest): Promise<FrendsWithdrawResponse> {
    const url = request.mockApiCalls ? `${request.gwUrl}?localDev=true` : request.gwUrl;
    const method = "POST";

    const result: Response = await fetch(url, {
        method,
        headers: {
            "content-type": "application/json",
            Authorization: request.token as string,
        },
        body: JSON.stringify(request.body),
    });

    if (result.status === 200) {
        return {
            status: result.status,
        } as FrendsWithdrawResponse;
    }

    const parseResponse = await result.json();

    const response: FrendsWithdrawResponse = {
        status: result.status,
        message: parseResponse.Message, // Frends returns C# style property name
    };

    return response;
}
