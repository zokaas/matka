import {
    T_DynamicField,
    T_DynamicFieldBeneficialOwner,
    T_DynamicFieldDependentQuestion,
    T_DynamicFieldInfo,
    T_DependentQuestionComponentUid
} from "~/types/questionType";

export const isDependentQuestion = (
    question: T_DynamicField<
        T_DynamicFieldDependentQuestion | T_DynamicFieldInfo | T_DynamicFieldBeneficialOwner
    >
): question is T_DynamicField<T_DynamicFieldDependentQuestion> => {
    const dependentUids: T_DependentQuestionComponentUid[] = [
        "kyc.dependent-question-fi",
        "kyc.dependent-question-se",
    ];

    return dependentUids.includes(question.__component as T_DependentQuestionComponentUid);
};