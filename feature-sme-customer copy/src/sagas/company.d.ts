import { ActionType } from "typesafe-actions";
import { companyActions } from "../actions";
export declare function watchCompanyTrigger(): Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>;
export declare function watchUpdateCompanyInfoTrigger(): Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>;
export declare function watchUpdateBankAccountNumberTrigger(): Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>;
export declare function handleCompanyTrigger(action: ActionType<typeof companyActions.getCompanyInfoTrigger>): Generator;
export declare function handleCompanyInfoUpdateTrigger(action: ActionType<typeof companyActions.updateCompanyInfoTrigger>): Generator;
export declare function handleBankAccountUpdateTrigger(action: ActionType<typeof companyActions.updateBankAccountNumberTrigger>): Generator;
