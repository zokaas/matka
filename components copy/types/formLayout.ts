import { T_BeneficialOwner } from "components/BeneficialOwner";

export type T_FormValue = string | string[] | T_BeneficialOwner[] | Record<string, unknown>;

export interface T_FormValues {
    [key: string]: T_FormValue;
}

export interface T_ActionData {
    errors?: Record<string, string>;
    formValues?: T_FormValues;
}
