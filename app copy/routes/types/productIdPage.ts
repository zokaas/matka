import { T_Answers, T_CountryArray, T_ParsedFormData } from "~/types";

export type T_ProductIdPageData = {
    organizationName: string;
    organizationNumber: string;
    productId: string;
    kycType: string;
};

export type T_Error = {
    message?: string;
    type?: string;
};

export type T_ClientSessionData = {
    applicationId: string;
    productId: string;
    exp: number;
    maxSessionRefresh: number;
    sessionRefreshCount: number;
};

/**
 * Record<string, never> is representing an empty object.'
 *
 * More information:
 * https://www.totaltypescript.com/the-empty-object-type-in-typescript
 */
export type T_ProductIdLoaderData = {
    pageData: T_ProductIdPageData | Record<string, never>;
    formData: T_ParsedFormData | Record<string, never>;
    answers: T_Answers;
    countryList?: T_CountryArray;
    error?: T_Error;
    sessionData: T_ClientSessionData | Record<string, never>;
};
