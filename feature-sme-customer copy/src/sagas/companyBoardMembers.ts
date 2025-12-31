import { takeEvery, put, call, select } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";

import { E_CompanyActionConstants, T_FeatureCustomerReducerState } from "../types";
import { companyActions } from "../actions";
import { fetchCompanyBoardMembers } from "../api";

export function* watchCompanyBoardMembersTrigger() {
    yield takeEvery(
        E_CompanyActionConstants.GET_COMPANY_BOARD_MEMBERS_TRIGGER,
        handleCompanyBoardMembersTrigger
    );
}

export function* handleCompanyBoardMembersTrigger(
    action: ActionType<typeof companyActions.getCompanyBoardMembersTrigger>
): Generator {
    try {
        const smeId = action.payload.smeId;
        const config: any = yield select((state: T_FeatureCustomerReducerState) => {
            return state.customer.engagement.config;
        });

        const { mock, token, gwUrl } = config;

        const companyBoardMembers: any = yield call(fetchCompanyBoardMembers, {
            mock,
            token,
            gwUrl,
            smeId,
        });

        if (companyBoardMembers) {
            yield put(companyActions.getCompanyBoardMembersSuccess(companyBoardMembers));
        }
    } catch (e) {
        yield put(
            companyActions.getCompanyBoardMembersError({
                message: "Board members saga failed" + e,
            })
        );
    }
}
