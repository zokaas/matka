import { T_ErrorClassNamesProps } from "@ui/error";
import { T_BeneficialOwnerCardProps } from "./beneficialOwnerCard";
import { T_AnswerValue, T_CountryArray } from "~/types";
import { T_LabelInfo } from "@ui/label";

export type T_BeneficialOwnerClassNames = {
    beneficialOwnerLabel: string;
};

export type T_BeneficialOwnerProps = {
    label: string;
    fieldName: string;
    beneficialOwnersMaxCount: number;
    onChange: (fieldName: string, value: T_AnswerValue) => void;
    countryList: T_CountryArray;
    errorClassNames?: T_ErrorClassNamesProps;
    classNames?: T_BeneficialOwnerClassNames;
    beneficialOwnerFieldsData: T_BeneficialOwnerCardProps;
    error?: string;
    infoItems?: T_LabelInfo[] | null;
};

export type T_BeneficialOwnerData = {
    name: string;
    ssn: string;
    ownership: string;
    country: string;
};
