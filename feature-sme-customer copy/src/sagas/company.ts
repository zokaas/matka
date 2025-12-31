import { takeEvery, put, call, select } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";

import { E_CompanyActionConstants, T_FeatureCustomerReducerState } from "../types";
import { companyActions } from "../actions";
import { fetchCompanyData, updateCompanyInfo } from "../api";
import { updateOrCreateBankAccountNumber } from "../api/company";

export function* watchCompanyTrigger() {
    yield takeEvery(E_CompanyActionConstants.GET_COMPANY_INFO_TRIGGER, handleCompanyTrigger);
}

export function* watchUpdateCompanyInfoTrigger() {
    yield takeEvery(
        E_CompanyActionConstants.UPDATE_COMPANY_INFO_TRIGGER,
        handleCompanyInfoUpdateTrigger
    );
}

export function* watchUpdateBankAccountNumberTrigger() {
    yield takeEvery(
        E_CompanyActionConstants.UPDATE_BANK_ACCOUNT_NUMBER_TRIGGER,
        handleBankAccountUpdateTrigger
    );
}

export function* handleCompanyTrigger(
    action: ActionType<typeof companyActions.getCompanyInfoTrigger>
): Generator {
    try {
        const smeId = action.payload.smeId;
        const config: any = yield select((state: T_FeatureCustomerReducerState) => {
            return state.customer.engagement.config;
        });

        const { mock, token, gwUrl } = config;

        const companyInfo: any = yield call(fetchCompanyData, {
            mock,
            token,
            gwUrl,
            smeId,
        });
        if (companyInfo) {
            yield put(companyActions.getCompanyInfoSuccess(companyInfo));
        }
    } catch (e) {
        yield put(
            companyActions.getCompanyInfoError({
                message: "Engagement saga failed" + e,
            })
        );
    }
}

export function* handleCompanyInfoUpdateTrigger(
    action: ActionType<typeof companyActions.updateCompanyInfoTrigger>
): Generator {
    try {
        const config: any = yield select((state: T_FeatureCustomerReducerState) => {
            return state.customer.engagement.config;
        });
        const { token, gwUrl } = config;
        const { smeId, phone, email, streetAddress, zipCode, city } = action.payload;
        const updateCompanyPayload = {
            smeId,
            phone,
            email,
            streetAddress,
            zipCode,
            city,
            gwUrl,
            token,
        };

        const result = yield call(updateCompanyInfo, { ...updateCompanyPayload } as any);
        yield put(companyActions.updateCompanyInfoSuccess(action.payload));
    } catch (e) {
        throw new Error("Failed to update company info: " + e);
    }
}
export function* handleBankAccountUpdateTrigger(
    action: ActionType<typeof companyActions.updateBankAccountNumberTrigger>
): Generator {
    try {
        const config: any = yield select((state: T_FeatureCustomerReducerState) => {
            return state.customer.engagement.config;
        });
        const currentAccount: any = yield select((state: T_FeatureCustomerReducerState) => {
            return (
                state?.customer?.companyInfo?.accounts?.accounts?.[0]?.disbursementAccount
                    ?.externalAccountNumber ?? ""
            );
        });

        const { token, gwUrl } = config;
        const { accountId, number, type } = action.payload;
        const updateBankAccountPayload = {
            accountId,
            number,
            type,
            gwUrl,
            token,
            currentAccount,
        };

        const newAccountNumber = yield call(updateOrCreateBankAccountNumber, {
            ...updateBankAccountPayload,
        } as any);
        yield put(companyActions.updateBankAccountNumberSuccess(action.payload));
    } catch (e) {
        throw new Error("Failed to update company info: " + e);
    }
}
