import { T_Country } from "~/types";

export type T_BeneficialOwner = {
    name: string;
    ssn: string;
    ownership: string;
    country: string;
};

export type T_BeneficialOwnerLabels = {
    nameLabelText?: string;
    ssnLabelText?: string;
    ownershipLabelText?: string;
    countryLabelText?: string;
    addBObutton?: string;
    namePlaceholder?: string;
    ssnPlaceholder?: string;
    ownershipPlaceholder?: string;
    countryPlaceholder?: string;
};

export type T_BeneficialOwnerForm = {
    name: string;
    label: string | React.ReactNode;
    beneficialOwners: T_BeneficialOwner[];
    setBeneficialOwner: (owners: T_BeneficialOwner[]) => void;
    countryList: T_Country[];
    errorMessage?: string | null;
    beneficialOwnerLabels?: T_BeneficialOwnerLabels;
    errors?: Record<string, string | undefined>;
};

export type T_BeneficialOwnerCard = {
    owner: T_BeneficialOwner;
    onDelete: () => void;
    labels: T_BeneficialOwnerLabels;
};
