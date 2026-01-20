import { FeatureLoginState } from "@opr-finance/feature-lfp-login";
import { DefaultInitializerType } from "@opr-finance/utils";

export enum SmeWithdrawActionConstants {
    WITHDRAW_INITIALIZER = "WITHDRAW/INITIALIZER",
    WITHDRAW_TRIGGER = "WITHDRAW/TRIGGER",
    WITHDRAW_SUCCESS = "WITHDRAW/SUCCESS",
    WITHDRAW_ERROR = "WITHDRAW/ERROR",
    WITHDRAW_RESET = "WITHDRAW/RESET",
}

export type SmeWithdrawReducerState = {
    config: DefaultInitializerType;
    withdraw: FrendsSmeWithdrawResponse;
};

export type SmeWithdrawPayload = {
    appliedAmount: number;
};

export type FeatureSmeWithdrawState<T = FeatureLoginState> = {
    withdraw: SmeWithdrawReducerState;
} & T;

export type CreateFrendsSmeWithdrawRequest = {
    appliedAmount: number;
    type: "CASH_WITHDRAWAL" | "PURCHASE";
    channel: "CSR" | "INSTORE_WEB" | "SMS" | "MY_PAGES" | "OTHER";
};

export type FrendsSmeWithdrawResponse = {
    message?: string;
    status: SmeWithdrawResponseStatus;
};

export enum SmeWithdrawResponseStatus {
    INITIAL = 0,
    SUCCESS = 201,
    UNAUTHORIZED = 401,
    ERROR = 500,
    NOT_FOUND = 404,
}
