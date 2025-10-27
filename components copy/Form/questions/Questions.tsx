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

        const currentQuestionAnswer = formValues.get(currentQuestion.questionParameter);
        

        const answerStr = String(currentQuestionAnswer?.answer);
        const conditionStr = String(dependantQuestion.conditionValue);
        
        const isVisible = answerStr === conditionStr;

        return isVisible;
    };

    /* 
        next: we are going through questions and invoking question component 
        This is due to dynamic fields to avoid iterating over array inside array
    */
    const questionArray: ReactNode = currentSteps?.map((item) => {
        const includeCountryListProperty = isCountryListUsed(item);

        const hasDependentQuestion = !!item.question.dependentQuestion;
        const showDependentQuestion = hasDependentQuestion 
            ? isDependantQuestionVisible(item.question.dependentQuestion, item.question)
            : false;

        return (
            <React.Fragment key={item.id}>
                <Question
                    questionType={item.question.componentType as E_ComponentTypes}
                    questionProps={props}
                    question={item.question}
                    key={item.id}
                    countryList={includeCountryListProperty ? countryList : undefined}
                />
                {showDependentQuestion && item.question.dependentQuestion && (
                    <Question
                        questionType={
                            item.question.dependentQuestion.componentType as E_ComponentTypes
                        }
                        questionProps={props}
                        question={item.question.dependentQuestion}
                        key={`dependent-${item.question.dependentQuestion.id}`}
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