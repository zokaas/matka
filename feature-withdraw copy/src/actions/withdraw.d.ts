import { WithdrawActionConstants, FrendsWithdrawResponse } from "../types/withdraw";
import { DefaultInitializerType } from "@opr-finance/utils";
import { ActionType } from "typesafe-actions";
export type WithdrawPayload = {
    amount: number;
    phoneNumber: string;
};
export declare const withdrawActions: {
    withdrawInitializer: import("typesafe-actions").PayloadActionCreator<WithdrawActionConstants.WITHDRAW_INITIALIZER, DefaultInitializerType>;
    withdrawTrigger: import("typesafe-actions").PayloadActionCreator<WithdrawActionConstants.WITHDRAW_TRIGGER, WithdrawPayload>;
    withdrawSuccess: import("typesafe-actions").PayloadActionCreator<WithdrawActionConstants.WITHDRAW_SUCCESS, FrendsWithdrawResponse>;
    withdrawError: import("typesafe-actions").PayloadActionCreator<WithdrawActionConstants.WITHDRAW_ERROR, FrendsWithdrawResponse>;
    withdrawReset: import("typesafe-actions").EmptyActionCreator<WithdrawActionConstants.WITHDRAW_RESET>;
};
export type WithdrawAction = ActionType<typeof withdrawActions>;
