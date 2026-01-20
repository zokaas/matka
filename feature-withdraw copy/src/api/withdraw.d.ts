import { DefaultInitializerType } from "@opr-finance/utils";
import { CreateFrendsWithdrawRequest, FrendsWithdrawResponse } from "../types/withdraw";
export type CreateWithdrawRequest = {
    body: CreateFrendsWithdrawRequest;
} & DefaultInitializerType;
export declare function withdraw(request: CreateWithdrawRequest): Promise<FrendsWithdrawResponse>;
