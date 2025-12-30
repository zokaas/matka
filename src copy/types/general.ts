import { FeatureInitializerState } from "@opr-finance/feature-initializer";
import { FontStyleProps, InputStyleProps, T_TrackingPayload } from "@opr-finance/utils";

export type AppState = FeatureInitializerState;

export type T_ApplicationSent = {
    status: boolean;
    partner?: boolean;
};

export type T_Application = {
    amount: string;
    applicantBirthday: string;
    applicantEmail: string;
    applicantGivenName: string;
    applicantName: string;
    applicantPhone: string;
    applicantSurname: string;
    campaignCode: string;
    companyAddressCity: string;
    companyAddressStreet: string;
    companyAddressZip: string;
    companyId: string;
    companyName: string;
    creditCheck: boolean;
    iban: string;
    isPep: string;
    reason: string;
    reasonDescription: string;
    ssn: string;
    turnover: string;
};

export type T_ApplicationPayload = T_Application & T_TrackingPayload;

export type T_PipelinePageProps = {
    styleConfig: {
        body: FontStyleProps;
        bodyTitle: FontStyleProps;
        pageTitle: FontStyleProps;
        textField: InputStyleProps;
        select: InputStyleProps;
        checkbox: InputStyleProps;
        checkboxText: FontStyleProps;
        button: InputStyleProps;
        buttonText: FontStyleProps;
        formError: FontStyleProps;
        contractLink: FontStyleProps;
    };
};
