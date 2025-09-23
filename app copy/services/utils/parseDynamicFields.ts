import { T_Info, T_ParseDynamicFieldsResult } from "~/types";
import { T_QuestionTypeBasic } from "~/types/questionType";
import { isBeneficialOwnerQuestion, isDependentQuestion, isInfo } from "~/utils";

export const parseDynamicFields = (item: T_QuestionTypeBasic): T_ParseDynamicFieldsResult => {
    let result: T_ParseDynamicFieldsResult = {
        addBObutton: null,
        boMaxCount: null,
        countryParameter: null,
        countryPlaceholder: null,
        countryQuestion: null,
        dependentQuestion: null,
        infoItems: [],
        nameParameter: null,
        namePlaceholder: null,
        nameQuestion: null,
        ownershipParameter: null,
        ownershipPlaceholder: null,
        ownershipQuestion: null,
        ssnParameter: null,
        ssnPlaceholder: null,
        ssnQuestion: null,
        useCountryList: null,
    };
    
    if (!item.question.dynamicField) return result;

    const infoItems: T_Info[] = [];

    item.question.dynamicField.forEach((dynamicField) => {
        if (isDependentQuestion(dynamicField)) {
            result.dependentQuestion = {
                __component: "kyc.dependent-question",
                componentType: dynamicField.componentType,
                conditionValue: dynamicField.conditionValue,
                countryNameLang: dynamicField.countryNameLang,
                id: dynamicField.id,
                options: dynamicField.options,
                questionDescription: dynamicField.questionDescription,
                questionLabel: dynamicField.questionLabel,
                questionParameter: dynamicField.questionParameter,
                useCountryList: dynamicField.useCountryList,
                placeholder: dynamicField.placeholder,
                errorMessages: dynamicField.error_messages.data.map((item) => ({
                    error: item.attributes.error,
                    message: item.attributes.message,
                })),
                infoItems: [],
            };
        }

        if (isInfo(dynamicField)) {
            infoItems.push({
                id: dynamicField.id,
                __component: "kyc.info",
                componentType: dynamicField.componentType,
                infoHeader: dynamicField.infoHeader,
                infoDescription: dynamicField.infoDescription,
            });
        }

        if (isBeneficialOwnerQuestion(dynamicField)) {
            result = {
                ...result,
                ...dynamicField,
            };
        }
    });

    result.infoItems = infoItems;

    return result;
};