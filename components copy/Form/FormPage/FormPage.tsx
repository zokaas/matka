import React, { useState, useMemo } from "react";
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
import { T_AnswerValue, T_FormStepsKeys } from "~/types";
import { submitFormAnswers } from "~/services/utils/submitFormAnswers";
import { ErrorView } from "../../error";
import { useFormValidation } from "~/hooks/useFormValidation";

export const FormPage: React.FC<T_FormPageProps> = (props: T_FormPageProps) => {
    const { formData, generalData, error } = props;
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

    const formValuesMap = useMemo(() => {
        const map = new Map<string, T_AnswerValue>();
        formValues.forEach((value, key) => {
            map.set(key, value.answer);
        });
        return map;
    }, [formValues]);

    const handleChange = (field: string, value: T_AnswerValue, displayText?: string) => {
        setFormValues((prev) => {
            const updated = new Map(prev);
            const existingEntry = updated.get(field);
            if (existingEntry) {
                updated.set(field, {
                    ...existingEntry,
                    answer: value,
                    ...(displayText !== undefined && { answerText: displayText }),
                });
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
        const currentStepQuestions = formData.steps.get(
            getCurrentStepName(activeStep - 1) as T_FormStepsKeys
        );

        if (!currentStepQuestions) return true;

        let hasErrors = false;

        currentStepQuestions.forEach(({ question }) => {
            if (isVisible(question.questionParameter, formValuesMap)) {
                const value = formValues.get(question.questionParameter);
                if (!validateSingleField(question.questionParameter, value?.answer)) {
                    hasErrors = true;
                }
            }

            if (question.dependentQuestion) {
                const depParam = question.dependentQuestion.questionParameter;
                if (isVisible(depParam, formValuesMap)) {
                    const value = formValues.get(depParam);
                    if (!validateSingleField(depParam, value?.answer)) {
                        hasErrors = true;
                    }
                }
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
                document
                    .querySelector(`[name="${validationResult.firstErrorField}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        submitFormAnswers(formValues, String(formData.id), submit);
    };

    const getCurrentStepName = (activeStepIndex: number): string =>
        formData.generalFormData.steps[activeStepIndex].stepName;

    const nextStep = () => {
        if (isLastStep) {
            formRef.current?.requestSubmit();
        } else if (validateCurrentStep()) {
            setActiveStep(activeStep + 1);
        } else {
            console.warn("Please fix validation errors before proceeding");
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
                    {/* Divider */}
                    {/* TODO: Divider should / could be own component (div perhaps). E.g. div -> Divider */}
                    <hr className={dividerStyle} />
                    {/* Company info */}
                    {isFirstStep && (
                        <CompanyInfo
                            companyName={generalData.organizationName}
                            companyNameLabel={formData.generalFormData.companyBlock.companyName}
                            orgNumber={generalData.organizationNumber}
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
                    {error && <ErrorView message={error.message} />}
                    <Container
                        className={isFirstStep ? singleButtonContainerStyle : buttonContainerStyle}>
                        {!isFirstStep && (
                            <Button
                                label={[
                                    <Icon iconName="chevron-left" iconPrefix="far" key="arrow-1" />,
                                    ` ${formData.generalFormData.button.back}`,
                                ]}
                                onClick={prevStep}
                                type="button"
                                disabled={isSubmitting}
                            />
                        )}
                        <Button
                            label={[
                                `${isLastStep ? formData.generalFormData.button.submit : formData.generalFormData.button.next} `,
                                <Icon iconName="chevron-right" iconPrefix="far" key="arrow-2" />,
                            ]}
                            onClick={nextStep}
                            type="button"
                            disabled={isSubmitting}
                        />
                    </Container>
                </Form>
            </Container>
        </main>
    );
};
