import { DefaultInitializerType } from "@opr-finance/utils";
import {
    CreateFrendsSmeWithdrawRequest,
    FrendsSmeWithdrawResponse,
} from "../types/smeWithdraw.types";

export type CreateWithdrawRequest = {
    body: CreateFrendsSmeWithdrawRequest;
    accountId: string;
} & DefaultInitializerType;

export async function smeWithdraw(
    request: CreateWithdrawRequest
): Promise<FrendsSmeWithdrawResponse> {
    const url = `${request.gwUrl}/withdraw/api/loan/v8/accounts/${request.accountId}/tranches`;
    const method = "POST";
    try {
        const result: Response = await fetch(url, {
            method,
            headers: {
                "content-type": "application/json",
                Authorization: request.token as string,
            },
            body: JSON.stringify(request.body),
        });

        if (result.status === 200 || result.status === 201) {
            return {
                status: result.status,
                message: result.statusText,
            } as FrendsSmeWithdrawResponse;
        } else {
            const response: FrendsSmeWithdrawResponse = {
                status: result.status,
                message: result.statusText,
            };

            return response;
        }
    } catch (error: any) {
        throw new Error(error);
    }
}
