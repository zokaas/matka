import { T_BaseApplicant } from "./general";

export type T_BrokerApplication = T_BaseApplicant & {
    companyName: string;
    companyId: string;
    turnover: string;
    allowMarketing: boolean;
    consentGiven: boolean;
    campaignCode: string;
    clientApplicationId: string;
    externalReference: number;
};

export type T_BrokerProxyApplication = {
    CustomerId: string;
    AppliedAmount: string;
    LoanPurpose?: string;
    CompanyName: string;
    CompanyId: string;
    MonthlyTurnover: string;
    Email: string;
    PhoneNumber: string;
    ApplierFirstName: string;
    ApplierSurname: string;
    SocialSecurityNumber?: string;
};
