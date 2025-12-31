import { ActionType } from "typesafe-actions";
import { companyActions } from "../actions";
export declare function watchCompanyAccountsTrigger(): Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>;
export declare function handleCompanyAccountsTrigger(action: ActionType<typeof companyActions.getCompanyAccountsTrigger>): Generator;
