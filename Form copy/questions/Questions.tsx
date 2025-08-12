import React, { ReactNode } from "react";
import { E_ComponentTypes, T_QuestionsProps } from "./types";
import { T_FormStepsKeys } from "~/types";
import { DropDown } from "@ui/dropdown";
import { Textarea } from "@ui/textarea";
import { questionsStyle, textareaBoxStyle } from "~/styles";
import { Container } from "@ui-components/Container";

export const Questions: React.FC<T_QuestionsProps> = ({
    questions,
    activeStepName,
    activeStep,
    onBlur,
    onChange,
    /*     formValues,
    countryList,
    validationErrors, */
}) => {
    console.log(activeStep, activeStepName);

    const currentSteps = questions.get(activeStepName as T_FormStepsKeys);
    console.log("current page questions");
    console.log(currentSteps);

    const mockedOptions = [
        { id: "asd", value: "ASD" },
        { id: "foo", value: "FOO" },
        { id: "bar", value: "BAR" },
    ];
console.log(validationErrors)
    const questionArray: ReactNode = currentSteps?.map((item) => (
        <>
            {item.question.componentType === E_ComponentTypes.SELECT && (
                <Container className={questionsStyle}>
                    <DropDown
                        label={item.question.questionLabel}
                        fieldName={item.question.questionParameter}
                        key={item.id}
                        placeholder={item.question.placeholder}
                        options={item.question.options}
                        onChange={(e) => {
                            onChange(item.question.questionParameter, e);
                        }}
                        onBlur={() => onBlur(item.question.questionParameter)}
                        error={validationErrors[item.question.questionParameter]}
                    />
                </Container>
            )}
            {item.question.componentType === E_ComponentTypes.TEXTAREA && (
                <Container className={questionsStyle}>
                    <Textarea
                        label={item.question.questionLabel}
                        fieldName={item.question.questionParameter}
                        key={item.id}
                        placeholder={
                            item.question.placeholder ? item.question.placeholder : undefined
                        }
                        onChange={(e) => {
                            onChange(item.question.questionParameter, e);
                        }}
                        onBlur={() => onBlur(item.question.questionParameter)}
                        className={textareaBoxStyle}
                    />
                </Container>
            )}
        </>
    ));

    return (
        <>
            <div>{questionArray}</div>
            {activeStep !== 1 &&
                currentSteps?.map((item) => (
                    <pre key={item.id + 200}>
                        {item.id} {item.question.componentType} {item.question.placeholder}
                    </pre>
                ))}
        </>
    );
};
