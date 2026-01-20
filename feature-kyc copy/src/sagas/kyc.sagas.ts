import { takeEvery, put, call, select, take } from "redux-saga/effects";
import { E_KycActionConstants } from "../types";
import { kycActions } from "../actions";
import { ActionType } from "typesafe-actions";
import { triggerCreditSafeReport } from "../api";
import { companyActions, T_FeatureCustomerReducerState } from "@opr-finance/feature-sme-customer";
import { T_CompanyApiResponse } from "@opr-finance/feature-sme-customer/src/types";

export function* watchKycTrigger() {
    yield takeEvery(E_KycActionConstants.KYC_FETCH_CREDIT_SAFE_REPORT_TRIGGER, handleKycTrigger);
}

export function* handleKycTrigger(
    action: ActionType<typeof kycActions.kycFetchCreditSafeReportTrigger>
) {
    try {
        console.log("handleKycTrigger", action.payload);
        const smeId = action.payload.smeId;
        const config: any = yield select((state) => {
            return state.kyc.config;
        });

        const { mock, token, bffUrl, cid } = config;
        yield call(triggerCreditSafeReport, {
            token,
            gwUrl: bffUrl,
            mockApiCalls: mock,
            ...action.payload,
            cid,
        });
        console.log("fetched creditsafe report, update company info");
        yield put(companyActions.getCompanyInfoTrigger({ smeId }));
        yield take(companyActions.getCompanyInfoSuccess);

        const company: T_CompanyApiResponse = yield select(
            (state: T_FeatureCustomerReducerState) => state.customer.companyInfo.info
        );
        console.log("company updated: dynamicFields: ", company.dynamicFields);

        console.log("[KYC] CreditSafeReport success");
        yield put(kycActions.kycFetchCreditSafeReportSuccess({ isCsReportReady: true }));
    } catch (e) {
        console.log("action trigger failed", e);
    }
}
