import { ActionType } from "typesafe-actions";
import { companyActions } from "../actions";
export declare function watchCompanyBoardMembersTrigger(): Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>;
export declare function handleCompanyBoardMembersTrigger(action: ActionType<typeof companyActions.getCompanyBoardMembersTrigger>): Generator;
