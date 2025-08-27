import { T_Question } from "~/types/question";

export type T_ProductData = {
    product: string;
    type: string;
    steps: T_FormSteps;
    formHeader: T_FormHeader;
    button: T_ButtonLabels;
    footer: T_FooterData;
    //companyBlock?: T_CompanyBlock;
    questions: T_Question[];
};

export type T_FormSteps = {
    step1: string;
    step2: string;
    step3: string;
};

export type T_ButtonLabels = {
    next: string;
    back: string;
    submit: string;
};

export type T_FooterData = {
    customerServiceLabel: string;
    customerServiceText: string;
    contactInfoLabel: string;
    contactInfoText: string;
    addressLabel: string;
    addressText: string;
};

export type T_ErrorMessage = {
    error: string;
    message: string;
};

export type T_FormHeader = {
    title: string;
    subtitle: string;
};

export type T_CountryRecord = {
    id: number;
    name: string;
};

export type T_CountryListResponse = {
    data: Array<T_CountryRecord>;
};
