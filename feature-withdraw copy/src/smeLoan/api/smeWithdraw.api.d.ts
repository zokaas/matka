import { DefaultInitializerType } from "@opr-finance/utils";
import { CreateFrendsSmeWithdrawRequest, FrendsSmeWithdrawResponse } from "../types/smeWithdraw.types";
export type CreateWithdrawRequest = {
    body: CreateFrendsSmeWithdrawRequest;
    accountId: string;
} & DefaultInitializerType;
export declare function smeWithdraw(request: CreateWithdrawRequest): Promise<FrendsSmeWithdrawResponse>;
