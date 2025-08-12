import React from "react";
import { Input, RadioGroup, Select, MultiSelectDropdown, Textarea } from "@ui-components/index";
import { T_Country } from "~/types";
import { T_FormValue } from "components/types";
import {
    BeneficialOwnerForm,
    T_BeneficialOwner,
    T_BeneficialOwnerLabels,
} from "components/BeneficialOwner";

export function renderQuestion(
    componentType: string,
    questionParameter: string,
    questionLabel: string,
    placeholder: string,
    options: { id: string; value: string }[],
    value: T_FormValue,
    handleInputChange: (name: string, value: T_FormValue) => void,
    error: string | undefined,
    countryListOptions: T_Country[],
    beneficialOwnerLabels?: T_BeneficialOwnerLabels,
    dynamicComponents?: React.ReactNode[],
) {
    // Create label with dynamic components (like tooltips)
    const labelWithComponents = (
        <span className="flex items-center">
            {questionLabel}
            {dynamicComponents && dynamicComponents.length > 0 && (
                <span className="ml-2">{dynamicComponents}</span>
            )}
        </span>
    );

    switch (componentType) {
        case "Textarea":
            return (
                <Textarea
                    name={questionParameter}
                    label={labelWithComponents}
                    placeholder={placeholder}
                    value={value as string}
                    onChange={(newValue: string) => handleInputChange(questionParameter, newValue)}
                    errorMessage={error}
                />
            );

        case "Text":
        case "Number":
            return (
                <Input
                    name={questionParameter}
                    label={labelWithComponents}
                    placeholder={placeholder}
                    value={value as string}
                    onChange={(newValue: string) => handleInputChange(questionParameter, newValue)}
                    type={componentType === "Number" ? "number" : "text"}
                    errorMessage={error}
                />
            );

        case "RadioGroup":
            return (
                <RadioGroup
                    name={questionParameter}
                    label={labelWithComponents}
                    options={options}
                    selectedValue={value as string}
                    onChange={(newValue: string) => handleInputChange(questionParameter, newValue)}
                    errorMessage={error}
                />
            );

        case "Select":
            return (
                <Select
                    name={questionParameter}
                    label={labelWithComponents}
                    options={options}
                    placeholder={placeholder}
                    selectedValue={value as string}
                    onChange={(newValue: string) => handleInputChange(questionParameter, newValue)}
                    errorMessage={error}
                />
            );

        case "MultiSelectDropdown":
            return (
                <MultiSelectDropdown
                    name={questionParameter}
                    label={labelWithComponents}
                    options={options}
                    selectedOptions={Array.isArray(value) ? value.map(String) : []}
                    onChange={(newSelected: string[]) =>
                        handleInputChange(questionParameter, newSelected)
                    }
                    errorMessage={error}
                    placeholder={placeholder}
                />
            );

        case "BeneficialOwner":
            return (
                <BeneficialOwnerForm
                    name={questionParameter}
                    label={labelWithComponents}
                    beneficialOwners={
                        Array.isArray(value) && value.every((v) => typeof v === "object")
                            ? (value as T_BeneficialOwner[])
                            : []
                    }
                    setBeneficialOwner={(owners) => handleInputChange(questionParameter, owners)}
                    countryList={countryListOptions}
                    errorMessage={error}
                    beneficialOwnerLabels={beneficialOwnerLabels}
                />
            );

        default:
            console.warn("Unhandled question type:", componentType);
            return null;
    }
}
