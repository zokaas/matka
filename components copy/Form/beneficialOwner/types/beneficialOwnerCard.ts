import { T_Option } from "~/types";

type T_FieldConfig = {
    parameter: string;
    label: string;
    placeholder: string;
    options?: Array<T_Option>;
};

export type T_BeneficialOwnerCardProps = {
    addButton: string;
    fields: {
        name: T_FieldConfig;
        ssn: T_FieldConfig;
        ownership: T_FieldConfig;
        country: T_FieldConfig;
        pep: T_FieldConfig;
    };
};