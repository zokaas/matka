import { T_FormattedAttachmentFileObject } from "@opr-finance/features/file-upload-handler/types";

type T_ApplicationState = "UNTREATED" | "APPROVED" | "PAID" | "REJECTED" | "COMPLETE";

export type T_PrefilledApplicationTrackingData = {
    source: string;
    subsource?: string;
    redirect_id?: string;
};

export type T_PrefilledApplicationData = T_PrefilledApplicationTrackingData & {
    kycFormFilled: string;
    amount: number;
    maturity: number;
    dataPrivacy: boolean;
    applicationUuid: string;
    company: T_BasicCompany;
    applicant: T_BasicApplicant;
    guarantor: T_Guarantor;
    brokerApplicationId?: string;
    state: T_ApplicationState | null;
};

export type T_BasicCompany = {
    organizationNumber: string;
    name: string;
    streetAddress: string;
    zipcode: string;
    city: string;
    accountNumber: string;
    sni: string;
    sni_text: string;
};

type T_Company = {
    organizationNumber: string;
    name: string;
    streetAddress: string;
    city: string;
    accountNumber: string;
    businessSector: string;
    zipCode: string;
};

type T_BasicApplicant = {
    name: string;
    ssn: string;
    email: string;
    phoneNumber: string;
};

type T_Applicant = T_BasicApplicant & {
    creditCheck: boolean;
    pep: boolean;
    marketingPermission: boolean;
    selfGuarantor: boolean;
};

type T_Guarantor = {
    name: string;
    ssn: string;
    email: string;
    phoneNumber: string;
    allowsCreditCheck: boolean;
};

type T_FirstGuarantor = T_SecondGuarantor & {
    applicantAsFirstGuarantor: boolean;
    ssn?: string;
};

type T_SecondGuarantor = {
    name: string;
    email: string;
    phone: string;
};
type T_Guarantors = {
    firstGuarantor: T_FirstGuarantor;
    secondGuarantor?: T_SecondGuarantor;
};

export type T_ApplicationData = {
    applicationUuid: string;
    amount: number;
    maturity: number;
    brokerApplicationId?: string;
    desiredDueDate: number;
    loanReason: string;
    loanPurposeDescription: string;
    campaignCode: string;
    company: T_Company;
    applicant: T_Applicant;
    guarantors: T_Guarantors;
    attachments: T_FormattedAttachmentFileObject[];
    source: string;
    subsource: string;
    redirectId: string;
    ip: string;
    gaClientId: string;
    gaTransactionId: string;
    gaSessionId: string;
    timestamp: string;
    production: number;
};

type T_PreFormData = {
    loanAmount: string;
    repaymentPeriod: string;
    organizationNumber: string;
    emailAddress: string;
    applicantPhone: string;
};

export type T_ApplicationDataReducerState = {
    data: T_PrefilledApplicationData | null;
};
