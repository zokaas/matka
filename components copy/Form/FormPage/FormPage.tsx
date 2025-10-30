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

    const [formValues, setFormValues] = useState(formData.answers);
    const [activeStep, setActiveStep] = useState(1);
    const formRef = React.useRef<HTMLFormElement>(null);

    const {
        validationErrors,
        validateSingleField,
        validateEntireForm,
        clearFieldError,
        isVisible,
    } = useFormValidation(formData);

    const handleChange = (field: string, value: T_AnswerValue) => {
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

        clearFieldError(field);
    };

    const handleOnBlur = (field: string) => {
        const currentValue = formValues.get(field);
        
        // Only validate if field is visible
        const formValuesMap = new Map(
            Array.from(formValues.entries()).map(([k, v]) => [k, v.answer])
        );
        
        if (isVisible(field, formValuesMap)) {
            validateSingleField(field, currentValue?.answer);
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const validationResult = validateEntireForm(
            new Map(Array.from(formValues.entries()).map(([key, obj]) => [key, obj.answer]))
        );

        if (!validationResult.isValid) {
            console.warn(`Form has ${validationResult.errors.size} validation errors`);
            
            if (validationResult.firstErrorField) {
                const errorElement = document.querySelector(
                    `[name="${validationResult.firstErrorField}"]`
                );
                errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        submitFormAnswers(formValues, String(formData.id), submit);
    };

    const getCurrentStepName = (activeStepIndex: number): string =>
        formData.generalFormData.steps[activeStepIndex].stepName;

    const validateCurrentStep = (): boolean => {
        const currentStepName = getCurrentStepName(activeStep - 1);
        const currentStepQuestions = formData.steps.get(currentStepName);
        
        if (!currentStepQuestions) return true;

        let hasErrors = false;
        const formValuesMap = new Map(
            Array.from(formValues.entries()).map(([k, v]) => [k, v.answer])
        );

        currentStepQuestions.forEach((questionItem) => {
            const fieldName = questionItem.question.questionParameter;
            
            // Only validate if visible
            if (isVisible(fieldName, formValuesMap)) {
                const currentValue = formValues.get(fieldName);
                const isValid = validateSingleField(fieldName, currentValue?.answer);
                
                if (!isValid) {
                    hasErrors = true;
                }
            }

            // Validate dependent questions
            // ✅ dependentQuestion.questionParameter already has composite key
            if (questionItem.question.dependentQuestion) {
                const depFieldName = questionItem.question.dependentQuestion.questionParameter;
                
                // Only validate if the dependent field is visible
                if (isVisible(depFieldName, formValuesMap)) {
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
            formRef.current?.requestSubmit();
        } else {
            const isStepValid = validateCurrentStep();
            
            if (isStepValid) {
                setActiveStep(activeStep + 1);
            } else {
                console.warn("Please fix errors before proceeding");
            }
        }
    };

    const prevStep = () => {
        setActiveStep(activeStep - 1);
    };

    const isLastStep = activeStep === formData.generalFormData.steps.length;
    const isFirstStep = activeStep === 1;

    return (
        <main className={mainContentStyle}>
            <Container className={mainContainerStyle}>
                <Title
                    title={formData.generalFormData.formHeader.title}
                    subtitle={formData.generalFormData.formHeader.subtitle}
                    className={formTitleStyle}
                    titleClassName={titleStyle}
                    subtitleClassName={subtitleStyle}
                />
                <Form ref={formRef} method="post" onSubmit={handleFormSubmit}>
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
                            validationErrors={validationErrors}
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