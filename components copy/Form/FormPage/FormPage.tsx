import React, { useState } from "react";
import { Form } from "react-router";

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
import { sendFormData } from "~/services/api/api-kyc.server";

export const FormPage: React.FC<T_FormPageProps> = (props: T_FormPageProps) => {
    const { formData /* , generalData */ } = props;

    /* const [stepInfo, setCurrentStepIndex] = useState<T_StepInfo>({
    currentStepIndex: 0,
    totalSteps: formData.steps.size,
  }); */

    /* const [isSubmitted, setIsSubmitted] = useState<boolean>(false); */

    const [formValues, setFormValues] = useState(formData.answers);
    // TODO: validationErrors could be map (same as fromValues). It will be easier later to check if map.size is > 0
    const [validationErrors, setValidationError] = useState({});

    const [activeStep, setActiveStep] = useState(1);

    const handleChange = (field: string, value: T_AnswersMapValue) => {
        setFormValues((prev) => {
            const updated = new Map(prev);
            const current = updated.get(field);
            if (current) {
                updated.set(field, { ...current, answer: value }); // preserve questionId + question
            } else {
                // safety: if a dynamic field appears late for some reason
                updated.set(field, {
                    questionId: "", // or assign if known
                    question: field,
                    answer: value,
                });
            }
            return updated;
        });
    };

    const handleOnBlur = (field: string) => {
        const val = formValues.get(field)?.answer;
        const isEmptyArray = Array.isArray(val) && val.length === 0;
        if (val === undefined || val === "" || isEmptyArray) {
            setValidationError({ [field]: "This field is required" });
            console.info("Value missing, validation should fail!!!");
        }
    };

    const handleSubmit = async () => {
        // filter out empty answers
        const answers = Array.from(formValues.values()).filter((a) => {
            if (Array.isArray(a.answer)) return a.answer.length > 0;
            return a.answer !== "" && a.answer !== undefined && a.answer !== null;
        });

        const payload = {
            userId: "user-123",
            applicationId: String(formData.id ?? "1"), // or pass via props if different
            productId: formData.product, // e.g. "sweden-b2b-application"
            questionSetId: "1", // adjust if you have a real source
            answers, // already in the correct shape
        };



        // send (re-use your helper when ready)
        await sendFormData(payload, formData.product, /* kycType */ formData.formType ?? "onboarding", String(formData.id ?? "1"), /* sessionId */ "");
        console.log("SUBMIT → payload", payload);   
    };

    const getCurrentStepName = (activeStepIndex: number): string =>
        formData.generalFormData.steps[activeStepIndex].stepName;

    /** MOCK */
    const nextStep = () => {
        console.log(formValues);
        setActiveStep(activeStep + 1);
    };

    const prevStep = () => {
        setActiveStep(activeStep - 1);
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
                        handleSubmit(); // keep this so Enter key works
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
                            onChange={(fieldName: string, value: T_AnswersMapValue) =>
                                handleChange(fieldName, value)
                            }
                            onBlur={(fieldName: string) => handleOnBlur(fieldName)}
                            validationErrors={validationErrors}
                            activeStep={activeStep}
                            countryList={formData.countryList}
                            activeStepName={getCurrentStepName(activeStep - 1)}
                        />
                    </Container>

                    <div
                        style={{
                            marginTop: "50px",
                            display: "flex",
                            justifyContent: "space-around",
                        }}>
                        <Button
                            label={[
                                <Icon iconName="chevron-left" iconPrefix="far" key="arrow-1" />,
                                ` ${formData.generalFormData.button.back}`,
                            ]}
                            onClick={() => prevStep()}
                            type="button"
                            className=""
                            disabled={activeStep === 1}
                        />

                        {activeStep < formData.generalFormData.steps.length ? (
                            // NOT last step → show Next
                            <Button
                                label={[
                                    `${formData.generalFormData.button.next} `,
                                    <Icon
                                        iconName="chevron-right"
                                        iconPrefix="far"
                                        key="arrow-2"
                                    />,
                                ]}
                                onClick={() => nextStep()}
                                type="button"
                                className=""
                            />
                        ) : (
                            // LAST step → show Submit (call submit explicitly)
                            <Button
                                label={formData.generalFormData.button.submit}
                                onClick={() => handleSubmit()} // explicit call so it works even if Button renders type="button"
                                type="button"
                                className=""
                            />
                        )}
                    </div>
                </Form>
            </Container>
            <Footer footer={formData.generalFormData.footer} />
        </main>
    );
};
