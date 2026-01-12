import { SystemStyleObject } from "@styled-system/css";
import { T_FontProps, T_AdditionalFontProps } from "../../types/general";

export type LoanPageProps = {
    styleConfig: {
        titleBox: SystemStyleObject;
        pageTitle: SystemStyleObject;
        textStyle: T_FontProps & T_AdditionalFontProps;
    };
};

export type T_AccountData = {
    companyName: string;
    organisationNumber: string;
    accountNumber: string;
    creationDate: string;
    remainingPrincipal: string;
    remainingDebt: string;
};
