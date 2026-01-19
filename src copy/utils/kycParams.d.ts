import { T_CompanyKycParams, T_KycFlow, T_KycParams } from "../types/kyc";
import { T_LoginSessionReducerState } from "@opr-finance/feature-login-session";
export declare const mapKycParams: (company: T_CompanyKycParams, session: T_LoginSessionReducerState, flow: T_KycFlow) => T_KycParams | null;
export declare const mapCompanyDataForKyc: (company: {
    organizationNumber: any;
    companyName: any;
    industryCode: any;
}) => T_CompanyKycParams;
