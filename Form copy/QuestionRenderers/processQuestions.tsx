import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

import { Tooltip } from "@ui-components/index";
import {
    T_BeneficialOwnerConfig,
    T_Country,
    T_CountryOptions,
    T_DependentQuestion,
    T_DynamicFieldHandlers,
    T_GetFormResponse,
    T_Info,
    T_Question,
} from "~/types";
import { T_FormValue } from "components/types";
import { renderQuestion } from "./renderQuestion";
import { T_BeneficialOwnerLabels } from "components/BeneficialOwner";

function handleCountryOptions(
    field: T_CountryOptions,
    optionsToUse: { id: string; value: string }[],
    countryListOptions: T_Country[],
): { id: string; value: string }[] {
    if (field.useCountryList) {
        return countryListOptions.map((country) => ({
            id: country.id || "",
            value: country.value,
        }));
    }
    return optionsToUse;
}

function handleInfo(field: T_Info, dynamicComponents: React.ReactNode[]) {
    if (field.type === "tooltip") {
        dynamicComponents.push(
            <Tooltip key={`tooltip-${field.id}`} content={field.labelExplanation || ""} />,
        );
    } else if (field.type === "sublabel") {
        dynamicComponents.push(
            <p key={`sublabel-${field.id}`} className="sublabel">
                {field.labelExplanation}
            </p>,
        );
    }
}

function handleBeneficialOwner(
    field: T_BeneficialOwnerConfig,
    beneficialOwnerLabels: T_BeneficialOwnerLabels,
): T_BeneficialOwnerLabels {
    return {
        ...beneficialOwnerLabels,
        nameLabelText: field.nameLabelText,
        ssnLabelText: field.ssnLabelText,
        ownershipLabelText: field.ownershipLabelText,
        countryLabelText: field.countryLabelText,
        addBObutton: field.addBObutton,
        namePlaceholder: field.namePlaceholder,
        ssnPlaceholder: field.ssnPlaceholder,
        ownershipPlaceholder: field.ownershipPlaceholder,
        countryPlaceholder: field.countryPlaceholder,
    };
}

function handleDependentQuestion(
    field: T_DependentQuestion,
    formValues: Record<string, T_FormValue>,
    handleInputChange: (name: string, value: T_FormValue) => void,
    errors: Record<string, string | undefined>,
    countryListOptions: T_Country[],
    beneficialOwnerLabels: T_BeneficialOwnerLabels,
    parentValue: T_FormValue,
): React.ReactNode | null {
    const {
        conditionValue,
        questionParameter: depName,
        componentType: depType = "",
        questionLabel: depLabel = "",
        placeholder: depPlaceholder = "",
        options: depOptions = [],
        useCountryList: depUseCountryList = false,
    } = field;

    const depValue = formValues[depName] || "";
    const depError = errors[depName];

    let depOptionsToUse = depOptions?.map((option) => ({ id: option, value: option })) || [];

    if (depUseCountryList) {
        depOptionsToUse = countryListOptions.map((country) => ({
            id: country.id || "",
            value: country.value,
        }));
    }

    // Simplified condition check using the passed parentValue
    if (parentValue === conditionValue) {
        return (
            <div key={depName} className="mb-4">
                {renderQuestion(
                    depType,
                    depName,
                    depLabel,
                    depPlaceholder || "",
                    depOptionsToUse,
                    depValue,
                    handleInputChange,
                    depError,
                    countryListOptions,
                    beneficialOwnerLabels,
                    [], // No dynamicComponents for dependent questions
                )}
            </div>
        );
    }
    return null;
}

// Main function
export function processQuestions(
    questions: T_Question[],
    formValues: Record<string, T_FormValue>,
    handleInputChange: (questionParameter: string, value: T_FormValue) => void,
    errors: Record<string, string | undefined>,
) {
    const loaderData = useLoaderData<T_GetFormResponse>();
    const { countryList } = loaderData;

    const [countryListOptions, setCountryListOptions] = useState<T_Country[]>(
        countryList
            ? countryList.map((country) => ({
                  id: country.id,
                  value: country.name,
              }))
            : [],
    );
    useEffect(() => {
        if (countryList) {
            setCountryListOptions(
                countryList.map((country) => ({
                    id: country.id,
                    value: country.name,
                })),
            );
        }
    }, [countryList]);

    return questions.map((question) => {
        const {
            componentType = "",
            questionParameter = "",
            questionLabel = "",
            placeholder = "",
            options = [],
            dynamicField = [],
        } = question.rawData;

        const key = questionParameter || question.id.toString();
        const value = formValues[questionParameter] || "";
        const error = errors[questionParameter];

        let optionsToUse = options?.map((option) => ({ id: option, value: option })) || [];
        const dynamicComponents: React.ReactNode[] = [];
        let beneficialOwnerLabels: T_BeneficialOwnerLabels = {};
        const dependentQuestions: React.ReactNode[] = [];

        const dynamicFieldHandlers: T_DynamicFieldHandlers = {
            "kyc.country-options": (field) => {
                optionsToUse = handleCountryOptions(
                    field as T_CountryOptions,
                    optionsToUse,
                    countryListOptions,
                );
            },
            "kyc.info": (field) => {
                handleInfo(field as T_Info, dynamicComponents);
            },
            "kyc.beneficial-owner": (field) => {
                beneficialOwnerLabels = handleBeneficialOwner(
                    field as T_BeneficialOwnerConfig,
                    beneficialOwnerLabels,
                );
            },
        };

        dynamicField.forEach((field) => {
            const handler = dynamicFieldHandlers[field.__component];
            if (handler) {
                handler(field);
            } else if (field.__component === "kyc.dependent-question") {
                const dependentQuestionNode = handleDependentQuestion(
                    field as T_DependentQuestion,
                    formValues,
                    handleInputChange,
                    errors,
                    countryListOptions,
                    beneficialOwnerLabels,
                    value,
                );
                if (dependentQuestionNode) {
                    dependentQuestions.push(dependentQuestionNode);
                }
            } else {
                console.warn(`Unhandled dynamic field component: ${field.__component}`);
            }
        });

        // Render the main question
        const questionComponent = (
            <div key={key} className="mb-4">
                {renderQuestion(
                    componentType,
                    questionParameter,
                    questionLabel,
                    placeholder || "",
                    optionsToUse,
                    value,
                    handleInputChange,
                    error,
                    countryListOptions,
                    beneficialOwnerLabels,
                    dynamicComponents,
                )}
            </div>
        );

        return (
            <React.Fragment key={key}>
                {questionComponent}
                {dependentQuestions}
            </React.Fragment>
        );
    });
}
