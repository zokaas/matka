import {
    T_DynamicField,
    T_DynamicFieldCountryOptions,
    T_DynamicFieldUnion,
} from "~/types/questionType";

export const isCountryOptions = (
    question: T_DynamicField<T_DynamicFieldUnion>
): question is T_DynamicField<T_DynamicFieldCountryOptions> => {
    return question.__component === "kyc.country-options";
};
