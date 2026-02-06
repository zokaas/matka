import { take, put, call, select, takeLatest, race, all, delay } from "redux-saga/effects";

import { recentNewsActions } from "@opr-finance/feature-contentful";
import { errorActions } from "@opr-finance/feature-error";
import { smeLoanAccountActions } from "@opr-finance/feature-account";
import { smeWithdrawActions } from "@opr-finance/feature-withdraw";
import { companyActions, engagementActions } from "@opr-finance/feature-sme-customer";
import { history, createBffLogger } from "@opr-finance/utils";

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
import { restoreSession } from "./applicationPage";
import { kycActions, T_KycReducerState, T_KycState } from "@opr-finance/feature-kyc";
import { checkKycStatus, shouldShowKycModal } from "../utils";
import { DEFAULT_KYC_STATE } from "../constants/general";

export function* watchFrontPageTrigger() {
    yield takeLatest(AppActionConstants.FRONT_PAGE_TRIGGER, handleFrontPageTrigger);
}

export function* handleFrontPageTrigger() {
    const { mock, fullVpApiUrl, baseUrl, cid }: T_GatewayProps = getGwProps();
    const state: AppState = yield select((state: AppState) => state);

    const bffLogger = createBffLogger({
        baseUrl,
        context: {
            cid,
            ssn: state.session?.auth?.ssn,
            saga: AppActionConstants.FRONT_PAGE_TRIGGER,
        },
    });

    bffLogger.info("Front page trigger started");

    try {
        const { account, customer, session, kyc } = state;
        const accountConfigUrl = account.config.gwUrl;
        const companyConfigUrl = customer.companyInfo.config.gwUrl;
        const bffConfigUrl = kyc.config.bffUrl;
        const token = session.token;

        if (!token) {
            history.push(E_Routes.ROOT);
            return;
        }

        yield call(checkSession);
        yield call(restoreSession, token);
        yield put(engagementActions.engagementTrigger());

        const { engagementError, timeout } = yield race({
            engagementSuccess: take(engagementActions.engagementSuccess),
            engagementError: take(engagementActions.engagementError),
            timeout: delay(10000),
        });

        if (timeout) {
            bffLogger.error("Engagement timeout");
            history.push(E_Routes.ERROR);
            return;
        }

        if (engagementError) {
            bffLogger.error("Engagement error");
            history.push(E_Routes.ERROR);
            return;
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
            bffLogger.info("Company data initializer dispatched");

            const smeId: string = localStorage.getItem("smeId") || "";
            yield put(companyActions.getCompanyInfoTrigger({ smeId }));
            bffLogger.info("Company info trigger dispatched");

            const { companyError } = yield race({
                companySuccess: take(companyActions.getCompanyInfoSuccess),
                companyError: take(companyActions.getCompanyInfoError),
            });

            if (companyError) {
                bffLogger.error("Company data failed to load.");
                history.push(E_Routes.ERROR);
                return;
            }

            bffLogger.info("Company data loaded successfully");
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

        const { error } = yield race({
            success: take(recentNewsActions.fetchRecentNewsSuccess),
            error: take(recentNewsActions.fetchRecentNewsError),
        });

        if (error) {
            bffLogger.warn("Recent news failed, continuing");
        } else {
            bffLogger.info("Recent news fetched successfully");
        }

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

        const kycReducer: T_KycReducerState = yield select((state: AppState) => state.kyc);
        bffLogger.info("KYC state retrieved from Redux");

        let showKycModal = false;

        if (!kycReducer.returnedFromKyc) {
            const kycState: T_KycState = yield call(getKycState);
            yield put(kycActions.updateKycState(kycState));

            const updatedKyc: T_KycReducerState = yield select((state: AppState) => state.kyc);
            const kycStatusResult = checkKycStatus(updatedKyc);
            showKycModal = shouldShowKycModal(kycStatusResult);
        }

        yield put(appActions.frontPageSuccess());
        bffLogger.info("Front page loaded successfully");

        if (showKycModal) {
            yield put(kycActions.showModal());
        }
    } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));

        bffLogger.error("Frontpage load failed", {
            errorMessage: error.message,
            stack: error.stack,
        });

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

    const kyc = company?.dynamicFields?.kyc;

    if (!kyc) {
        return DEFAULT_KYC_STATE;
    }

    const kycStatus: T_KycState = yield select((state: AppState) => state.kyc.kycStatus);

    const kycState: T_KycState = {
        ...kycStatus,
        kycDone: Boolean(kyc.kycDone),
        kycUpdatedDate: kyc.kycUpdatedDate ?? "",
        kycDueDate: kyc.kycDueDate || process.env.REACT_APP_KYC_DEADLINE_DATE || "",
    };

    return kycState;
}
