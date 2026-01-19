import { T_ApplicationReducerState, T_Guarantor, T_IndividualGuarantor } from "@opr-finance/feature-sme-customer/src/types";
export declare function isIndividualGuarantor(g: T_Guarantor | undefined): g is T_IndividualGuarantor;
export declare function getApplicantSsnFromApplication(applicationState?: T_ApplicationReducerState): string | undefined;
