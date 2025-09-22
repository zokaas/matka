import React from "react";
import {
    stepActiveLabelStyle,
    stepActiveStyle,
    stepCircleCompletedStyle,
    stepCircleStyle,
    stepContainerStyle,
    stepCountSyle,
    stepDoneStyle,
    stepLabelContainerStyle,
    stepLabelStyle,
} from "./styles";
import { T_StepProps } from "./types";
import { StepLabel } from "./StepLabel";
import { StepContainer } from "./StepContainer";
import { StepBadge } from "./StepBadge";

//const getDefaultClasses

export const Step: React.FC<T_StepProps> = ({
    activeStep,
    currentStep,
    label,
    styling,
}: T_StepProps) => {
    const isDone = activeStep > currentStep;
    const isActive = activeStep >= currentStep;

    const getClasses = (
        condition: boolean,
        classNameToCheck: string | undefined,
        addittionalClassName: string | undefined
    ): string | undefined => {
        let classNamesToReturn;

        if (classNameToCheck) classNamesToReturn = classNameToCheck;

        // check for additional clsses and condtion (true / false)
        // also do not add classNamesToReturn if undefined (if rule above didn't set it first)
        if (condition && addittionalClassName)
            classNamesToReturn = `${classNamesToReturn && classNamesToReturn} ${addittionalClassName}`;

        return classNamesToReturn;
    };

    return (
        <div className={stepContainerStyle}>
            <StepBadge
                defaultClasses={`${stepCircleStyle} ${isActive ? stepCircleCompletedStyle : ""}`}
                overridingClasses={getClasses(
                    isActive,
                    styling?.badge?.stepBadgeClasses,
                    styling?.badge?.stepBadgeCompletedClasses
                )}>
                {isDone ? (
                    <StepLabel
                        defaultClasses={stepDoneStyle}
                        overridingClasses={getClasses(
                            false,
                            styling?.badge?.stepCounterDoneStyles,
                            undefined
                        )}
                        label="L"
                    />
                ) : (
                    <StepLabel
                        defaultClasses={`${stepCountSyle} ${isActive ? stepActiveStyle : ""}`}
                        overridingClasses={getClasses(
                            isActive,
                            styling?.badge?.stepCounterClasses,
                            styling?.badge?.stepCounterActiveStyles
                        )}
                        label={`${currentStep}`}
                    />
                )}
            </StepBadge>
            <StepContainer
                defaultClasses={stepLabelContainerStyle}
                overridingClasses={styling?.label?.stepContainerClasses}>
                <StepLabel
                    defaultClasses={`${stepLabelStyle} ${isActive ? stepActiveLabelStyle : ""}`}
                    overridingClasses={getClasses(
                        isActive,
                        styling?.label?.stepLabelClasses,
                        styling?.label?.stepActiveLabelClasses
                    )}
                    label={label}
                />
            </StepContainer>
        </div>
    );
};
