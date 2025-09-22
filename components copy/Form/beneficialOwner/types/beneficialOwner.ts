import { T_ErrorClassNamesProps } from "@ui/error";
import { T_BeneficialOwnerCardProps } from "./beneficialOwnerCard";
import { T_CountryArray } from "~/types";

export type T_BeneficialOwnerClassNames = {
    beneficialOwnerLabel: string;
};

export type T_BeneficialOwnerProps = {
    label: string;
    fieldName: string;
    beneficialOwnersMaxCount: number;
    handleChange: () => void;
    countryList: T_CountryArray;
    errorClassNames?: T_ErrorClassNamesProps;
    classNames?: T_BeneficialOwnerClassNames;
    beneficialOwnerFieldsData: T_BeneficialOwnerCardProps;
    error?: string;
};

export type T_BeneficialOwnerData = {
    name: string;
    ssn: string;
    ownership: string;
    country: string;
};
