import { put, take, select, race, all, call } from "redux-saga/effects";
import { format, subMonths } from "date-fns";
import * as VP from "@opr-finance/api-definitions";
import { loginSessionActions, T_LoginRoles } from "@opr-finance/feature-login-session";
import {
    companyActions,
    engagementActions,
    T_SmeCompanyAccounts,
} from "@opr-finance/feature-sme-customer";
import { translationStatiContentActions } from "@opr-finance/feature-contentful";
import { smeLoanAccountActions, E_AllowedAccountStates } from "@opr-finance/feature-account";
import { errorActions } from "@opr-finance/feature-error";
import { smeDocumentActions } from "@opr-finance/feature-document";
import { E_CurrencyCountry } from "@opr-finance/component-currency";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { AppState, E_Routes } from "../types/general";
import { history } from "../utils";
import { invoicesActions } from "@opr-finance/feature-statements";
import { smeTransactionsActions } from "@opr-finance/feature-transactions-v2";
import { initialFetchingTransactionsPeriod } from "../constants/general";
import { reportingActions } from "@opr-finance/feature-reporting";
import { getGwProps } from "@opr-finance/utils/src/getGwProps";
import { T_GatewayProps } from "@opr-finance/utils/src/types/general";

const {
    mock,
    baseUrl,
    fullVpApiUrl,
    fullVpV2ApiUrl,
    fullAuthUrl,
    redirectAuthPath,
    cid,
    lang,
}: T_GatewayProps = getGwProps();

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export function* loginSessionFeatureInitializer() {
    try {
        const verifyUrl: string = `${redirectAuthPath}/verify/${cid}`;
        const expiredUrl: string = "/expired";
        const errorUrl: string = "/error";
        const endSessionApiUrl: string = `${redirectAuthPath}/logout/${cid}`;
        const getSessionInfoUrl = `${redirectAuthPath}/userinfo/${cid}`;
        const logoutUrl = "/logout";
        const refreshSessionUrl = `${baseUrl}/refresh/${cid}`;

        yield put(
            loginSessionActions.loginSessionInitializer({
                authUrl: fullAuthUrl,
                cid,
                lang,
                verifyUrl,
                expiredUrl,
                errorUrl,
                endSessionApiUrl,
                getSessionInfoUrl,
                logoutUrl,
                refreshSessionUrl,
            })
        );
    } catch (e) {
        logger.log("fetch login page trigger failed");
    }
}

export function* getTranslations() {
    const messages = yield select((state: AppState) => state.translation.messages);
    try {
        if (!messages) {
            yield put(
                translationStatiContentActions.fetchTranslationStaticContentTrigger({
                    clientParams: {
                        space: process.env.REACT_APP_CONTENTFUL_SPACE as string,
                        accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN as string,
                    },
                    contentParams: {
                        content_type: "staticContent",
                        "fields.slug[in]":
                            "flex-online-sweden-user-page,flex-online-sweden-topup-page,flex-online-sweden-error-page,flex-online-sweden-start-page,flex-online-sweden-footer,flex-online-sweden-header,flex-online-sweden-account-list-page,flex-online-sweden-contact-page,flex-online-sweden-expired-page,flex-online-sweden-front-page,flex-online-sweden-logout-page,flex-online-sweden-no-loan-page,flex-online-sweden-loan-page,flex-online-sweden-eligible-to-topup-page,flex-online-sweden-generic-table,flex-online-sweden-session-modal",
                    },
                })
            );

            yield take(translationStatiContentActions.fetchTranslationStaticContentSuccess);
        }
    } catch (e) {
        yield put(
            errorActions.errorTrigger({
                message: "Loading translations failed" + e,
                url: E_Routes.ERROR,
            })
        );
    }
}

export function* saveLoginSession() {
    const sessionToken = yield select((state: AppState) => state.session.token);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as T_LoginRoles;
    const ssn = localStorage.getItem("reference") || "";

    if (!sessionToken && token) {
        const authenticated = true;
        yield put(
            loginSessionActions.loginSessionTokenSuccess({ token, authenticated, role, ssn })
        );
        yield put(loginSessionActions.loginSessionVerify());
        yield put(
            engagementActions.engagementInitializer({
                mock,
                gwUrl: fullVpApiUrl,
                token,
                role,
                reference: ssn,
            })
        );
    } else if (!sessionToken && !token) {
        window.location.href = E_Routes.ROOT;
    }
}

export function* setAccountConfig() {
    const accountConfigUrl = yield select((state: AppState) => state.account.config.gwUrl);
    const token = yield select((state: AppState) => state.session.token);
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
}
export function* setInvoiceConfig() {
    const activeAccountId = (yield select(
        (state: AppState) => state.account.activeAccountId
    )) as string;
    const invoiceConfigUrl = yield select((state: AppState) => state.invoices.config.gwUrl);
    const token = yield select((state: AppState) => state.session.token);

    if (!invoiceConfigUrl) {
        yield put(
            invoicesActions.fetchInvoicesInitializer({
                mockApiCalls: mock,
                gwUrl: fullVpApiUrl,
                token,
                activeAccountId,
                currencyCountry: E_CurrencyCountry.Sweden,
            })
        );
    }
}

