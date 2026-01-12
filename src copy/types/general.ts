import { FeatureInitializerState } from "@opr-finance/feature-initializer";

export type AppState = FeatureInitializerState;

export type T_ApplicationSent = {
    status: boolean;
    type: "general" | "rescoring";
    partner?: boolean;
};

export type T_BaseApplicant = {
    amount: string;
    applicantGivenName: string;
    applicantSurname: string;
    applicantEmail: string;
    applicantPhone: string;
};

export type T_Application = T_BaseApplicant & {
    companyName: string;
    companyId: string;
    iban: string;
    companyAddressStreet: string;
    companyAddressCity: string;
    companyAddressZip: string;
    companyCountryCode: string;
    turnover: string;
    applicantName: string;
    pepCheck: boolean;
    allowMarketing: boolean;
    consentGiven: boolean;
    ssn: string;
    applicantBirthday: string;
    campaignCode: string;
    clientApplicationId: string;
    externalReference: number;
    medium: string;
    source?: string;
};
