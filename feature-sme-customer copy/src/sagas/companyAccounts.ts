import { takeEvery, put, call, select } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";

import { E_CompanyActionConstants, T_FeatureCustomerReducerState } from "../types";
import { companyActions } from "../actions";
import { fetchCompanyAccounts } from "../api";

export function* watchCompanyAccountsTrigger() {
    yield takeEvery(
        E_CompanyActionConstants.GET_COMPANY_ACCOUNTS_TRIGGER,
        handleCompanyAccountsTrigger
    );
}

export function* handleCompanyAccountsTrigger(
    action: ActionType<typeof companyActions.getCompanyAccountsTrigger>
): Generator {
    try {
        const smeId = action.payload.smeId;
        const config: any = yield select((state: T_FeatureCustomerReducerState) => {
            return state.customer.engagement.config;
        });

        const { mock, token, gwUrl } = config;

        const companyAccounts: any = yield call(fetchCompanyAccounts, {
            mock,
            token,
            gwUrl,
            smeId,
        });
        if (companyAccounts) {
            yield put(companyActions.getCompanyAccountsSuccess(companyAccounts));
        }
    } catch (e) {
        yield put(
            companyActions.getCompanyAccountsError({
                message: "Company accounts saga failed" + e,
            })
        );
    }
}
