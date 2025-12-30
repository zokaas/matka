import { SystemStyleObject } from "@styled-system/css";

export type UserPageProps = {
    styleConfig: {
        titleBox: SystemStyleObject;
        pageTitle: SystemStyleObject;
    };
};

export type T_UpdateUserInfoFormData = {
    email: string | undefined;
    phone: string | undefined;
    streetAddress: string | undefined;
    zipCode: string | undefined;
    city: string | undefined;
    smeId: string | undefined;
};
