import { FeatureLoginState } from "@opr-finance/feature-lfp-login";
import { DefaultInitializerType } from "@opr-finance/utils";
export declare enum WithdrawActionConstants {
    WITHDRAW_INITIALIZER = "WITHDRAW/INITIALIZER",
    WITHDRAW_TRIGGER = "WITHDRAW/TRIGGER",
    WITHDRAW_SUCCESS = "WITHDRAW/SUCCESS",
    WITHDRAW_ERROR = "WITHDRAW/ERROR",
    WITHDRAW_RESET = "WITHDRAW/RESET"
}
export type WithdrawReducerState = {
    config: DefaultInitializerType;
    withdraw: FrendsWithdrawResponse;
};
export type FeatureWithdrawState<T = FeatureLoginState> = {
    withdraw: WithdrawReducerState;
} & T;
export type CreateFrendsWithdrawRequest = {
    phoneNumber: string;
    amount: string;
};
export type FrendsWithdrawResponse = {
    message?: string;
    status: WithdrawResponseStatus;
};
export declare enum WithdrawResponseStatus {
    INITIAL = 0,
    SUCCESS = 200,
    UNAUTHORIZED = 401,
    ERROR = 500
}
