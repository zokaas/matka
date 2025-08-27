import React, { ReactNode, useState } from "react";
import { E_ComponentTypes, T_QuestionsProps } from "./types";
import { T_FormStepsKeys } from "~/types";
import { Question } from "./Question";

export const Questions: React.FC<T_QuestionsProps> = (props: T_QuestionsProps) => {
    const { activeStep, activeStepName, questions } = props;
    const currentSteps = questions.get(activeStepName as T_FormStepsKeys);
    /* 
        next: we are going through questions and invoking question component 
        This is due to dynamic fields to avoid iterating over array inside array
    */

    const [tempRadio, setTempRadio] = useState("");

    const questionArray: ReactNode = currentSteps?.map((item) => {
        return (
            <>
                <Question
                    questionType={item.question.componentType as E_ComponentTypes}
                    questionProps={props}
                    question={item.question}
                    key={item.id}
                />
            </>
        );
    });

    return (
        <>
            <div>{questionArray}</div>
            {activeStep === 3 &&
                currentSteps?.map((item) => (
                    <pre key={item.id + 200}>
                        {item.id} {item.question.componentType} {item.question.placeholder}
                    </pre>
                ))}
        </>
    );
};
