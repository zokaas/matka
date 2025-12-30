import { takeEvery, put, call, select, takeLatest, race, take } from "redux-saga/effects";

import { errorActions } from "@opr-finance/feature-error";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { AppActionConstants, appActions } from "../actions/actions";
import { getAccountData, getCompanyData, setAccountConfig } from "./common.saga";
import { ActionType } from "typesafe-actions";
import { companyActions, engagementActions } from "@opr-finance/feature-sme-customer";
import { AppState } from "../types/general";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export function* watchUserPageTrigger() {
    yield takeLatest(AppActionConstants.USER_PAGE_TRIGGER, handleUserPageTrigger);
}
export function* watchUserInfoUpdateTrigger() {
    yield takeLatest(AppActionConstants.USER_INFO_UPDATE_TRIGGER, handleUserInfoUpdateTrigger);
}

export function* handleUserPageTrigger() {
    const engagements = yield select((state: AppState) => state.customer.engagement.engagements);
    try {
        yield put(engagementActions.engagementTrigger());

        const { engagementSuccess, engagementError } = yield race({
            engagementSuccess: take(engagementActions.engagementSuccess),
            engagementError: take(engagementActions.engagementError),
        });

        if (engagementError) {
            logger.log("error getting engagements");
            window.location.href = "/error";
        }

        yield call(setAccountConfig);
        yield call(getAccountData);
        const companyInfo = yield select((state: AppState) => state.customer.companyInfo);
        const smeId = yield select((state: AppState) => state.customer.engagement.activeSmeId);

        if (!companyInfo.id) {
            yield call(getCompanyData, smeId);
        }

        yield put(appActions.userPageSuccess());
    } catch (e) {
        yield put(
            errorActions.errorTrigger({ message: "contact page load failed" + e, url: "/error" })
        );
    }
}

export function* handleUserInfoUpdateTrigger(
    action: ActionType<typeof appActions.userInfoUpdateTrigger>
) {
    try {
        const { customer } = yield select((state: AppState) => state);
        const { smeId, phone, email, streetAddress, zipCode, city } = action.payload;
        const companyInfoUpdatePayload = {
            smeId,
            phone,
            email,
            streetAddress,
            zipCode,
            city,
        };

        const oldData = {
            phone: customer.companyInfo.info.phone,
            email: customer.companyInfo.info.email,
            streetAddress: customer.companyInfo.info.officialAddress.streetAddress,
            zipCode: customer.companyInfo.info.officialAddress.zipCode,
            city: customer.companyInfo.info.officialAddress.city,
        };
        const newData = { phone, email, streetAddress, zipCode, city };

        if (JSON.stringify(newData) !== JSON.stringify(oldData)) {
            yield put(companyActions.updateCompanyInfoTrigger(companyInfoUpdatePayload));
        }
    } catch (e) {
        throw new Error("User info update failed: " + e);
    }
}
