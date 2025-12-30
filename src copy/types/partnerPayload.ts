import { T_ApplicationPayload } from "./general";

export type PartnerApplication = {
    CustomerId: string;
    AppliedAmount: string;
    LoanPurpose: string;
    CompanyName: string;
    CompanyId: string;
    MonthlyTurnover: string;
    Email: string;
    PhoneNumber: string;
    ApplierFirstName: string;
    ApplierSurname: string;
    SocialSecurityNumber?: string;
};

export function extractPartnerApplication(data: T_ApplicationPayload): PartnerApplication {
    return {
        CustomerId: data.clientApplicationId,
        AppliedAmount: data.amount,
        LoanPurpose: data.reason,
        CompanyName: data.companyName,
        CompanyId: data.companyId,
        MonthlyTurnover: data.turnover,
        Email: data.applicantEmail,
        PhoneNumber: data.applicantPhone,
        ApplierFirstName: data.applicantGivenName,
        ApplierSurname: data.applicantSurname,
        SocialSecurityNumber: data.ssn,
    };
}
