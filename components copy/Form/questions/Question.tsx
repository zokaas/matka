import React from "react";
import { Container } from "@ui/container";
import { DropDown, MultiSelect } from "@ui/dropdown";
import { Textarea } from "@ui/textarea";
import { Radiogroup } from "@ui/radiogroup";
import { Checkbox } from "@ui/checkbox";
import { E_ComponentTypes, T_QuestionProps } from "./types";
import {
    b2bRadiogroupRootStyle,
    b2bRadioIndicatorStyle,
    b2bRadioItemLabelStyle,
    b2bRadioItemStyle,
    questionsStyle,
} from "~/styles";
import { HiddenField, InputNumber, InputText } from "@ui/input";
import { BeneficialOwner, T_BeneficialOwnerCardProps } from "../beneficialOwner";
import { BO_MAX_COUNT, EMPTY_STRING } from "./questions.constants";
import { T_AnswerValue, T_QuestionData } from "~/types";

export const Question: React.FC<T_QuestionProps> = ({
    questionType,
    questionProps,
    question,
    countryList,
    currentValue,
}) => {
    // TODO: Maybe some better logic than question?. or question!. many times?
    const getFieldError = (fieldName: string): string | undefined => {
        return questionProps.validationErrors.get(fieldName);
    };

    if (questionType === E_ComponentTypes.SELECT) {
        const options = question?.useCountryList ? countryList : question?.options;

        return (
            <Container className={questionsStyle}>
                <DropDown
                    label={question?.questionLabel || ""}
                    infoItems={question?.infoItems || null}
                    fieldName={question!.questionParameter}
                    placeholder={question?.placeholder || ""}
                    options={options || []}
                    showSelectedItemIcon={true}
                    value={currentValue as string}
                    onChange={(selectedValue) => {
                        const option = options?.find(
                            (opt) => String(opt.value) === String(selectedValue)
                        );
                        questionProps.onChange(
                            question!.questionParameter,
                            selectedValue,
                            option?.text
                        );
                    }}
                    onBlur={() => questionProps.onBlur(question!.questionParameter)}
                    error={getFieldError(question!.questionParameter)}
                />
            </Container>
        );
    }

    if (questionType === E_ComponentTypes.MULTISELECT) {
        const options = question?.useCountryList ? countryList : question?.options;
        return (
            <Container className={questionsStyle}>
                <MultiSelect
                    label={question?.questionLabel || ""}
                    fieldName={question!.questionParameter}
                    placeholder={question?.placeholder || ""}
                    options={options || []}
                    searchEnabled={true}
                    value={currentValue as Array<string>}
                    onChange={(selectedArray: T_AnswerValue) => {
                        if (Array.isArray(selectedArray) && options) {
                            const selectedTexts = selectedArray
                                .map((v) => {
                                    const option = options.find(
                                        (opt) => String(opt.value) === String(v)
                                    );
                                    return option?.text;
                                })
                                .filter(Boolean);

                            const displayText =
                                selectedTexts.length > 0 ? selectedTexts.join(", ") : undefined;

                            questionProps.onChange(
                                question!.questionParameter,
                                selectedArray,
                                displayText
                            );
                        } else {
                            questionProps.onChange(question!.questionParameter, selectedArray);
                        }
                    }}
                    onBlur={() => questionProps.onBlur(question!.questionParameter)}
                    error={getFieldError(question!.questionParameter)}
                    infoItems={question?.infoItems || null}
                />
            </Container>
        );
    }
    if (questionType === E_ComponentTypes.TEXTAREA)
        return (
            <Container className={questionsStyle}>
                <Textarea
                    label={question?.questionLabel || ""}
                    fieldName={question!.questionParameter}
                    placeholder={question?.placeholder ? question.placeholder : undefined}
                    value={currentValue as string}
                    onChange={(e) => {
                        questionProps.onChange(question!.questionParameter, e as T_AnswerValue);
                    }}
                    onBlur={() => questionProps.onBlur(question!.questionParameter)}
                    error={getFieldError(question!.questionParameter)}
                    infoItems={question?.infoItems || null}
                />
            </Container>
        );

    if (questionType === E_ComponentTypes.RADIOGROUP)
        return (
            <Container className={questionsStyle}>
                <Radiogroup
                    fieldName={question!.questionParameter}
                    label={question?.questionLabel || ""}
                    onChange={(selectedValue) => {
                        const option = question?.options?.find(
                            (opt) => String(opt.value) === String(selectedValue)
                        );
                        questionProps.onChange(
                            question!.questionParameter,
                            selectedValue,
                            option?.text
                        );
                    }}
                    onBlur={() => questionProps.onBlur(question!.questionParameter)}
                    options={question?.options ?? []}
                    defaultValue={currentValue as string}
                    error={getFieldError(question!.questionParameter) || ""}
                    classNames={{
                        radioRoot: b2bRadiogroupRootStyle,
                        radioItemContainer: b2bRadiogroupRootStyle,
                        radioItem: b2bRadioItemStyle,
                        radioIndicator: b2bRadioIndicatorStyle,
                        radioLabel: b2bRadioItemLabelStyle,
                    }}
                    infoItems={question?.infoItems || null}
                />
            </Container>
        );

    if (questionType === E_ComponentTypes.TEXT)
        return (
            <Container className={questionsStyle}>
                <InputText
                    label={question?.questionLabel || ""}
                    fieldName={question!.questionParameter}
                    placeholder={question?.placeholder ? question.placeholder : undefined}
                    value={currentValue as string}
                    onChange={(e) => {
                        questionProps.onChange(question!.questionParameter, e as T_AnswerValue);
                    }}
                    onBlur={() => questionProps.onBlur(question!.questionParameter)}
                    error={getFieldError(question!.questionParameter) || ""}
                    infoItems={question?.infoItems || null}
                />
            </Container>
        );

    if (questionType === E_ComponentTypes.NUMBER)
        return (
            <Container className={questionsStyle}>
                <InputNumber
                    label={question?.questionLabel || ""}
                    fieldName={question!.questionParameter}
                    placeholder={question?.placeholder ? question.placeholder : undefined}
                    value={currentValue as string}
                    onChange={(e) => {
                        questionProps.onChange(question!.questionParameter, e as T_AnswerValue);
                    }}
                    onBlur={() => questionProps.onBlur(question!.questionParameter)}
                    error={getFieldError(question!.questionParameter) || ""}
                    infoItems={question?.infoItems || null}
                />
            </Container>
        );

    if (questionType === E_ComponentTypes.CHECKBOX) {
        return (
            <Container className={questionsStyle}>
                <Checkbox
                    label={question?.questionLabel || ""}
                    fieldName={question!.questionParameter}
                    checked={currentValue as boolean}
                    onChange={(checked) => {
                        questionProps.onChange(question!.questionParameter, checked);
                    }}
                    onBlur={() => questionProps.onBlur(question!.questionParameter)}
                    error={getFieldError(question!.questionParameter)}
                    infoItems={question?.infoItems || null}
                />
            </Container>
        );
    }

    if (questionType === E_ComponentTypes.HIDDENINPUT) {
        return (
            <HiddenField
                fieldName={question!.questionParameter}
                value={currentValue as string}
                onChange={(e) => {
                    questionProps.onChange(question!.questionParameter, e as T_AnswerValue);
                }}
                onBlur={() => questionProps.onBlur(question!.questionParameter)}
            />
        );
    }

    if (questionType === E_ComponentTypes.BENEFICIALOWNER) {
        const boQuestion = question as T_QuestionData;

        const boData: T_BeneficialOwnerCardProps = {
            addButton: boQuestion.addBObutton || EMPTY_STRING,
            fields: {
                name: {
                    parameter: boQuestion.nameParameter || EMPTY_STRING,
                    label: boQuestion.nameQuestion || EMPTY_STRING,
                    placeholder: boQuestion.namePlaceholder || EMPTY_STRING,
                },
                ssn: {
                    parameter: boQuestion.ssnParameter || EMPTY_STRING,
                    label: boQuestion.ssnQuestion || EMPTY_STRING,
                    placeholder: boQuestion.ssnPlaceholder || EMPTY_STRING,
                },
                ownership: {
                    parameter: boQuestion.ownershipParameter || EMPTY_STRING,
                    label: boQuestion.ownershipQuestion || EMPTY_STRING,
                    placeholder: boQuestion.ownershipPlaceholder || EMPTY_STRING,
                },
                country: {
                    parameter: boQuestion.countryParameter || EMPTY_STRING,
                    label: boQuestion.countryQuestion || EMPTY_STRING,
                    placeholder: boQuestion.countryPlaceholder || EMPTY_STRING,
                },
                pep: {
                    parameter: boQuestion.pepParameter || EMPTY_STRING,
                    label: boQuestion.pepQuestion || EMPTY_STRING,
                    placeholder: EMPTY_STRING,
                    options: boQuestion.pepOptions || [],
                },
            },
        };

        return (
            <Container className={questionsStyle}>
                <BeneficialOwner
                    beneficialOwnersMaxCount={
                        boQuestion.boMaxCount && boQuestion.boMaxCount > 0
                            ? boQuestion.boMaxCount
                            : BO_MAX_COUNT
                    }
                    fieldName={boQuestion.questionParameter}
                    label={boQuestion.questionLabel}
                    error={getFieldError(boQuestion.questionParameter)}
                    beneficialOwnerFieldsData={boData}
                    onChange={questionProps.onChange}
                    onBlur={() => questionProps.onBlur(boQuestion.questionParameter)}
                    countryList={questionProps.countryList || []}
                    infoItems={boQuestion.infoItems || null}
                    currentValue={currentValue}
                />
            </Container>
        );
    }

    return <Container className={questionsStyle}>Question type does not exist</Container>;
};
