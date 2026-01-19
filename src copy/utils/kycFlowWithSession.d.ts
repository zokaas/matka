import { T_CompanyKycParams, T_KycFlow, T_KycParams } from "../types/kyc";
import { T_LoginSessionReducerState } from "@opr-finance/feature-login-session";
export declare const initiateKycFlowWithSession: (kycParams: T_KycParams) => Promise<void>;
export declare const startKyc: (company: T_CompanyKycParams, session: T_LoginSessionReducerState, flow: T_KycFlow) => Promise<boolean>;
