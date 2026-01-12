import { T_BrokerApplication, T_BrokerProxyApplication } from "../types/partner";

export function extractBrokerProxyApplication(data: T_BrokerApplication): T_BrokerProxyApplication {
    return {
        CustomerId: data.clientApplicationId,
        AppliedAmount: data.amount,
        LoanPurpose: "", // API requires this field, but it's not provided in the PartnerApplication
        CompanyName: data.companyName,
        CompanyId: data.companyId,
        MonthlyTurnover: data.turnover,
        Email: data.applicantEmail,
        PhoneNumber: data.applicantPhone,
        ApplierFirstName: data.applicantGivenName,
        ApplierSurname: data.applicantSurname,
        SocialSecurityNumber: "", // API requires this field, but it's not provided in the PartnerApplication
    };
}
