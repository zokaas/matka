import { combineReducers } from "redux";
import { userReducer } from "@opr-finance/feature-luvittaja-login";
import {
    recentNewsReducer,
    noticesReducer,
    translationStaticContentReducer,
} from "@opr-finance/feature-contentful";
import { initializerReducer, pageInitializerReducer } from "@opr-finance/feature-initializer";
import { invoicesReducer } from "@opr-finance/feature-statements";
import { smeDocumentReducer } from "@opr-finance/feature-document";
import { smeTransactionsReducer } from "@opr-finance/feature-transactions-v2";
import { smeWithdrawReducer } from "@opr-finance/feature-withdraw";
import { loaderReducer } from "@opr-finance/feature-loader";
import { smeLoanAccountReducer } from "@opr-finance/feature-account";
import { loginSessionReducer } from "@opr-finance/feature-login-session";
import { customerReducer } from "@opr-finance/feature-sme-customer";

import { AppState } from "./types/general";
import { reportingReducer } from "@opr-finance/feature-reporting";
import { sessionReducer } from "@opr-finance/feature-session";
import { kycReducer } from "./reducers/kyc.reducer";

export const rootReducer = combineReducers<AppState>({
    customer: customerReducer,
    user: userReducer,
    account: smeLoanAccountReducer,
    news: recentNewsReducer,
    notices: noticesReducer,
    invoices: invoicesReducer,
    transactions: smeTransactionsReducer,
    initializer: initializerReducer,
    translation: translationStaticContentReducer,
    document: smeDocumentReducer,
    withdraw: smeWithdrawReducer,
    loader: loaderReducer,
    session: loginSessionReducer,
    pageInitializer: pageInitializerReducer,
    reporting: reportingReducer,
    userActivity: sessionReducer,
    kyc: kycReducer,
});
