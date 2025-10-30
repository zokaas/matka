import {
    T_DynamicField,
    T_DynamicFieldBeneficialOwner,
    T_DynamicFieldDependentQuestion,
    T_DynamicFieldInfo,
} from "~/types/questionType";

export const isBeneficialOwnerQuestion = (
    question: T_DynamicField<
        T_DynamicFieldDependentQuestion | T_DynamicFieldInfo | T_DynamicFieldBeneficialOwner
    >
): question is T_DynamicField<T_DynamicFieldBeneficialOwner> => {
    return question.__component === "kyc.beneficial-owner";
};
