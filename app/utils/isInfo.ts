import {
    T_DynamicField,
    T_DynamicFieldBeneficialOwner,
    T_DynamicFieldDependentQuestion,
    T_DynamicFieldInfo,
} from "~/types/questionType";

export const isInfo = (
    question: T_DynamicField<
        T_DynamicFieldDependentQuestion | T_DynamicFieldInfo | T_DynamicFieldBeneficialOwner
    >
): question is T_DynamicField<T_DynamicFieldInfo> => {
    return question.__component === "kyc.info";
};
