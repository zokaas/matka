import { T_ClientSessionData } from "~/routes/types";
import { T_Question } from "./question";

export type T_FormMainCommonProperties = {
    id: number;
    product: string;
    formType: string;
    redirectUrl: string;
};

export type T_FormGeneralFormProperties = {
    steps: T_FormSteps;
    button: T_ButtonLabels;
    footer: T_FooterData;
    companyBlock: T_CompanyInfo;
    formHeader: T_FormHeader;
    sessionModal: T_SessionModal;
};

export type T_FormSteps = {
    step1: string;
    step2: string;
    step3: string;
};

export type T_FormStepsKeys = keyof T_FormSteps;

export type T_FormStepsWithQuestions = Map<T_FormStepsKeys, Array<T_Question>>;

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

export type T_CompanyInfo = {
    companyNameLabel: string;
    orgNumberLabel: string;
    companyName: string;
    orgNumber: string;
};

export type T_FormHeader = {
    title: string;
    subtitle: string;
};

export type T_SessionModal = {
    refreshTitle: string;
    refreshDescription: string;
    continueSessionButton: string;
    expiredTitle: string;
    expiredDescription: string;
    loginButton: string;
    logoutButton: string;
    sessionData: T_ClientSessionData;
};
