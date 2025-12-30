import { SystemStyleObject } from "@styled-system/css";

export type StartPageProps = {
    styleConfig: {
        titleBox: SystemStyleObject;
        pageTitle: SystemStyleObject;
    };
};

export type T_BankObject = {
    authId: string;
    logo: string;
    logoWidth: string | Array<string>;
    logoHeight: string | Array<string>;
};
