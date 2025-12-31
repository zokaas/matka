import { call, put, select, takeEvery } from "redux-saga/effects";
import {
    E_ApplicationActionConstants,
    T_ApplicationApiResponse,
    T_ApplicationRequest,
    T_Config,
    T_FeatureCustomerReducerState,
} from "../types";
import { fetchSmeApplication } from "../api";
import { applicationActions, companyActions } from "../actions";

export function* watchSmeApplicationTrigger() {
    yield takeEvery(E_ApplicationActionConstants.GET_APPLICATION_TRIGGER, handleApplicationTrigger);
}

export function* handleApplicationTrigger() {
    try {
        const config: T_Config = yield select((state: T_FeatureCustomerReducerState) => {
            return state.customer.application.config;
        });

        const { mock, token, gwUrl } = config;
        const appId = sessionStorage.getItem("applicationId") || "";
        if (!appId)
            yield put(applicationActions.applicationError({ message: "Application id not found" }));
        const data: T_ApplicationRequest = {
            mock,
            token,
            gwUrl,
            appId,
        };
        const application = (yield call(fetchSmeApplication, data)) as T_ApplicationApiResponse;

        if (application) {
            const { smeId } = application;
            yield put(companyActions.getCompanyInfoTrigger({ smeId }));
            yield put(applicationActions.applicationSuccess(application));
        }
    } catch (e) {
        yield put(applicationActions.applicationError({ message: "Application saga failed" + e }));
    }
}
