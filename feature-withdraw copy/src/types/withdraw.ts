import { FeatureLoginState } from "@opr-finance/feature-lfp-login";
import { DefaultInitializerType } from "@opr-finance/utils";

export enum WithdrawActionConstants {
    WITHDRAW_INITIALIZER = "WITHDRAW/INITIALIZER",
    WITHDRAW_TRIGGER = "WITHDRAW/TRIGGER",
    WITHDRAW_SUCCESS = "WITHDRAW/SUCCESS",
    WITHDRAW_ERROR = "WITHDRAW/ERROR",
    WITHDRAW_RESET = "WITHDRAW/RESET",
}

export type WithdrawReducerState = {
    config: DefaultInitializerType;
    withdraw: FrendsWithdrawResponse;
};

/** REFACTOR: This fixes type issues in Flex Online AppState as it needs to use feature-luvittaja-login,
 *  type T is defined as the LoginState being used, by default it is FeatureLoginState from feature-lfp-login
 *  todo: check if login state can be completely removed from this type
 */
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

export enum WithdrawResponseStatus {
    INITIAL = 0,
    SUCCESS = 200,
    UNAUTHORIZED = 401,
    ERROR = 500,
}
