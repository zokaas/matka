import { DefaultInitializerType } from "@opr-finance/utils";
import { ActionType, createAction } from "typesafe-actions";
import {
    FrendsSmeWithdrawResponse,
    SmeWithdrawActionConstants,
    SmeWithdrawPayload,
} from "../types/smeWithdraw.types";

export const smeWithdrawActions = {
    withdrawInitializer: createAction(
        SmeWithdrawActionConstants.WITHDRAW_INITIALIZER
    )<DefaultInitializerType>(),
    withdrawTrigger: createAction(
        SmeWithdrawActionConstants.WITHDRAW_TRIGGER
    )<SmeWithdrawPayload>(),
    withdrawSuccess: createAction(
        SmeWithdrawActionConstants.WITHDRAW_SUCCESS
    )<FrendsSmeWithdrawResponse>(),
    withdrawError: createAction(
        SmeWithdrawActionConstants.WITHDRAW_ERROR
    )<FrendsSmeWithdrawResponse>(),
    withdrawReset: createAction(SmeWithdrawActionConstants.WITHDRAW_RESET)(),
};

export type SmeWithdrawAction = ActionType<typeof smeWithdrawActions>;
