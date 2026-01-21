import { ActionType } from "typesafe-actions";
import { put, call, take, select, race, takeLeading } from "redux-saga/effects";

import { errorActions } from "@opr-finance/feature-error";
import {
    applicationActions,
    companyActions,
    engagementActions,
} from "@opr-finance/feature-sme-customer";
import { loginSessionActions } from "@opr-finance/feature-login-session";

import { AppActionConstants, appActions } from "../actions/actions";
import { loginSessionFeatureInitializer } from "./common.saga";
import { getApplicantSsnFromApplication, history, mapCompanyDataForKyc, startKyc } from "../utils";
import { AppState, E_Routes } from "../types/general";
import { T_GatewayProps } from "@opr-finance/utils/src/types/general";
import { getGwProps } from "@opr-finance/utils/src/getGwProps";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";
import {
    T_ApplicationApiResponse,
    T_ApplicationReducerState,
    T_CompanyApiResponse,
    T_SMEApplicationChannel,
    T_SMEApplicationState,
} from "@opr-finance/feature-sme-customer/src/types";
import { kycFlow, T_CompanyKycParams } from "../types/kyc";
import { allowedStatesByChannel, oprFinanceBrokerName } from "../constants/general";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

const { fullVpApiUrl, mock }: T_GatewayProps = getGwProps();

function navigateNoLoan() {
    console.log("navigate to no loan");
    history.push(E_Routes.NO_LOAN);
}

class StopApplicationFlow extends Error {}

/**
 * Handle the flow when there is an existing applicationId in sessionStorage
 */
function* handleApplicationFlow(token: string) {
    try {
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

        logger.log("Fetched application; validating application state");
        const application: T_ApplicationApiResponse = yield select(
            (state: AppState) => state.customer.application.application
        );

        const brokerName = application.brokerName;
        const { applicationChannel, applicationState } = application ?? {};

        //TODO refactor application state and channel check if no other than BROKER applicationChannels will be handled
        // Stop flow if state is invalid
        yield call(checkApplicationState, applicationChannel, applicationState);

        logger.log("Checking if applicant's ssn matches login ssn");
        // Stop flow if SSN doesn't match
        yield call(checkApplicantSsn);

        logger.log("Checking application channel");

        if (applicationChannel === "BROKER" && brokerName !== oprFinanceBrokerName) {
            yield call(handleBrokerApplicationKyc);
            return;
        }

        // OPR Finance as a broker and other then brokers (if exist)-> lead to application UI
        history.push(E_Routes.APPLICATION);
    } catch (error) {
        if (error instanceof StopApplicationFlow) {
            return; // stop everything
        }
        throw error;
    }
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

function* handleBrokerApplicationKyc() {
    logger.log("Application channel is BROKER — preparing company info");

    const newCustomerKycFlow = kycFlow.NEW_CUSTOMER;
    const session = yield select((state: AppState) => state.session);
    const [companySuccess, companyError] = yield race([
        take(companyActions.getCompanyInfoSuccess),
        take(companyActions.getCompanyInfoError),
    ]);

    if (companyError) {
        logger.log("Error fetching company info in sagas", companyError);
        history.push(E_Routes.ERROR);
        throw new StopApplicationFlow(); // stop parent saga
    }

    const company: T_CompanyApiResponse = yield select(
        (state: AppState) => state.customer.companyInfo.info
    );
    const { organizationNumber, companyName, dynamicFields } = company;
    const applicationId = sessionStorage.getItem("applicationId") ?? "";

    if (!organizationNumber || !companyName || !applicationId) {
        logger.error("Missing parameters needed for KYC redirect", {
            organizationNumber,
            companyName,
            applicationId
        });
        history.push(E_Routes.ERROR);
        throw new StopApplicationFlow(); // stop parent saga
    }

    const { industryCode } = dynamicFields?.kyc || "";

    const companyData: T_CompanyKycParams = mapCompanyDataForKyc({
        organizationNumber,
        companyName,
        industryCode,
    });

    // initiate KYC with session
    yield call(startKyc, companyData, session, applicationId, newCustomerKycFlow);
}

function* checkApplicationState(
    applicationChannel?: T_SMEApplicationChannel,
    applicationState?: T_SMEApplicationState
) {
    if (!applicationChannel || !applicationState) return;
    const allowedStates = allowedStatesByChannel[applicationChannel];
    //if broker application is any other than pn_created -> no loan
    //if application is any other than pending/pn_created -> no loan
    logger.log("applicationChannel: ", applicationChannel, "applicationState:", applicationState);
    logger.log("allowedStates", allowedStates);
    if (allowedStates && !allowedStates.includes(applicationState)) {
        yield call(navigateNoLoan);
        throw new StopApplicationFlow(); // stop parent saga
    }
}

function* checkApplicantSsn() {
    const application: T_ApplicationReducerState = yield select(
        (state: AppState) => state.customer.application
    );
    const applicantSsn: string | undefined = getApplicantSsnFromApplication(application);
    if (!applicantSsn) {
        logger.log("applicant has no ssn");
        yield call(navigateNoLoan);
        throw new StopApplicationFlow(); // stop parent saga
    }

    const session = yield select((state: AppState) => state.session);
    const { ssn } = session ?? {};
    if (ssn !== applicantSsn) {
        logger.log("SSNs don't match");
        yield call(navigateNoLoan);
        throw new StopApplicationFlow(); // stop parent saga
    }
}
