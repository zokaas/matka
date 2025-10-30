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

export const FormPage: React.FC<T_FormPageProps> = (props: T_FormPageProps) => {
    const { formData /* , generalData */ } = props;
    const submit = useSubmit();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const [formValues, setFormValues] = useState(formData.answers);
    const [validationErrors, setValidationError] = useState({});
    const [activeStep, setActiveStep] = useState(1);
    const formRef = React.useRef<HTMLFormElement>(null);

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
    };

    const handleOnBlur = (field: string) => {
        if (!formValues.get(field)) {
            setValidationError({
                [field]: "This field is required",
            });
            console.info("Value missing, validation should fail!!!");
        }
    };
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitFormAnswers(formValues, String(formData.id), submit);
    };

    const getCurrentStepName = (activeStepIndex: number): string =>
        formData.generalFormData.steps[activeStepIndex].stepName;

    const nextStep = () => {
        if (isLastStep) formRef.current?.requestSubmit();
        else {
            setActiveStep(activeStep + 1);
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
