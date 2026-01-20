import { WithdrawActionConstants, FrendsWithdrawResponse } from "../types/withdraw";
import { DefaultInitializerType } from "@opr-finance/utils";
import { ActionType, createAction } from "typesafe-actions";

export type WithdrawPayload = {
    amount: number;
    phoneNumber: string;
};

export const withdrawActions = {
    withdrawInitializer: createAction(
        WithdrawActionConstants.WITHDRAW_INITIALIZER
    )<DefaultInitializerType>(),
    withdrawTrigger: createAction(WithdrawActionConstants.WITHDRAW_TRIGGER)<WithdrawPayload>(),
    withdrawSuccess: createAction(
        WithdrawActionConstants.WITHDRAW_SUCCESS
    )<FrendsWithdrawResponse>(),
    withdrawError: createAction(WithdrawActionConstants.WITHDRAW_ERROR)<FrendsWithdrawResponse>(),
    withdrawReset: createAction(WithdrawActionConstants.WITHDRAW_RESET)(),
};

export type WithdrawAction = ActionType<typeof withdrawActions>;