export function* setTransactionsConfig() {
    const activeAccountId = (yield select(
        (state: AppState) => state.account.activeAccountId
    )) as string;
    const transationsConfigUrl = yield select((state: AppState) => state.transactions.config.gwUrl);
    const token = yield select((state: AppState) => state.session.token);

    if (!transationsConfigUrl) {
        yield put(
            smeTransactionsActions.smeFetchTransactionsInitializer({
                mockApiCalls: mock,
                gwUrl: fullVpApiUrl,
                gwUrlV2: fullVpV2ApiUrl,
                token,
                accountId: activeAccountId,
                size: 20,
                //shownInStatement: true,
                excludeTransactionTypes: "ReservedTrancheTransaction,StatementRoundingTransaction",
                country: "Sweden",
            })
        );
    }
}

export function* setReportingConfig() {
    const { accountNumber } = yield select((state: AppState) => state.account.account);
    const reportingConfigUrl = yield select((state: AppState) => state.reporting.config.gwUrl);
    const { cid } = yield select((state: AppState) => state.session.config);
    const token = yield select((state: AppState) => state.session.token);

    if (!reportingConfigUrl) {
        yield put(
            reportingActions.reportingInitializer({
                mockApiCalls: mock,
                gwUrl: baseUrl,
                token,
                accountNumber,
                cid,
                country: "Sweden",
            })
        );
    }
}

export function* getCompanyData(smeId: string) {
    const companyInfo = yield select((state: AppState) => state.customer.companyInfo);
    if (!(companyInfo.info && companyInfo.accounts && companyInfo.boardmembers)) {
        yield put(companyActions.getCompanyInfoTrigger({ smeId }));
        yield put(companyActions.getCompanyAccountsTrigger({ smeId }));
        yield put(companyActions.getCompanyBoardMembersTrigger({ smeId }));

        const [companyDataSuccess, companyDataError] = yield race([
            all([
                take(companyActions.getCompanyInfoSuccess),
                take(companyActions.getCompanyAccountsSuccess),
                take(companyActions.getCompanyBoardMembersSuccess),
            ]),
            take(companyActions.getCompanyInfoError),
            take(companyActions.getCompanyAccountsError),
            take(companyActions.getCompanyBoardMembersError),
        ]);

        if (companyDataError) {
            throw new Error("Get company Data failed");
        }
    }
}

export function* getInvoiceData() {
    yield put(invoicesActions.fetchInvoicesTrigger());
    yield take(invoicesActions.fetchInvoicesSuccess);
}

export function* getTransactionsData() {
    const { statementTransactions } = yield select((state: AppState) => state.transactions);
    if (!statementTransactions || statementTransactions.length === 0) {
        const currDate = new Date();
        const accountCreationDate = yield select(
            (state: AppState) => state.account.account?.createDate
        );
        let firstDate = subMonths(currDate, initialFetchingTransactionsPeriod);
        if (new Date(accountCreationDate) > firstDate) firstDate = new Date(accountCreationDate);
        const endDate = format(currDate, "yyyy-MM-dd");
        const startDate = format(firstDate, "yyyy-MM-dd");
        const transactionsConfig = yield select((state: AppState) => state.transactions.config);

        yield put(smeTransactionsActions.smeFetchTransactionsTrigger({ startDate, endDate }));
        yield put(
            smeTransactionsActions.smeFetchTransactionsInitializer({
                ...transactionsConfig,
                startDate,
                endDate,
            })
        );
        yield take(smeTransactionsActions.smeFetchTransactionsSuccess);
    }
}

export function* getAccountData() {
    const smeId = yield select((state: AppState) => state.customer.engagement.activeSmeId);

    yield call(getCompanyData, smeId);

    const accounts: T_SmeCompanyAccounts = (yield select(
        (state: AppState) => state.customer.companyInfo.accounts?.accounts
    )) as T_SmeCompanyAccounts;

    let activeAccounts: T_SmeCompanyAccounts =
        accounts &&
        accounts.filter(
            (account) =>
                account?.state === E_AllowedAccountStates.OPEN ||
                account?.state === E_AllowedAccountStates.PENDING ||
                account?.state === E_AllowedAccountStates.COLLECTION
        );

    if (activeAccounts && activeAccounts.length > 1) {
        activeAccounts = activeAccounts.filter((account) => account?.state === "OPEN");
    } else if (activeAccounts && activeAccounts.length === 0) {
        history.push(E_Routes.NO_LOAN);
    }

    if (activeAccounts && activeAccounts.length === 1) {
        yield put(
            smeLoanAccountActions.accountSetAccountId({
                activeAccountId: activeAccounts[0].id || "",
            })
        );

        yield put(
            smeLoanAccountActions.fetchAccountTrigger({
                activeAccountId: activeAccounts[0].id || "",
            })
        );

        yield take(smeLoanAccountActions.fetchAccountSuccess);

        const documents: Array<VP.components["schemas"]["DocumentV8"]> = yield select(
            (state: AppState) => state.account.account?.documents
        );

        const { token, gwUrl, mockApiCalls } = yield select(
            (state: AppState) => state.account.config
        );

        yield put(
            smeDocumentActions.smeFetchPromissoryNoteIdInitializer({
                token,
                gwUrl: `${gwUrl}/file`,
                mockApiCalls,
                activeAccountId: activeAccounts[0].id || "",
                defaultPromissoryNoteId: documents[0]?.id || "",
            })
        );
    }
}

export function* checkSession() {
    const sessionToken = yield select((state: AppState) => state.session.token);
    const token = localStorage.getItem("token");

    if (!token && !sessionToken) {
        window.location.href = E_Routes.ROOT;
    }
}
