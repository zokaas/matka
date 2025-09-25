import { T_CountryArray } from "~/types";
import { T_BeneficialOwnerCardProps } from "./beneficialOwnerCard";

export type T_BeneficialOwnersFormClassnames = {
    formContainer?: string;
    formInputField?: string;
    formSelectField?: string;
    fromButton?: string;
    formLabelFields?: string;
};

export type T_BeneficialOwnerFormProps = {
    formData: T_BeneficialOwnerCardProps;
    //onChange: (fieldName: string, value: string) => void;
    //onBlur: (fieldName: string) => void;
    onButtonClick: (
        name: T_BoFieldParams,
        ssn: T_BoFieldParams,
        ownership: T_BoFieldParams,
        countries: T_BoFieldParams
    ) => void;
    countryList?: T_CountryArray;
    classNames: T_BeneficialOwnersFormClassnames;
};

export type T_BoFieldParams = {
    fieldname: string;
    value: string | Array<string>;
    label: string;
};

export type T_BoMapObject = {
    [key: string]: T_BoFieldParams;
};
