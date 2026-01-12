import { put, call, take, select, race, takeLeading } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";

import { errorActions } from "@opr-finance/feature-error";
import {
    applicationActions,
    companyActions,
    engagementActions,
} from "@opr-finance/feature-sme-customer";
import { loginSessionActions } from "@opr-finance/feature-login-session";

import { AppActionConstants, appActions } from "../actions/actions";
import { loginSessionFeatureInitializer, saveLoginSession } from "./common.saga";
import { getApplicantSsnFromApplication, history, mapCompanyDataForKyc, startKyc } from "../utils";
import { AppState, E_ApplicationChannel, E_Routes } from "../types/general";
import { T_GatewayProps } from "@opr-finance/utils/src/types/general";
import { getGwProps } from "@opr-finance/utils/src/getGwProps";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";
import { T_ApplicationReducerState } from "@opr-finance/feature-sme-customer/src/types";
import { T_CompanyKycParams } from "../types/kyc";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

const { fullVpApiUrl, mock }: T_GatewayProps = getGwProps();

function navigateNoLoan() {
    history.push(E_Routes.NO_LOAN);
}

/**
 * Handle the flow when there is an existing applicationId in sessionStorage
 */
function* handleApplicationFlow(token: string) {
    logger.log("Detected applicationId in sessionStorage — initializing application");

    yield put(
        applicationActions.applicationInitializer({
            mock,
            gwUrl: fullVpApiUrl,
            token,
        })
    );

    yield put(applicationActions.applicationTrigger());

    const [applicationSuccess, applicationError] = yield race([
        take(applicationActions.applicationSuccess),
        take(applicationActions.applicationError),
    ]);

    if (applicationError) {
        logger.log("Error fetching application in sagas", applicationError);
        history.push(E_Routes.ERROR);
        return;
    }

    logger.log("Fetched application; checking if applicant's ssn matches login ssn");

    const application: T_ApplicationReducerState = yield select(
        (state: AppState) => state.customer.application
    );

    const applicantSsn: string | undefined = getApplicantSsnFromApplication(application);
    if (!applicantSsn) {
        logger.log("applicant has no ssn");
        yield call(navigateNoLoan);
        return;
    }

    const session = yield select((state: AppState) => state.session);
    const { ssn } = session ?? {};
    if (ssn !== applicantSsn) {
        logger.log("SSNs don't match");
        yield call(navigateNoLoan);
        return;
    }

    logger.log("Checking application channel");
    const applicationChannel = application.application?.applicationChannel;

    if (applicationChannel === E_ApplicationChannel.BROKER) {
        logger.log("Application channel is BROKER — preparing company info");

        const application = yield select(
            (state: AppState) => state.customer.application.application
        );
        const [companySuccess, companyError] = yield race([
            take(companyActions.getCompanyInfoSuccess),
            take(companyActions.getCompanyInfoError),
        ]);

        if (companyError) {
            logger.log("Error fetching company info in sagas", companyError);
            history.push(E_Routes.ERROR);
            return;
        }

        const { industryCode } = application.dynamicFields?.kyc || "";

        const company = yield select((state: AppState) => state.customer.companyInfo.info);
        const { organizationNumber, companyName } = company;

        if (!organizationNumber || !companyName) {
            logger.error("Missing org number or company name needed for KYC redirect", {
                organizationNumber,
                companyName,
            });
            history.push(E_Routes.ERROR);
            return;
        }

        const companyData: T_CompanyKycParams = mapCompanyDataForKyc({
            organizationNumber,
            companyName,
            industryCode,
        });

        // initiate KYC with session
        yield call(startKyc, companyData, session);
        return;
    }

    // Non-broker case -> lead to application UI
    history.push(E_Routes.APPLICATION);
}

/**
 * Handle the engagement flow when there is NO applicationId
 */
function* handleEngagementFlow(token: string, role: string, ssn: string) {
    logger.log("No applicationId — initializing engagement flow");

    yield put(
        engagementActions.engagementInitializer({
            mock,
            gwUrl: fullVpApiUrl,
            token,
            role,
            reference: ssn,
        })
    );

    yield put(engagementActions.engagementTrigger());

    const [engagementSuccess, engagementError] = yield race([
        take(engagementActions.engagementSuccess),
        take(engagementActions.engagementError),
    ]);

    if (engagementError) {
        logger.log("Engagement fetch error; routing to NO_LOAN");
        yield call(navigateNoLoan);
        return;
    }

    const engagements = yield select((state: AppState) => state.customer.engagement.engagements);

    if (!engagements || engagements.length === 0) {
        yield call(navigateNoLoan);
        return;
    }

    if (engagements.length > 1) {
        history.push(E_Routes.CHOOSE_ACCOUNT);
        return;
    }

    const single = engagements[0];
    yield put(engagementActions.saveSmeIdSuccess(single.smeId));
    localStorage.setItem("smeId", single.smeId);
    history.push(E_Routes.FRONT);
}

export function* watchLoginTrigger() {
    yield takeLeading(AppActionConstants.LOGIN_PAGE_TRIGGER, handleLoginTrigger);
}

export function* handleLoginTrigger(action: ActionType<typeof appActions.loginPageTrigger>) {
    try {
        yield call(loginSessionFeatureInitializer);
        yield put(loginSessionActions.loginSessionComplete());
        yield take(loginSessionActions.loginSessionTokenSuccess);

        const { token, role, ssn } = yield select((state: AppState) => state.session);

        const applicationId = sessionStorage.getItem("applicationId");

        if (applicationId) {
            // Kyc onboarding flow
            yield call(handleApplicationFlow, token);
        } else {
            // flex-online flow
            yield call(handleEngagementFlow, token, role, ssn);
        }

        yield put(appActions.loginPageSuccess());
    } catch (e) {
        yield put(errorActions.errorTrigger({ message: "login failed" + e, url: "/error" }));
    }
}
