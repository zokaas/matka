import { takeEvery, put, call, select, take } from "redux-saga/effects";
import { E_KycActionConstants, kycFlow } from "../types";
import { kycActions } from "../actions";
import { ActionType } from "typesafe-actions";
import { triggerCreditSafeReport } from "../api";
import { companyActions, T_FeatureCustomerReducerState } from "@opr-finance/feature-sme-customer";
import { T_CompanyApiResponse } from "@opr-finance/feature-sme-customer/src/types";
import { T_LoginSessionReducerState } from "@opr-finance/feature-login-session";

export function* watchKycTrigger() {
    yield takeEvery(E_KycActionConstants.KYC_FETCH_CREDIT_SAFE_REPORT_TRIGGER, handleKycTrigger);
}

export function* watchKycStartFlowTrigger() {
    yield takeEvery(E_KycActionConstants.KYC_START_FLOW_TRIGGER, handleKycStartFlow);
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

export function* handleKycStartFlow(
    action: ActionType<typeof kycActions.kycStartFlowTrigger>
): Generator<any, void, any> {
    try {
        console.log("handleKycStartFlow", action.payload);
        const { applicationId, smeId, companyId, flow } = action.payload;

        let company: T_CompanyApiResponse;

        if (flow === kycFlow.EXISTING_CUSTOMER) {
            const config = yield select((state: any) => state.kyc.config);
            const { mock, token, bffUrl, cid } = config;

            yield call(triggerCreditSafeReport, {
                token,
                gwUrl: bffUrl,
                mockApiCalls: mock,
                applicationId,
                smeId,
                companyId,
                cid,
            });

            yield put(companyActions.getCompanyInfoTrigger({ smeId }));
            yield take(companyActions.getCompanyInfoSuccess);

            company = yield select(
                (state: T_FeatureCustomerReducerState) => state.customer.companyInfo.info
            );
            console.log("[KYC] Company refreshed, industryCode:", company.dynamicFields?.kyc?.industryCode);
        } else {

            company = yield select(
                (state: T_FeatureCustomerReducerState) => state.customer.companyInfo.info
            );
        }

        const session: T_LoginSessionReducerState = yield select((state: any) => state.session);

        const companyData = {
            orgNumber: company.organizationNumber ?? "",
            companyName: company.companyName ?? "",
            sniCode: company.dynamicFields?.kyc?.industryCode ?? "",
        };
        yield call(initiateKycRedirect, companyData, session, flow, applicationId);

        yield put(kycActions.kycStartFlowSuccess());
    } catch (e) {
        console.log("[KYC] Start flow failed", e);
    }
}

function* initiateKycRedirect(
    company: { orgNumber: string; companyName: string; sniCode: string },
    session: T_LoginSessionReducerState,
    flow: string,
    applicationId: string
): Generator<any, void, any> {
    const { exp, sessionRefreshCount, maxSessionRefresh, gtm_userId, auth } = session;
    const clientId = process.env.REACT_APP_CLIENT_ID as string;
    const sessionId = localStorage.getItem("token") ?? "";
    const bffUrl = process.env.REACT_APP_BFF_URL as string;
    const kycFormBaseUrl = process.env.REACT_APP_KYC_FORM_URL as string;

    const kycParams = {
        applicationId,
        clientId,
        kycType: "onboarding",
        kycFlow: flow,
        company,
        session: {
            kcUserId: gtm_userId,
            sessionId,
            exp: exp * 1000,
            sessionRefreshCount,
            maxSessionRefresh,
        },
        auth,
    };

    const response: Response = yield call(fetch, `${bffUrl}/cache/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kycParams),
    });

    const result: { redisKey: string } = yield call([response, "json"]);
    const kycCacheId = result.redisKey;

    if (!kycCacheId) {
        throw new Error("Failed to save KYC data, no cache id");
    }

    console.log("[KYC] Cache saved, redirecting...", kycCacheId);

    sessionStorage.clear();

    const kycServiceUrl = new URL(kycFormBaseUrl);
    kycServiceUrl.searchParams.set("key", kycCacheId);
    window.location.href = kycServiceUrl.toString();
}