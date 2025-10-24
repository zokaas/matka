import React, { useState } from "react";
import { Form, useNavigate, useSubmit } from "react-router";

import { Steps } from "@ui/steps";
import { T_FormPageProps /* , T_StepInfo */ } from "./types";
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
import { useSession } from "~/context/SessionContext";

export const FormPage: React.FC<T_FormPageProps> = (props: T_FormPageProps) => {
    const { formData, generalData } = props;
    const { session } = useSession();
    const navigate = useNavigate();
    const submit = useSubmit();

    const [formValues, setFormValues] = useState(formData.answers);
    // TODO: validationErrors could be map (same as fromValues). It will be easier later to check if map.size is > 0
    const [validationErrors, setValidationError] = useState<Record<string, string>>({});
    const [activeStep, setActiveStep] = useState(1);

    const handleChange = (field: string, value: T_AnswersMapValue) => {
        setFormValues((prev) => {
            const updated = new Map(prev);
            const current = updated.get(field);
            
            if (current) {
                updated.set(field, {
                    ...current,
                    answer: value ||""
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

    const nextStep = () => {
        if (activeStep < formData.generalFormData.steps.length) {
            setActiveStep(activeStep + 1);
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (activeStep > 1) {
            setActiveStep(activeStep - 1);
        }
    };

    const handleSubmit = () => {
        // Create a FormData object
        const formData = new FormData();
        
        // Add the form values as JSON
        formData.append('formValues', JSON.stringify(Array.from(formValues.entries())));
        formData.append('sessionId', session.sessionId || '');
        formData.append('productId', generalData.productId);
        formData.append('applicationId', generalData.applicationId || '');
        formData.append('kycType', generalData.kycType);
        formData.append('userId', generalData.productId || '');
        
        // Submit the form
        submit(formData, { 
            method: "post",
            action: `/${generalData.productId}/${generalData.kycType}/submit`
        });
        
        // Navigate to thank you page after successful submission
        navigate("/thank-you");
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
                            companyName={formData.generalFormData.companyBlock.companyName}
                            companyNameLabel={formData.generalFormData.companyBlock.companyNameLabel}
                            orgNumber={formData.generalFormData.companyBlock.orgNumber}
                            orgNumberLabel={formData.generalFormData.companyBlock.orgNumberLabel}
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
                            disabled={activeStep === 1}
                        />
                        <Button
                            label={
                                activeStep === formData.generalFormData.steps.length
                                ? formData.generalFormData.button.submit
                                : [
                                    `${formData.generalFormData.button.next} `,
                                    <Icon iconName="chevron-right" iconPrefix="far" key="arrow-2" />,
                                ]
                            }
                            onClick={nextStep}
                            type="button"
                        />
                    </div>
                </Form>
            </Container>
            <Footer footer={formData.generalFormData.footer} />
        </main>
    );
};