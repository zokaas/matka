import { T_DynamicField, T_DynamicFieldInfo, T_DynamicFieldUnion } from "~/types/questionType";

export const isInfo = (
    question: T_DynamicField<T_DynamicFieldUnion>
): question is T_DynamicField<T_DynamicFieldInfo> => {
    return question.__component === "kyc.info";
};
