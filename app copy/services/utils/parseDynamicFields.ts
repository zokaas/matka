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
            const parentParameter = item.question.questionParameter;
            const dependentParameter = dynamicField.questionParameter;
            const compositeKey = `${parentParameter}::${dependentParameter}`;
            
            result.dependentQuestion = {
                __component: "kyc.dependent-question",
                componentType: dynamicField.componentType,
                conditionValue: dynamicField.conditionValue,
                countryNameLang: dynamicField.countryNameLang,
                id: dynamicField.id,
                options: dynamicField.options,
                questionDescription: dynamicField.questionDescription,
                questionLabel: dynamicField.questionLabel,
                questionParameter: compositeKey,  // Use composite key here!
                useCountryList: dynamicField.useCountryList,
                placeholder: dynamicField.placeholder,
                errorMessages: Array.isArray(dynamicField.errorMessages)
                    ? dynamicField.errorMessages.map((item) => ({
                          error: item.error,
                          message: item.message,
                      }))
                    : [],
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