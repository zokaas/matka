import { take, put, call, select, takeLatest, race, all } from "redux-saga/effects";

import { recentNewsActions } from "@opr-finance/feature-contentful";
import { errorActions } from "@opr-finance/feature-error";
import { smeLoanAccountActions } from "@opr-finance/feature-account";
import { smeWithdrawActions } from "@opr-finance/feature-withdraw";
import { companyActions, engagementActions } from "@opr-finance/feature-sme-customer";
import { history } from "@opr-finance/utils";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { AppState, E_Routes } from "../types/general";
import {
    checkSession,
    getAccountData,
    getInvoiceData,
    getTransactionsData,
    setInvoiceConfig,
    setTransactionsConfig,
} from "./common.saga";
import { AppActionConstants, appActions } from "../actions/actions";
import { T_GatewayProps } from "@opr-finance/utils/src/types/general";
import { getGwProps } from "@opr-finance/utils/src/getGwProps";
import { loginSessionActions } from "@opr-finance/feature-login-session";
import { T_CompanyApiResponse } from "@opr-finance/feature-sme-customer/src/types";
import { DEFAULT_KYC_STATE } from "../constants/general";
import { restoreSession } from "./applicationPage";
import { kycActions, T_KycState } from "@opr-finance/feature-kyc";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export function* watchFrontPageTrigger() {
    yield takeLatest(AppActionConstants.FRONT_PAGE_TRIGGER, handleFrontPageTrigger);
}

export function* handleFrontPageTrigger() {
    const { mock, fullVpApiUrl, baseUrl, cid }: T_GatewayProps = getGwProps();

    try {
        const state: AppState = yield select((state: AppState) => state);
        const { account, customer, session, kyc } = state;
        const accountConfigUrl = account.config.gwUrl;
        const companyConfigUrl = customer.companyInfo.config.gwUrl;
        const bffConfigUrl = kyc.config.bffUrl;
        const token = session.token;

        if (token) {
            yield call(checkSession);
            yield call(restoreSession, token);
            yield put(engagementActions.engagementTrigger());

            const { engagementSuccess, engagementError } = yield race({
                engagementSuccess: take(engagementActions.engagementSuccess),
                engagementError: take(engagementActions.engagementError),
            });

            if (engagementError) {
                logger.log("error getting engagements");
                window.location.href = "/error";
            }

            if (!accountConfigUrl) {
                yield put(
                    smeLoanAccountActions.accountInitializer({
                        mockApiCalls: mock,
                        gwUrl: fullVpApiUrl,
                        token,
                        errorUrl: E_Routes.ERROR,
                        noAuth: E_Routes.EXPIRED,
                        noLoanUrl: E_Routes.NO_LOAN,
                    })
                );
            }

            if (!bffConfigUrl) {
                console.log("kycInitializer: cid", cid);
                yield put(
                    kycActions.kycInitializer({
                        token,
                        bffUrl: baseUrl,
                        mock,
                        cid,
                    })
                );
            }

            if (!companyConfigUrl) {
                yield put(
                    companyActions.companyDataInitializer({
                        token,
                        gwUrl: fullVpApiUrl,
                        mock: mock,
                    })
                );
            }

            yield put(
                recentNewsActions.fetchRecentNewsTrigger({
                    clientParams: {
                        space: process.env.REACT_APP_CONTENTFUL_SPACE as string,
                        accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN as string,
                    },
                    contentParams: {
                        select: "fields,sys.createdAt",
                        content_type: "recentNews",
                        "fields.language[in]": "sv",
                        "fields.application[in]": "Flex Online Sweden",
                    },
                })
            );
            yield take(recentNewsActions.fetchRecentNewsSuccess);

            yield call(getAccountData);

            yield call(setInvoiceConfig);
            yield call(setTransactionsConfig);

            yield put(
                smeWithdrawActions.withdrawInitializer({
                    mockApiCalls: mock,
                    gwUrl: fullVpApiUrl,
                    token,
                })
            );
            yield put(loginSessionActions.loginSessionVerify());

            yield all([call(getInvoiceData), call(getTransactionsData)]);

            const kyc: T_KycState = yield select((state: AppState) => state.kyc.kycStatus);

            // Update SME kyc status from dynamic fields
            if (!kyc.kycDone) {
                const kycState: T_KycState = yield call(getKycState);
                logger.log("KYC state", kycState);
                yield put(kycActions.updateKycState(kycState));
            }

            yield put(appActions.frontPageSuccess());
        }
    } catch (e) {
        history.push(E_Routes.ERROR);
        yield put(
            errorActions.errorTrigger({ message: "frontpage load failed" + e, url: "/error" })
        );
    }
}

function* getKycState() {
    const company: T_CompanyApiResponse = yield select(
        (state: AppState) => state.customer.companyInfo.info
    );

    const kyc = company.dynamicFields?.kyc;

    const kycStatus = yield select((state: AppState) => state.kyc.kycStatus);

    if (!kyc) {
        logger.warn("No KYC dynamic fields found");
        return DEFAULT_KYC_STATE;
    }

    logger.log("kyc found in application Dynamic Fields : ", kyc);
    const kycState = {
        ...kycStatus,
        kycDone: Boolean(kyc.kycDone),
        kycUpdatedDate: kyc.kycUpdatedDate ?? "",
        kycDueDate: kyc.kycDueDate ?? "",
    };

    logger.log("KYC from application", kycState);
    return kycState;
}
