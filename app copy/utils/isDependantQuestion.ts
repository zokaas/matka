import {
    T_DynamicField,
    T_DynamicFieldBeneficialOwner,
    T_DynamicFieldDependentQuestion,
    T_DynamicFieldInfo,
} from "~/types/questionType";

export const isDependentQuestion = (
    question: T_DynamicField<
        T_DynamicFieldDependentQuestion | T_DynamicFieldInfo | T_DynamicFieldBeneficialOwner
    >
): question is T_DynamicField<T_DynamicFieldDependentQuestion> => {
    return question.__component === "kyc.dependent-question";
};
