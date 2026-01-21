// Package imports
import { all, fork } from "redux-saga/effects";

// @OPR Imports
import {
    watchFetchNewsTrigger,
    watchFetchNoticesTrigger,
    watchFetchTranslationStaticContentTrigger,
} from "@opr-finance/feature-contentful";
import { watchSmeLoanFetchAccountTrigger } from "@opr-finance/feature-account";
import { watchInitializers, watchPageInitializers } from "@opr-finance/feature-initializer";
import { watchFetchInvoices } from "@opr-finance/feature-statements";
import { watchSmeFetchTransactions } from "@opr-finance/feature-transactions-v2";
import {
    watchLoginSessionEnd,
    watchLoginSessionTrigger,
    watchLoginSessionVerify,
    watchloginSessionComplete,
} from "@opr-finance/feature-login-session";
import { watchSmeDocumentFetch } from "@opr-finance/feature-document";
import {
    watchCompanyAccountsTrigger,
    watchCompanyBoardMembersTrigger,
    watchCompanyTrigger,
    watchEngagementTrigger,
    watchUpdateCompanyInfoTrigger,
    watchSmeApplicationTrigger,
} from "@opr-finance/feature-sme-customer";
import { watchFetchReport } from "@opr-finance/feature-reporting";

import { watchFrontPageTrigger } from "./sagas/frontPage";
import { watchLoanPageTrigger } from "./sagas/loanPage";
import { watchTopupPageTrigger } from "./sagas/topupPage";
import { watchApplicationTrigger } from "./sagas/app";
import { watchUserInfoUpdateTrigger, watchUserPageTrigger } from "./sagas/userPage";
import { watchContactPageTrigger } from "./sagas/contactPage";
import { watchChooseAccountPageTrigger, watchSaveSmeIdTrigger } from "./sagas/chooseAccountPage";
import { watchStartPageTrigger } from "./sagas/startPage.saga";
import { watchLoginTrigger } from "./sagas/loginPage";
import { watchLogoutPageTrigger } from "./sagas/logout.saga";
import { watchExpiredPageTrigger } from "./sagas/expiredPage.saga";
import { watchSmeWithdrawTrigger } from "@opr-finance/feature-withdraw";
import { watchRefreshSession } from "@opr-finance/feature-session";
import { watchApplicationPageTrigger } from "./sagas/applicationPage";
import { watchKycStartFlowTrigger } from "@opr-finance/feature-kyc";

// File Imports

export function* rootSaga() {
    yield all([
        fork(watchApplicationTrigger),
        fork(watchStartPageTrigger),
        fork(watchLoginSessionTrigger),
        fork(watchInitializers),
        fork(watchLogoutPageTrigger),
        fork(watchExpiredPageTrigger),
        fork(watchFetchNewsTrigger),
        fork(watchFetchTranslationStaticContentTrigger),
        fork(watchFrontPageTrigger),
        fork(watchSmeLoanFetchAccountTrigger),
        fork(watchFetchInvoices),
        fork(watchLoanPageTrigger),
        fork(watchTopupPageTrigger),
        fork(watchSmeFetchTransactions),
        fork(watchUserPageTrigger),
        fork(watchContactPageTrigger),
        fork(watchChooseAccountPageTrigger),
        fork(watchSaveSmeIdTrigger),
        fork(watchLoginTrigger),
        fork(watchEngagementTrigger),
        fork(watchCompanyTrigger),
        fork(watchCompanyAccountsTrigger),
        fork(watchCompanyBoardMembersTrigger),
        fork(watchSmeDocumentFetch),
        fork(watchSmeWithdrawTrigger),
        fork(watchPageInitializers),
        fork(watchUserInfoUpdateTrigger),
        fork(watchUpdateCompanyInfoTrigger),
        fork(watchFetchNoticesTrigger),
        fork(watchLoginSessionVerify),
        fork(watchloginSessionComplete),
        fork(watchLoginSessionEnd),
        fork(watchFetchReport),
        fork(watchRefreshSession),
        fork(watchSmeApplicationTrigger),
        fork(watchApplicationPageTrigger),
        fork(watchKycStartFlowTrigger),
    ]);
}
