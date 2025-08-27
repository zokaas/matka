import React from "react";
import { Container } from "@ui/container";
import { DropDown, MultiSelect } from "@ui/dropdown";
import { Textarea } from "@ui/textarea";
import { Radiogroup } from "@ui/radiogroup";
import { E_ComponentTypes, T_QuestionProps } from "./types";
import {
    b2bRadiogroupRootStyle,
    b2bRadioIndicatorStyle,
    b2bRadioItemLabelStyle,
    b2bRadioItemStyle,
    questionsStyle,
} from "~/styles";
import { InputNumber, InputText } from "@ui/inputField";

export const Question: React.FC<T_QuestionProps> = ({ questionType, questionProps, question }) => {
    console.log("=== QUESTION ===");
    console.log(questionType);
    console.log(questionProps);
    console.log(question);
    console.log(question.dynamicField);
    if (questionType === E_ComponentTypes.SELECT)
        return (
            <Container className={questionsStyle}>
                <DropDown
                    label={question.questionLabel}
                    fieldName={question.questionParameter}
                    placeholder={question.placeholder}
                    options={question.options}
                    showSelectedItemIcon={true}
                    onChange={(e) => {
                        questionProps.onChange(question.questionParameter, e);
                    }}
                    onBlur={() => questionProps.onBlur(question.questionParameter)}
                    error={questionProps.validationErrors[question.questionParameter]}
                />
            </Container>
        );

if (questionType === E_ComponentTypes.MULTISELECT)
    return (
        <Container className={questionsStyle}>
            <MultiSelect
                label={question.questionLabel}
                fieldName={question.questionParameter}
                placeholder={question.placeholder}
                options={question.options}
    onChange={(selectedArray) => {
        questionProps.onChange(question.questionParameter, selectedArray);
    }}
                onBlur={() => questionProps.onBlur(question.questionParameter)}
                error={questionProps.validationErrors[question.questionParameter]}
            />
        </Container>
    );

    if (questionType === E_ComponentTypes.TEXTAREA)
        return (
            <Container className={questionsStyle}>
                <Textarea
                    label={question.questionLabel}
                    fieldName={question.questionParameter}
                    placeholder={question.placeholder ? question.placeholder : undefined}
                    onChange={(e) => {
                        questionProps.onChange(question.questionParameter, e);
                    }}
                    onBlur={() => questionProps.onBlur(question.questionParameter)}
                    error={questionProps.validationErrors[question.questionParameter]}
                />
            </Container>
        );

    if (questionType === E_ComponentTypes.RADIOGROUP)
        return (
            <Container className={questionsStyle}>
                <Radiogroup
                    fieldName={question.questionParameter}
                    label={question.questionLabel}
                    onChange={(e) => {
                        questionProps.onChange(question.questionParameter, e);
                    }}
                    options={question.options ? question.options : []}
                    defaultValue=""
                    classNames={{
                        radioRoot: b2bRadiogroupRootStyle,
                        radioItemContainer: b2bRadiogroupRootStyle,
                        radioItem: b2bRadioItemStyle,
                        radioIndicator: b2bRadioIndicatorStyle,
                        radioLabel: b2bRadioItemLabelStyle,
                    }}
                />
            </Container>
        );

    if (questionType === E_ComponentTypes.TEXT)
        return (
            <Container className={questionsStyle}>
                <InputText
                    label={question.questionLabel}
                    fieldName={question.questionParameter}
                    placeholder={question.placeholder ? question.placeholder : undefined}
                    onChange={(e) => {
                        questionProps.onChange(question.questionParameter, e);
                    }}
                    onBlur={() => questionProps.onBlur(question.questionParameter)}
                    error={questionProps.validationErrors[question.questionParameter]}
                />
            </Container>
        );

    if (questionType === E_ComponentTypes.NUMBER)
        return (
            <Container className={questionsStyle}>
                <InputNumber
                    label={question.questionLabel}
                    fieldName={question.questionParameter}
                    placeholder={question.placeholder ? question.placeholder : undefined}
                    onChange={(e) => {
                        questionProps.onChange(question.questionParameter, e);
                    }}
                    onBlur={() => questionProps.onBlur(question.questionParameter)}
                    error={questionProps.validationErrors[question.questionParameter]}
                />
            </Container>
        );

    return <Container className={questionsStyle}>Question type does not exist</Container>;
};
