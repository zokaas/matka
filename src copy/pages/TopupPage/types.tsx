import { SystemStyleObject } from "@styled-system/css";

export type TopupPageProps = {
    styleConfig: {
        titleBox: SystemStyleObject;
        pageTitle: SystemStyleObject;
        modalCloseIcon: SystemStyleObject;
        modalOverlay: SystemStyleObject;
        modalContent: SystemStyleObject;
        modalTitle: SystemStyleObject;
        titleText: SystemStyleObject;
    };
};
export type IncreaseCreditLimitFormData = {
    newCreditLimit: string;
    allowInspection: boolean;
    personalInfoConsent: boolean;
    monthlyIncomeGross: string;
    campaignCode: string;
    loanPurpose: string;
    loanPurposeDescription: string;
};
export type IncreaseLimitApplicant = {
    personalID: string;
    givenName: string;
    surName: string;
    email: string;
    phone: string;
    birthDate: string;
};

export type IncreaseLimitApplicantBankAccount = {
    bankAccount: string;
};

export type IncreaseLimitConfig = {
    gwUrl?: string;
};
export type IncreaseLimitCompanyInfo = {
    smeId: string;
};

export type IncreaseLimitApplication = IncreaseCreditLimitFormData &
    IncreaseLimitApplicant &
    IncreaseLimitApplicantBankAccount &
    IncreaseLimitConfig &
    IncreaseLimitCompanyInfo;

export type StatementsStatus = {
    overdueDays: number; // need to be 0
    statementsCount: number; // need to be at least 3
};
export type TDataError = {
    status: boolean;
    errorMessage: string;
};
