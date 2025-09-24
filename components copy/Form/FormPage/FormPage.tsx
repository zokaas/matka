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
import { TestSessionModal } from "../../SessionModal";

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
        setFormValues(
            (prev) => {
                const updated = new Map(prev);
                updated.set(field, value);
                return updated;
            }
            //formValues.set(field, value)
        );
    };

    const handleOnBlur = (field: string) => {
        if (!formValues.get(field)) {
            setValidationError({
                [field]: "This field is required",
            });
            console.info("Value missing, validation should fail!!!");
        }
    };

    const handleSubmit = () => {
        /*             
            if (!validateAndCollectStepValues()) {
                return;
            }
                */
        /*         if (currentStepIndex < totalSteps - 1) {
            setCurrentStepIndex((prev) => prev + 1);
        } else {
            const formData = appendFormData(formValues);
            submit(formData, { method: "post" });
            setIsSubmitted(true);
        } */
        console.log("handle submit");
    };

    const getCurrentStepName = (activeStepIndex: number): string =>
        formData.generalFormData.steps[activeStepIndex].stepName;

    /*     console.log(formData);
    console.log(generalData); */

    /** MOCK */
    /* Mock starts */

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
                <TestSessionModal/>
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
                    {/* mock buttons moved inside the form */}
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
                        <Button
                            label={[
                                `${formData.generalFormData.button.next} `,
                                <Icon iconName="chevron-right" iconPrefix="far" key="arrow-2" />,
                            ]}
                            onClick={() => nextStep()}
                            type="button"
                            className=""
                            disabled={activeStep === formData.generalFormData.steps.length}
                        />
                    </div>
                </Form>
            </Container>
            <Footer footer={formData.generalFormData.footer} />
        </main>
    );
};
