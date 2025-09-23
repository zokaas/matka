import React, { useState } from "react";
import { Step } from "./Step";
import { stepsContainerStyle, stepsFilledLineStyle, stepsStyle } from "./styles";
import { StepContainer } from "./StepContainer";
import { T_StepsProps } from "./types";

export const Steps: React.FC<T_StepsProps> = ({ activeStep, steps, styling }) => {
    const totalSteps = steps.length;

    /* 
    Calculate the width of the progress line.
    If we increase or decrease steps, our progress line will not overflow or shorten than 
    steps container because of this formula.
    */
    const width = `${(100 / (totalSteps - 1)) * (activeStep - 1)}%`;

    return (
        <>
            <div className={stepsStyle}>
                <div className={stepsContainerStyle}>
                    {steps.map((step, index) => {
                        return (
                            <Step
                                currentStep={index + 1}
                                label={step.stepLabel}
                                key={step.stepName}
                                activeStep={activeStep}
                                styling={{
                                    badge: {
                                        stepBadgeCompletedClasses:
                                            styling?.badge?.stepBadgeCompletedClasses,
                                        stepCounterDoneStyles:
                                            styling?.badge?.stepCounterDoneStyles,
                                    },
                                    label: {
                                        stepContainerClasses: styling?.label?.stepContainerClasses,
                                        stepActiveLabelClasses:
                                            styling?.label?.stepActiveLabelClasses,
                                        stepLabelClasses: styling?.label?.stepLabelClasses,
                                    },
                                }}
                            />
                        );
                    })}
                    <StepContainer
                        defaultClasses={stepsFilledLineStyle}
                        overridingClasses={styling?.statusLine?.fillDone}
                        style={{ width: width }}
                    />
                </div>
            </div>
        </>
    );
};
