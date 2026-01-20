import { FeatureNewsState, FeatureNoticesState, FeatureTranslationStaticContentState } from "@opr-finance/feature-contentful";
import { T_FeatureInvoicesState } from "@opr-finance/feature-statements";
import { FeatureInitializerState, T_FeaturePageInitializerState } from "@opr-finance/feature-initializer";
import { T_SmeFeatureTransactionsState } from "@opr-finance/feature-transactions-v2";
import { FeatureSmeWithdrawState } from "@opr-finance/feature-withdraw";
import { FeatureLoaderState } from "@opr-finance/feature-loader";
import { FeatureUserLoginState } from "@opr-finance/feature-luvittaja-login";
import { SystemStyleObject } from "@styled-system/css";
import { T_SmeLoan_FeatureAccountState } from "@opr-finance/feature-account";
import { T_FeatureLoginSessionState } from "@opr-finance/feature-login-session";
import { T_FeatureCustomerReducerState } from "@opr-finance/feature-sme-customer";
import { T_FeatureDocumentState } from "@opr-finance/feature-document";
import { T_FeatureReportingState } from "@opr-finance/feature-reporting";
import { T_FeatureSessionState } from "@opr-finance/feature-session";

export type AppState = FeatureUserLoginState & T_FeatureCustomerReducerState & T_SmeLoan_FeatureAccountState & T_FeatureDocumentState & FeatureNewsState<FeatureUserLoginState> & FeatureNoticesState & FeatureTranslationStaticContentState<FeatureUserLoginState> & FeatureNoticesState & T_FeatureInvoicesState & T_SmeFeatureTransactionsState & FeatureInitializerState & FeatureSmeWithdrawState<FeatureUserLoginState> & FeatureLoaderState & T_FeatureLoginSessionState & T_FeaturePageInitializerState & T_FeatureReportingState & T_FeatureSessionState & T_KycReducerState;
export type IncreaseCreditLimitFormData = {
    newCreditLimit: string;
    allowDowngrade: boolean;
    employmentType: string;
    monthlyIncomeGross: string;
    livingExpenses: string;
    loanExpenses: string;
    maritalStatus: string;
    children: string;
    allowBisnodeCheck: boolean;
};
export declare enum EmploymentOptionsPlain {
    FULL = "Tillsvidareanst\u00E4lld",
    TRIAL = "Provanst\u00E4lld",
    RETIRED = "Pensionerad",
    PROJECT = "Projektanst\u00E4lld",
    SELF_EMPLOYED = "Egenf\u00F6retagare",
    NO_WORK = "Arbetsl\u00F6s",
    STUDENT = "Student",
    TEMPORARY = "Vikarie"
}
export declare enum EmploymentOptions {
    FULL = "FULL",
    TRIAL = "TRIAL",
    RETIRED = "RETIRED",
    PROJECT = "PROJECT",
    SELF_EMPLOYED = "SELF_EMPLOYED",
    NO_WORK = "NO_WORK",
    STUDENT = "STUDENT",
    TEMPORARY = "TEMPORARY"
}
export declare enum MaritialStatusPlain {
    DIVORCED = "Skild",
    MARRIED = "Gift",
    PARTNER = "Sambo",
    SINGLE = "Singel",
    WIDOWED = "\u00C4nka/\u00C4nkling"
}
export declare enum MaritialStatus {
    DIVORCED = "DIVORCED",
    MARRIED = "MARRIED",
    PARTNER = "PARTNER",
    SINGLE = "SINGLE",
    WIDOWED = "WIDOWED"
}
export type MaritialStatusReturn = keyof typeof MaritialStatus;
export type IncreaseLimitApplicant = {
    personalID: string;
    givenName: string;
    surName: string;
    email: string;
    phone: string;
};
export type IncreaseLimitApplicantBankAccount = {
    bankAccount: string;
};
export type IncreaseLimitApplication = IncreaseCreditLimitFormData & IncreaseLimitApplicant & IncreaseLimitApplicantBankAccount;
export declare enum E_Routes {
    ROOT = "/",
    LOGIN = "/login",
    ACCOUNTS = "/chooseaccount",
    USER = "/user",
    FRONT = "/front",
    LOAN = "/loan",
    CONTACT = "/contact",
    CHANGE = "/change",
    TOPUP = "/topup",
    LOGOUT = "/logout",
    ERROR = "/error",
    NO_LOAN = "/noloan",
    EXPIRED = "/expired",
    CHOOSE_ACCOUNT = "/chooseaccount",
    NOT_FOUND = "/notfound",
    ALL_OTHERS = "*",
    KYC = "/application/:id",
    APPLICATION = "/application",
    THANK_YOU = "/thank-you",
    KYC_COMPLETED = "/kyc-completed"
}
export type T_FontProps = {
    boxTitle: SystemStyleObject;
    boldedText?: SystemStyleObject;
    contentText?: SystemStyleObject;
    linkText?: SystemStyleObject;
    alertText?: SystemStyleObject;
};
export type T_AdditionalFontProps = {
    amountText: SystemStyleObject;
};
export declare enum E_Page_Ids {
    START = "startpage",
    LOGIN = "loginpage",
    ACCOUNTS = "accountspage",
    USER = "userpage",
    FRONT = "frontpage",
    LOAN = "loanpage",
    CONTACT = "contactpage",
    CHANGE = "changepage",
    TOPUP = "topuppage",
    LOGOUT = "logoutpage",
    ERROR = "errorpage",
    NO_LOAN = "noloanpage",
    EXPIRED = "expiredpage",
    CHOOSE_ACCOUNT = "chooseaccountpage",
    APPLICATION = "application"
}
export type T_RouteParams = {
    appid?: string;
};
export declare enum E_Flow {
    KYCFF = "kyc-ff"
}
export declare enum E_ApplicationChannel {
    PHONE = "PHONE",
    BROKER = "BROKER",
    LETTER = "LETTER",
    WEB = "WEB"
}
