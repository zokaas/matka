import { T_FormFields } from "../hooks/types";

export type T_StartPagePayload = {
    uuid: string;
};
export type T_AttachmentFileObject = {
    dataUrl: string;
    name: string;
    type: string;
    size: number;
};

export const applicationSteps = {
    SIGNED_IN: 0,
    FILL: 33,
    CHECK: 66,
    SENT: 100,
} as const;

export const applicationStepsTitle = {
    SIGNED_IN: "Identifiering",
    FILL: "Ansökan",
    CHECK: "Förhandsvisa",
    SENT: "Skicka",
} as const;

export type T_Error = {
    name: string;
    message: string | null;
};

export type T_EventType = {
    name: string;
    value: string | boolean | T_AttachmentFileObject[] | number | null;
};

export type T_SelectOption = {
    id?: string;
    value: number | string | null;
    label: string;
};

export enum E_RequiredFormBlock {
    BASIC_INFO = "basicInfo",
    COMPANY_INFO = "companyInfo",
    APPLICANT_INFO = "applicantInfo",
    GUARANTOR_INFO = "guarantorInfo",
    SECOND_GUARANTOR_INFO = "secondGuarantorInfo",
}

export type T_RedirectProps = {
    url: string;
};

export type T_BffProps = {
    mock: boolean;
    authUrl: string;
    cid: string;
    lang: string;
    basebffUrl: string;
    verifyUrl: string;
    errorUrl: string;
    expiredUrl: string;
    getUserDataUrl: string;
    logoutUrl: string;
    refreshSessionUrl: string;
};

export type T_FrendsProps = {
    mock: boolean;
    frendsUrl: string;
    apiKey: string;
};

export const flowStatus = {
    APPLICATION: "fill_application",
    ONBOARDING: "kyc_onboarding",
    REDIRECTED: "kyc_ready",
    COMPLETED: "all_done",
} as const;

export type T_FlowStatus = (typeof flowStatus)[keyof typeof flowStatus];

export type T_LocationState = {
    history: string;
    fields: T_FormFields;
    secondGuarantorVisible: boolean;
    status: T_FlowStatus | undefined;
};
