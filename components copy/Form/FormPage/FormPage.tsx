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
import { T_AnswersMapValue } from "~/types";
import { useFormValidation } from "~/hooks/useFormValidation";

export const FormPage: React.FC<T_FormPageProps> = (props: T_FormPageProps) => {
    const { formData, generalData } = props;

    const [formValues, setFormValues] = useState(formData.answers);
    const [activeStep, setActiveStep] = useState(1);
    
    const {
        validationErrors,
        validateSingleField,
        validateEntireForm,
        clearFieldError,
        getFieldError,
        isVisible
    } = useFormValidation(formData);

    const handleChange = React.useCallback((field: string, value: T_AnswersMapValue) => {
        setFormValues(prev => {
            const updated = new Map(prev);
            updated.set(field, value);
            
            const currentStepName = getCurrentStepName(activeStep - 1);
            const currentQuestions = formData.steps.get(currentStepName as any);
            
            if (currentQuestions) {
                currentQuestions.forEach(question => {
                    if (question.question.questionParameter === field && question.question.dependentQuestion) {
                        const depQuestion = question.question.dependentQuestion;
                        const depFieldName = `${field}::${depQuestion.questionParameter}`;
                        
                        const shouldShow = isVisible(depFieldName, updated);
                        
                        if (!shouldShow) {
                            updated.set(depFieldName, "");
                            clearFieldError(depFieldName);
                        }
                    }
                });
            }
            
            return updated;
        });

        if (getFieldError(field)) {
            clearFieldError(field);
        }

        if (value && String(value).trim().length > 0) {
            validateSingleField(field, value);
        }
    }, [activeStep, formData, isVisible, clearFieldError, getFieldError, validateSingleField]);
    
    const handleOnBlur = (field: string) => {
        const value = formValues.get(field);
        validateSingleField(field, value);
    };

    const validateCurrentStep = (): boolean => {
        const currentStepName = getCurrentStepName(activeStep - 1);
        const currentQuestions = formData.steps.get(currentStepName as any);
        
        if (!currentQuestions) return true;

        let stepIsValid = true;
        
        currentQuestions.forEach(question => {
            const { questionParameter } = question.question;
            const value = formValues.get(questionParameter);
            
            const isValid = validateSingleField(questionParameter, value);
            if (!isValid) stepIsValid = false;
            
            if (question.question.dependentQuestion) {
                const depQuestion = question.question.dependentQuestion;
                const depFieldName = `${questionParameter}::${depQuestion.questionParameter}`;
                
                if (isVisible(depFieldName, formValues)) {
                    const depValue = formValues.get(depFieldName);
                    const depIsValid = validateSingleField(depFieldName, depValue);
                    if (!depIsValid) stepIsValid = false;
                }
            }
        });
        
        return stepIsValid;
    };

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
        // TODO: Implement actual form submission logic
    };

    const nextStep = () => {
        if (!validateCurrentStep()) {
            console.log("Current step has validation errors");
            return;
        }
        
        if (activeStep < formData.generalFormData.steps.length) {
            setActiveStep(activeStep + 1);
        }
    };

    const prevStep = () => {
        if (activeStep > 1) {
            setActiveStep(activeStep - 1);
        }
    };

    const getCurrentStepName = (activeStepIndex: number): string =>
        formData.generalFormData.steps[activeStepIndex].stepName;

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
                    {/* TODO: Divider should / could be own component (div perhaps). E.g. div -> Divider */}
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
                    
                    <div className="mt-12 flex justify-between">
                        <Button
                            label={[
                                <Icon iconName="chevron-left" iconPrefix="far" key="arrow-1" />,
                                ` ${formData.generalFormData.button.back}`,
                            ]}
                            onClick={prevStep}
                            type="button"
                            className=""
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