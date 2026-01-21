import { E_KycActionConstants } from "../types";
import { kycActions } from "../actions";
import { ActionType } from "typesafe-actions";
export declare function watchKycTrigger(): Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>;
export declare function watchKycStartFlowTrigger(): Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>;
export declare function handleKycTrigger(action: ActionType<typeof kycActions.kycFetchCreditSafeReportTrigger>): Generator<import("redux-saga/effects").SelectEffect | import("redux-saga/effects").CallEffect<string> | import("redux-saga/effects").PutEffect<import("typesafe-actions").PayloadAction<import("@opr-finance/feature-sme-customer/src/types").E_CompanyActionConstants.GET_COMPANY_INFO_TRIGGER, {
    smeId: string;
}>> | import("redux-saga/effects").TakeEffect | import("redux-saga/effects").PutEffect<import("typesafe-actions").PayloadAction<E_KycActionConstants.KYC_FETCH_CREDIT_SAFE_REPORT_SUCCESS, import("../types").T_KycCreditSafeReportPayload>>, void, any>;
export declare function handleKycStartFlow(action: ActionType<typeof kycActions.kycStartFlowTrigger>): Generator<any, void, any>;
