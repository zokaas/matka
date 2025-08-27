import { T_CountryRecord, T_ProductData } from "./form";

type T_Answer = {
    questionId: string;
    question: string;
    answer: string;
};

export type T_Payload = {
    userId: string;
    applicationId: string;
    productId: string;
    questionSetId: string;
    answers: T_Answer[];
};

export type T_SendFormDataResponse = {
    status: string;
    message: string;
    storeId: number;
    // Add more fields as required
};

export type T_SubmitActionData = {
    success: boolean;
    message?: string;
    storeId?: number;
    data?: T_Payload;
};

export type T_GetFormResponse = {
    productData: T_ProductData;
    countryList: Array<T_CountryRecord>;
};
