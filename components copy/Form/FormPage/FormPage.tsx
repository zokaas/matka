import React, { useState, useEffect } from "react";
import { Form, useSubmit, useActionData, useNavigation } from "react-router";

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
import { T_AnswerValue, T_FormStepsKeys } from "~/types";
import { normalizeDropdownValue } from "../questions/types/answerTypes";

export const FormPage: React.FC<T_FormPageProps> = (props: T_FormPageProps) => {
    const { formData, generalData } = props;
    const submit = useSubmit();
    const actionData = useActionData();
    const navigation = useNavigation();

    const [formValues, setFormValues] = useState(formData.answers);
    const [validationErrors, setValidationError] = useState<Record<string, string>>({});
    const [activeStep, setActiveStep] = useState(1);

    const isSubmitting = navigation.state === "submitting";

    // Log form values on every change
    useEffect(() => {
        console.log("=== CURRENT FORM STATE ===");
        const entries = Array.from(formValues.entries());
        console.log(`Total fields: ${entries.length}`);
        const filled = entries.filter(([, val]) => val.answer !== "").length;
        console.log(`Filled fields: ${filled}`);
        console.log("Form values:", entries);
    }, [formValues]);

    const handleChange = (field: string, value: T_AnswerValue) => {
        console.log(`Field changed: ${field} = ${JSON.stringify(value)}`);

        // Normalize value (handles undefined, arrays, objects, primitives)
        const normalizedValue = normalizeDropdownValue(value);

        setFormValues((prev) => {
            const updated = new Map(prev);
            const existingEntry = updated.get(field);

            if (existingEntry) {
                // Update only the answer, keep questionId and question
                updated.set(field, {
                    ...existingEntry,
                    answer: normalizedValue,
                });
                console.log(`Updated ${field}:`, updated.get(field));
            } else {
                console.warn(`Field ${field} not found in form values!`);
            }
            return updated;
        });
    };

    const handleOnBlur = (field: string) => {
        const entry = formValues.get(field);
        if (!entry?.answer) {
            setValidationError((prev) => ({
                ...prev,
                [field]: "This field is required",
            }));
            console.info("Value missing, validation should fail!!!");
        } else {
            // Clear error if field now has value
            setValidationError((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("=== FORM SUBMIT TRIGGERED ===");

    // Log the raw formValues Map
    console.log("Raw formValues Map:");
    formValues.forEach((value, key) => {
        console.log(`  ${key}:`, value);
    });

    // Convert Map to array of entries for transmission to server
    const answersArray = Array.from(formValues.entries()).map(([key, value]) => {
        console.log(`Processing field: ${key}`);
        console.log(`  questionId: ${value.questionId}`);
        console.log(`  question: ${value.question}`);
        console.log(`  answer type: ${typeof value.answer}`);
        console.log(`  answer value:`, value.answer);
        console.log(`  answer is array: ${Array.isArray(value.answer)}`);
        
        return {
            fieldName: key,
            questionId: value.questionId,
            question: value.question,
            answer: value.answer,
        };
    });

    console.log("=== SUBMITTING TO SERVER ===");
    console.log(`Total answers: ${answersArray.length}`);
    console.log("All answers:", answersArray);
    
    // Check specifically for beneficial owner data
    const beneficialOwnerAnswer = answersArray.find(
        a => a.question === "beneficialOwners" || a.fieldName.includes("beneficial")
    );
    console.log("=== BENEFICIAL OWNER DATA ===");
    console.log("Found beneficial owner?", !!beneficialOwnerAnswer);
    if (beneficialOwnerAnswer) {
        console.log("Beneficial owner answer:", beneficialOwnerAnswer);
        console.log("Beneficial owner answer type:", typeof beneficialOwnerAnswer.answer);
        console.log("Is array?", Array.isArray(beneficialOwnerAnswer.answer));
        console.log("Stringified:", JSON.stringify(beneficialOwnerAnswer.answer, null, 2));
    }

    console.log("Full answers array:", JSON.stringify(answersArray, null, 2));

    try {
        // Convert to FormData and submit
        const formDataToSubmit = new FormData();
        const answersJson = JSON.stringify(answersArray);
        
        console.log("=== FINAL JSON BEING SENT ===");
        console.log("Length:", answersJson.length);
        console.log("Content:", answersJson);
        
        formDataToSubmit.append("answers", answersJson);
        formDataToSubmit.append("productId", generalData.productId);
        formDataToSubmit.append("kycType", generalData.kycType);
        formDataToSubmit.append("applicationId", generalData.applicationId || "");
        formDataToSubmit.append("questionSetId", formData.questionSetId || "1");
        
        submit(formDataToSubmit, { method: "post" });
        console.log("Form data sent successfully");
    } catch (error) {
        console.error("Error submitting form:", error);
    }
};

    const getCurrentStepName = (activeStepIndex: number): string =>
        formData.generalFormData.steps[activeStepIndex].stepName;

    const nextStep = () => {
        console.log("=== NEXT STEP CLICKED ===");
        console.log(`Current step: ${activeStep} of ${formData.generalFormData.steps.length}`);

        // Log current values before moving
        const currentValues = Array.from(formValues.entries())
            .filter(([, val]) => val.answer !== "")
            .map(([key, val]) => ({ key, answer: val.answer }));
        console.log("Filled values before next:", currentValues);

        // Check if we're on the last step
        if (activeStep === formData.generalFormData.steps.length) {
            console.log("Last step reached, submitting form...");
            // Trigger form submission programmatically
            const formElement = document.querySelector("form");
            if (formElement) {
                console.log("Form element found, requesting submit");
                formElement.requestSubmit();
            } else {
                console.error("Form element not found!");
            }
        } else {
            setActiveStep(activeStep + 1);
        }
    };

    const prevStep = () => {
        console.log("=== PREVIOUS STEP CLICKED ===");
        setActiveStep(activeStep - 1);
    };

    const isLastStep = activeStep === formData.generalFormData.steps.length;

    // Log action data when it changes
    useEffect(() => {
        if (actionData) {
            console.log("=== ACTION DATA RECEIVED ===");
            console.log("Action data:", actionData);
        }
    }, [actionData]);

    useEffect(() => {
        console.log("=== STEP INFORMATION ===");
        console.log("Active step:", activeStep);
        console.log("Total steps:", formData.generalFormData.steps.length);
        console.log("Steps:", formData.generalFormData.steps);
        console.log("Current step name:", getCurrentStepName(activeStep - 1));
        console.log(
            "Questions for current step:",
            formData.steps.get(getCurrentStepName(activeStep - 1) as any)
        );
    }, [activeStep, formData]);

    useEffect(() => {
        console.log("=== ALL STEPS AND QUESTIONS ===");
        formData.generalFormData.steps.forEach((step, index) => {
            const stepKey = step.stepName as T_FormStepsKeys;
            const questionsForStep = formData.steps.get(stepKey);
            console.log(
                `Step ${index + 1} (${step.stepName}): ${questionsForStep?.length || 0} questions`
            );
            questionsForStep?.forEach((q) => {
                console.log(`  - ${q.question.questionParameter} (API step: ${q.question.step})`);
            });
        });
    }, [formData]);

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

                {/* Show submission status */}
                {isSubmitting && (
                    <div style={{ padding: "1rem", background: "#f0f0f0", marginBottom: "1rem" }}>
                        Submitting form...
                    </div>
                )}

                {actionData && (
                    <div
                        style={{
                            padding: "1rem",
                            background: actionData.success ? "#d4edda" : "#f8d7da",
                            marginBottom: "1rem",
                            borderRadius: "4px",
                        }}>
                        <strong>{actionData.success ? "Success!" : "Error!"}</strong>
                        <p>{actionData.message}</p>
                        {!actionData.success && actionData.error && (
                            <pre style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                                {JSON.stringify(actionData.error, null, 2)}
                            </pre>
                        )}
                    </div>
                )}

                <Form method="post" className="max-w-2xl mx-auto" onSubmit={handleFormSubmit}>
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
                            disabled={activeStep === 1 || isSubmitting}
                        />
                        <Button
                            label={[
                                `${isLastStep ? formData.generalFormData.button.submit : formData.generalFormData.button.next} `,
                                <Icon iconName="chevron-right" iconPrefix="far" key="arrow-2" />,
                            ]}
                            onClick={() => nextStep()}
                            type="button"
                            className=""
                            disabled={isSubmitting}
                        />
                    </div>
                </Form>
            </Container>
            <Footer footer={formData.generalFormData.footer} />
        </main>
    );
};
