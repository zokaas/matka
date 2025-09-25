export type T_BeneficialOwnerFieldProps = {
    beneficialOwnerName: string;
    beneficialOwnerSsn: string;
    beneficialOwnerOwnership: string;
    beneficialOwnerCountry: string;
};

export type T_BeneficialOwnerCardProps = {
    placeholder: T_BeneficialOwnerFieldProps;
    fieldName: T_BeneficialOwnerFieldProps;
    label: T_BeneficialOwnerFieldProps;
    addButton: string;
};
