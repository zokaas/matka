import React, { useState } from "react";
import { Form, useSubmit, useNavigation } from "react-router";

import { Steps } from "@ui/steps";
import { T_FormPageProps } from "./types";
import {
    badgeActiveStyle,
    formQuestionsContainer,
    formTitleStyle,
    labelActiveStyle,
    labelStyle,
    mainContainerStyle,
    mainContentStyle,
    progressLineActiveStyle,
    subtitleStyle,
    titleStyle,
    stepsWrapperStyle,
    dividerStyle,
    buttonContainerStyle,
    singleButtonContainerStyle,
} from "~/styles";
import { Title } from "@ui/title";
import { CompanyInfo } from "../../companyInfo";
import { Container } from "@ui/container";
import { Button } from "@ui/button";
import { Icon } from "@ui/icon";
import { Questions } from "../questions/Questions";
import { Footer } from "@ui/footer";
import { T_AnswerValue } from "~/types";
import { submitFormAnswers } from "~/services/utils/submitFormAnswers";
import { useFormValidation } from "~/hooks/useFormValidation";

export const FormPage: React.FC<T_FormPageProps> = (props: T_FormPageProps) => {
    const { formData } = props;
    const submit = useSubmit();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    // ✅ State persists across step changes
    const [formValues, setFormValues] = useState(formData.answers);
    const [activeStep, setActiveStep] = useState(1);
    const formRef = React.useRef<HTMLFormElement>(null);

    // ✅ Use the validation hook - manages validation errors as a Map
    const {
        validationErrors, // Map<string, string>
        validateSingleField,
        validateEntireForm,
        clearFieldError,
        isVisible,
    } = useFormValidation(formData);

    const handleChange = (field: string, value: T_AnswerValue) => {
        // Update form values (state persists)
        setFormValues((prev) => {
            const updated = new Map(prev);
            const existingEntry = updated.get(field);
            if (existingEntry) {
                updated.set(field, {
                    ...existingEntry,
                    answer: value,
                });
            }
            return updated;
        });

        // Clear error when user starts typing
        clearFieldError(field);
    };

    const handleOnBlur = (field: string) => {
        // Validate field on blur
        const currentValue = formValues.get(field);
        validateSingleField(field, currentValue?.answer);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validate entire form before submission
        const validationResult = validateEntireForm(
            new Map(Array.from(formValues.entries()).map(([key, obj]) => [key, obj.answer]))
        );

        if (!validationResult.isValid) {
            console.warn(`Form has ${validationResult.errors.size} validation errors`);
            
            // Optionally scroll to first error
            if (validationResult.firstErrorField) {
                const errorElement = document.querySelector(
                    `[name="${validationResult.firstErrorField}"]`
                );
                errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        // Submit if valid
        submitFormAnswers(formValues, String(formData.id), submit);
    };

    const getCurrentStepName = (activeStepIndex: number): string =>
        formData.generalFormData.steps[activeStepIndex].stepName;

    const validateCurrentStep = (): boolean => {
        // Get current step's field names
        const currentStepName = getCurrentStepName(activeStep - 1);
        const currentStepQuestions = formData.steps.get(currentStepName);
        
        if (!currentStepQuestions) return true;

        let hasErrors = false;

        // Validate each field in current step
        currentStepQuestions.forEach((questionItem) => {
            const fieldName = questionItem.question.questionParameter;
            
            // Only validate if field is visible
            if (isVisible(fieldName, new Map(Array.from(formValues.entries()).map(([k, v]) => [k, v.answer])))) {
                const currentValue = formValues.get(fieldName);
                const isValid = validateSingleField(fieldName, currentValue?.answer);
                
                if (!isValid) {
                    hasErrors = true;
                }
            }

            // Also validate dependent questions if they exist
            if (questionItem.question.dependentQuestion) {
                const depFieldName = `${fieldName}::${questionItem.question.dependentQuestion.questionParameter}`;
                
                if (isVisible(depFieldName, new Map(Array.from(formValues.entries()).map(([k, v]) => [k, v.answer])))) {
                    const depValue = formValues.get(depFieldName);
                    const isValid = validateSingleField(depFieldName, depValue?.answer);
                    
                    if (!isValid) {
                        hasErrors = true;
                    }
                }
            }
        });

        return !hasErrors;
    };

    const nextStep = () => {
        if (isLastStep) {
            // On final step, validate entire form and submit
            formRef.current?.requestSubmit();
        } else {
            // Validate current step before moving forward
            const isStepValid = validateCurrentStep();
            
            if (isStepValid) {
                setActiveStep(activeStep + 1);
            } else {
                console.warn("Please fix errors before proceeding");
            }
        }
    };

    const prevStep = () => {
        // No validation when going back
        setActiveStep(activeStep - 1);
    };

    const isLastStep = activeStep === formData.generalFormData.steps.length;
    const isFirstStep = activeStep === 1;

    return (
        <main className={mainContentStyle}>
            <Container className={mainContainerStyle}>
                {/* Header */}
                <Title
                    title={formData.generalFormData.formHeader.title}
                    subtitle={formData.generalFormData.formHeader.subtitle}
                    className={formTitleStyle}
                    titleClassName={titleStyle}
                    subtitleClassName={subtitleStyle}
                />
                <Form ref={formRef} method="post" onSubmit={handleFormSubmit}>
                    {/* Progress Steps */}
                    <Container className={stepsWrapperStyle}>
                        <Steps
                            steps={formData.generalFormData.steps}
                            activeStep={activeStep}
                            styling={{
                                badge: { stepBadgeCompletedClasses: badgeActiveStyle },
                                statusLine: { fillDone: progressLineActiveStyle },
                                label: {
                                    stepActiveLabelClasses: labelActiveStyle,
                                    stepLabelClasses: labelStyle,
                                },
                            }}
                        />
                    </Container>
                    
                    <hr className={dividerStyle} />
                    
                    {/* Company info */}
                    {activeStep === 1 && (
                        <CompanyInfo
                            companyName={formData.generalFormData.companyBlock.companyName}
                            companyNameLabel="Company name label"
                            orgNumber={formData.generalFormData.companyBlock.orgNumber}
                            orgNumberLabel="Org number label"
                        />
                    )}
                    
                    <Container className={formQuestionsContainer}>
                        <Questions
                            questions={formData.steps}
                            formValues={formValues}
                            onChange={(fieldName: string, value: T_AnswerValue) =>
                                handleChange(fieldName, value)
                            }
                            onBlur={(fieldName: string) => handleOnBlur(fieldName)}
                            validationErrors={validationErrors} // ✅ Now passing Map
                            activeStep={activeStep}
                            countryList={formData.countryList}
                            activeStepName={getCurrentStepName(activeStep - 1)}
                        />
                    </Container>

                    <Container
                        className={isFirstStep ? singleButtonContainerStyle : buttonContainerStyle}>
                        {!isFirstStep && (
                            <Button
                                label={[
                                    <Icon iconName="chevron-left" iconPrefix="far" key="arrow-1" />,
                                    ` ${formData.generalFormData.button.back}`,
                                ]}
                                onClick={() => prevStep()}
                                type="button"
                                disabled={isSubmitting}
                            />
                        )}
                        <Button
                            label={[
                                `${isLastStep ? formData.generalFormData.button.submit : formData.generalFormData.button.next} `,
                                <Icon iconName="chevron-right" iconPrefix="far" key="arrow-2" />,
                            ]}
                            onClick={() => nextStep()}
                            type="button"
                            disabled={isSubmitting}
                        />
                    </Container>
                </Form>
            </Container>
            <Footer footer={formData.generalFormData.footer} />
        </main>
    );
};