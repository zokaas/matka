import React, { useState, useRef, useMemo } from "react";
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
import { T_AnswerValue, T_FormStepsKeys } from "~/types";
import { submitFormAnswers } from "~/services/utils/submitFormAnswers";
import { useFormValidation } from "~/hooks/useFormValidation";

export const FormPage: React.FC<T_FormPageProps> = (props: T_FormPageProps) => {
    const { formData /* , generalData */ } = props;
    const submit = useSubmit();
    const navigation = useNavigation();
    const formRef = useRef<HTMLFormElement>(null);
    
    const [formValues, setFormValues] = useState(formData.answers);
    const [activeStep, setActiveStep] = useState(1);

    const { validationErrors, validateSingleField, validateEntireForm, clearFieldError, isVisible } = 
        useFormValidation(formData);

    const formValuesMap = useMemo(
        () => new Map(Array.from(formValues.entries()).map(([k, v]) => [k, v.answer])),
        [formValues]
    );
    const getCurrentStepName = (stepIndex: number): T_FormStepsKeys => 
        formData.generalFormData.steps[stepIndex].stepName as T_FormStepsKeys;

    const handleChange = (field: string, value: T_AnswerValue) => {
        setFormValues(prev => {
            const updated = new Map(prev);
            const existingEntry = updated.get(field);
            if (existingEntry) {
                updated.set(field, { ...existingEntry, answer: value });
            }
            return updated;
        });
        clearFieldError(field);
    };

    const handleOnBlur = (field: string) => {
        if (isVisible(field, formValuesMap)) {
            const currentValue = formValues.get(field);
            validateSingleField(field, currentValue?.answer);
        }
    };

    const validateCurrentStep = (): boolean => {
        const currentStepQuestions = formData.steps.get(getCurrentStepName(activeStep - 1));
        if (!currentStepQuestions) return true;

        let hasErrors = false;

        currentStepQuestions.forEach(({ question }) => {
            const validateIfVisible = (fieldName: string) => {
                if (isVisible(fieldName, formValuesMap)) {
                    const value = formValues.get(fieldName);
                    if (!validateSingleField(fieldName, value?.answer)) {
                        hasErrors = true;
                    }
                }
            };

            validateIfVisible(question.questionParameter);
            if (question.dependentQuestion) {
                validateIfVisible(question.dependentQuestion.questionParameter);
            }
        });

        return !hasErrors;
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationResult = validateEntireForm(formValuesMap);

        if (!validationResult.isValid) {
            console.warn(`Form has ${validationResult.errors.size} validation errors`);
            if (validationResult.firstErrorField) {
                document.querySelector(`[name="${validationResult.firstErrorField}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        submitFormAnswers(formValues, String(formData.id), submit);
    };

    const nextStep = () => {
        if (isLastStep) {
            formRef.current?.requestSubmit();
        } else if (validateCurrentStep()) {
            setActiveStep(activeStep + 1);
        } else {
            console.warn("Please fix errors before proceeding");
        }
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
                    
                    {isFirstStep && (
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
                            onChange={handleChange}
                            onBlur={handleOnBlur}
                            validationErrors={validationErrors}
                            activeStep={activeStep}
                            countryList={formData.countryList}
                            activeStepName={getCurrentStepName(activeStep - 1)}
                        />
                    </Container>

                    <Container className={isFirstStep ? singleButtonContainerStyle : buttonContainerStyle}>
                        {!isFirstStep && (
                            <Button
                                label={[
                                    <Icon iconName="chevron-left" iconPrefix="far" key="arrow-1" />,
                                    ` ${formData.generalFormData.button.back}`,
                                ]}
                                onClick={() => setActiveStep(activeStep - 1)}
                                type="button"
                                disabled={navigation.state === "submitting"}
                            />
                        )}
                        <Button
                            label={[
                                `${isLastStep ? formData.generalFormData.button.submit : formData.generalFormData.button.next} `,
                                <Icon iconName="chevron-right" iconPrefix="far" key="arrow-2" />,
                            ]}
                            onClick={nextStep}
                            type="button"
                            disabled={navigation.state === "submitting"}
                        />
                    </Container>
                </Form>
            </Container>
            <Footer footer={formData.generalFormData.footer} />
        </main>
    );
};