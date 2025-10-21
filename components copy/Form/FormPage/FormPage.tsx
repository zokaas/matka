import React, { useState } from "react";
import { Form } from "react-router";

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
} from "~/styles";
import { Title } from "@ui/title";
import { CompanyInfo } from "../../companyInfo";
import { Container } from "@ui/container";
import { Button } from "@ui/button";
import { Icon } from "@ui/icon";
import { Questions } from "../questions/Questions";
import { Footer } from "@ui/footer";
import { T_AnswersMapValue, T_DependentQuestion, T_QuestionData } from "~/types";
import { useFormValidation } from "~/hooks/useFormValidation";

export const FormPage: React.FC<T_FormPageProps> = (props: T_FormPageProps) => {
    const { formData, generalData } = props;

    const [formValues, setFormValues] = useState(formData.answers);
    const [activeStep, setActiveStep] = useState(1);
    
    // Initialize validation system
    const {
        validationErrors,
        validateSingleField,
        validateEntireForm,
        clearFieldError,
        getFieldError
    } = useFormValidation(formData);

    /**
     * Handle field value changes with real-time validation
     */
    const handleChange = (field: string, value: T_AnswersMapValue) => {
        // Update form values
        setFormValues(prev => {
            const updated = new Map(prev);
            updated.set(field, value);
            
            // Check if this field change affects any dependent questions
            const currentStepName = getCurrentStepName(activeStep - 1);
            const currentQuestions = formData.steps.get(currentStepName as any);
            
            if (currentQuestions) {
                currentQuestions.forEach(question => {
                    if (question.question.questionParameter === field && question.question.dependentQuestion) {
                        const depQuestion = question.question.dependentQuestion;
                        const depFieldName = `${field}::${depQuestion.questionParameter}`;
                        
                        // Check if dependent question should be visible with new value
                        const shouldShow = String(depQuestion.conditionValue) === String(value);
                        
                        if (!shouldShow) {
                            // Clear the dependent question value and error
                            updated.set(depFieldName, "");
                            clearFieldError(depFieldName);
                        }
                    }
                });
            }
            
            return updated;
        });

        // Clear existing error when user starts typing
        if (getFieldError(field)) {
            clearFieldError(field);
        }

        // Real-time validation for onChange
        // Only validate if field has a value (to avoid showing errors immediately)
        if (value && String(value).trim().length > 0) {
            validateSingleField(field, value);
        }
    };

    /**
     * Handle field blur events with validation
     */
    const handleOnBlur = (field: string) => {
        const value = formValues.get(field);
        validateSingleField(field, value);
    };

    /**
     * Validate current step before proceeding to next step
     */
    const validateCurrentStep = (): boolean => {
        const currentStepName = getCurrentStepName(activeStep - 1);
        const currentQuestions = formData.steps.get(currentStepName as any);
        
        if (!currentQuestions) return true;

        let stepIsValid = true;
        
        // Validate all fields in current step
        currentQuestions.forEach(question => {
            const { questionParameter } = question.question;
            const value = formValues.get(questionParameter);
            
            // Validate main question
            const isValid = validateSingleField(questionParameter, value);
            if (!isValid) stepIsValid = false;
            
            // Validate dependent question if it should be visible
            if (question.question.dependentQuestion) {
                const depQuestion = question.question.dependentQuestion;
                const shouldShowDependent = isDependentQuestionVisible(
                    depQuestion,
                    question.question,
                    formValues
                );
                
                if (shouldShowDependent) {
                    const depFieldName = `${questionParameter}::${depQuestion.questionParameter}`;
                    const depValue = formValues.get(depFieldName);
                    const depIsValid = validateSingleField(depFieldName, depValue);
                    if (!depIsValid) stepIsValid = false;
                }
            }
        });
        
        return stepIsValid;
    };

    /**
     * Handle form submission with full validation
     */
    const handleSubmit = () => {
        const validationResult = validateEntireForm(formValues);
        
        if (!validationResult.isValid) {
            console.log("Form has validation errors:", validationResult.errors);
            
            if (validationResult.firstErrorField) {
                const element = document.getElementById(validationResult.firstErrorField);
                element?.focus();
            }
            
            return;
        }
        console.log("Form is valid, submitting:", formValues);
        // Implementation for actual form submission logic would go here
    };

    /**
     * Navigate to next step with validation
     */
    const nextStep = () => {
        if (!validateCurrentStep()) {
            console.log("Current step has validation errors");
            return;
        }
        
        if (activeStep < formData.generalFormData.steps.length) {
            setActiveStep(activeStep + 1);
        }
    };

    /**
     * Navigate to previous step
     */
    const prevStep = () => {
        if (activeStep > 1) {
            setActiveStep(activeStep - 1);
        }
    };

    /**
     * Get current step name by index
     */
    const getCurrentStepName = (activeStepIndex: number): string =>
        formData.generalFormData.steps[activeStepIndex].stepName;

    /**
     * Check if dependent question should be visible
     */
    const isDependentQuestionVisible = (
        dependentQuestion: T_DependentQuestion,
        currentQuestion: T_QuestionData,
        formValues: Map<string, T_AnswersMapValue>
    ): boolean => {
        if (!dependentQuestion) return false;
        
        const currentQuestionValue = formValues.get(currentQuestion.questionParameter);
        return String(dependentQuestion.conditionValue) === String(currentQuestionValue);
    };

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
                
                <Form
                    method="post"
                    className="max-w-2xl mx-auto"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                    
                    {/* Progress Steps */}
                    <div className="mb-12">
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
                    </div>
                    
                    {/* Divider */}
                    <hr className="border-base-300 mb-6" />
                    
                    {/* Company info */}
                    {activeStep === 1 && (
                        <CompanyInfo
                            companyName={generalData.companyName}
                            companyNameLabel={formData.generalFormData.companyBlock.companyName}
                            orgNumber={generalData.orgNumber}
                            orgNumberLabel={formData.generalFormData.companyBlock.orgNumber}
                        />
                    )}
                    
                    {/* Questions Container */}
                    <Container className={formQuestionsContainer}>
                        <Questions
                            questions={formData.steps}
                            formValues={formValues}
                            onChange={handleChange}
                            onBlur={handleOnBlur}
                            validationErrors={validationErrors}
                            activeStep={activeStep}
                            countryList={formData.countryList}
                            activeStepName={getCurrentStepName(activeStep - 1)}
                        />
                    </Container>
                    
                    {/* Navigation Buttons */}
                    <div className="mt-12 flex justify-between">
                        <Button
                            label={[
                                <Icon iconName="chevron-left" iconPrefix="far" key="arrow-1" />,
                                ` ${formData.generalFormData.button.back}`,
                            ]}
                            onClick={prevStep}
                            type="button"
                            disabled={activeStep === 1}
                        />
                        
                        {activeStep === formData.generalFormData.steps.length ? (
                            <Button
                                label={formData.generalFormData.button.submit}
                                onClick={handleSubmit}
                                type="button"
                            />
                        ) : (
                            <Button
                                label={[
                                    `${formData.generalFormData.button.next} `,
                                    <Icon iconName="chevron-right" iconPrefix="far" key="arrow-2" />,
                                ]}
                                onClick={nextStep}
                                type="button"
                            />
                        )}
                    </div>
                    

                </Form>
            </Container>
            
            <Footer footer={formData.generalFormData.footer} />
        </main>
    );
};