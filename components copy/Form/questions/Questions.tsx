import React, { ReactNode } from "react";
import { E_ComponentTypes, T_QuestionsProps } from "./types";
import { T_DependentQuestion, T_FormStepsKeys, T_QuestionData } from "~/types";
import { Question } from "./Question";
import { isCountryListUsed } from "~/utils";

export const Questions: React.FC<T_QuestionsProps> = (props: T_QuestionsProps) => {
    const { activeStepName, questions, countryList, formValues } = props;
    const currentSteps = questions.get(activeStepName as T_FormStepsKeys);

    const isDependantQuestionVisible = (
        dependantQuestion: T_DependentQuestion,
        currentQuestion: T_QuestionData
    ) => {
        if (!dependantQuestion) return false;

        const currentQuestionValue = formValues.get(currentQuestion.questionParameter);

        if (`${dependantQuestion.conditionValue}` === `${currentQuestionValue?.answer}`)
            return true;

        return false;
    };

    /* 
        next: we are going through questions and invoking question component 
        This is due to dynamic fields to avoid iterating over array inside array
    */
    const questionArray: ReactNode = currentSteps?.map((item) => {
        const includeCountryListProperty = isCountryListUsed(item);

        const dependentFieldName = item.question.dependentQuestion 
            ? `${item.question.questionParameter}::${item.question.dependentQuestion.questionParameter}`
            : null;

        return (
            <React.Fragment key={item.id}>
                <Question
                    questionType={item.question.componentType as E_ComponentTypes}
                    questionProps={props}
                    question={item.question}
                    countryList={includeCountryListProperty ? countryList : undefined}
                />
                {isDependantQuestionVisible(item.question.dependentQuestion, item.question) && 
                 item.question.dependentQuestion && dependentFieldName && (
                    <Question
                        questionType={
                            item.question.dependentQuestion.componentType as E_ComponentTypes
                        }
                        questionProps={props}
                        question={{
                            ...item.question.dependentQuestion,
                            questionParameter: dependentFieldName
                        }}
                        key={dependentFieldName}
                        countryList={
                            item.question.dependentQuestion.useCountryList
                                ? countryList
                                : undefined
                        }
                    />
                )}
            </React.Fragment>
        );
    });

    return <>{questionArray}</>;
};