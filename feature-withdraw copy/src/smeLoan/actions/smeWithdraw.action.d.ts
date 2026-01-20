import { DefaultInitializerType } from "@opr-finance/utils";
import { ActionType } from "typesafe-actions";
import { FrendsSmeWithdrawResponse, SmeWithdrawActionConstants, SmeWithdrawPayload } from "../types/smeWithdraw.types";
export declare const smeWithdrawActions: {
    withdrawInitializer: import("typesafe-actions").PayloadActionCreator<SmeWithdrawActionConstants.WITHDRAW_INITIALIZER, DefaultInitializerType>;
    withdrawTrigger: import("typesafe-actions").PayloadActionCreator<SmeWithdrawActionConstants.WITHDRAW_TRIGGER, SmeWithdrawPayload>;
    withdrawSuccess: import("typesafe-actions").PayloadActionCreator<SmeWithdrawActionConstants.WITHDRAW_SUCCESS, FrendsSmeWithdrawResponse>;
    withdrawError: import("typesafe-actions").PayloadActionCreator<SmeWithdrawActionConstants.WITHDRAW_ERROR, FrendsSmeWithdrawResponse>;
    withdrawReset: import("typesafe-actions").EmptyActionCreator<SmeWithdrawActionConstants.WITHDRAW_RESET>;
};
export type SmeWithdrawAction = ActionType<typeof smeWithdrawActions>;
