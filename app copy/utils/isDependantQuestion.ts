import {
    T_DynamicField,
    T_DynamicFieldDependentQuestion,
    T_DynamicFieldUnion,
} from "~/types/questionType";

export const isDependentQuestion = (
    question: T_DynamicField<T_DynamicFieldUnion>
): question is T_DynamicField<T_DynamicFieldDependentQuestion> => {
    return question.__component === "kyc.dependent-question";
};
