import {
    T_DynamicField,
    T_DynamicFieldBeneficialOwner,
    T_DynamicFieldUnion,
} from "~/types/questionType";

export const isBeneficialOwnerQuestion = (
    question: T_DynamicField<T_DynamicFieldUnion>
): question is T_DynamicField<T_DynamicFieldBeneficialOwner> => {
    return question.__component === "kyc.beneficial-owner";
};
