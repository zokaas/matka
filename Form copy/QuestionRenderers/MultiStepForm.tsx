import React, { useState } from "react";
import { Footer, Header, Steps } from "@ui-components/index";
import { Form, useActionData, useLoaderData, useSubmit } from "react-router";
import { T_Question } from "~/types";
import { FormHeader, ResponsePage, CompanyInfoBlock, FormButtons } from "components";
import { T_ActionData, T_FormValue, T_FormValues } from "components/types";
import { QuestionForm } from "./QuestionForm";
import { loader } from "~/routes/$productId.$kycType";
import { validateFormData } from "validation/validateFormData";
import { appendFormData } from "~/utils";

export const MultiStepForm: React.FC = () => {
    const loaderData = useLoaderData<typeof loader>();
    const { productData } = loaderData;
    const { questions, footer, steps } = productData;
    const actionData = useActionData<T_ActionData>();
    const submit = useSubmit();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formValues, setFormValues] = useState<T_FormValues>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | undefined>>(
        actionData?.errors ?? {},
    );

    const handleInputChange = (questionParameter: string, value: T_FormValue) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [questionParameter]: value,
        }));
    };

    const validateAndCollectStepValues = () => {
        const currentStepQuestions = questions.filter(
            (question: T_Question) => question.rawData.step === currentStepIndex + 1,
        );

        const validationErrors = validateFormData(
            formValues,
            currentStepQuestions,
            currentStepIndex,
        );

        if (validationErrors) {
            setErrors(validationErrors);
            return false;
        }

        currentStepQuestions.forEach((question: T_Question) => {
            const { questionParameter } = question.rawData;
            if (questionParameter && !formValues[questionParameter]) {
                formValues[questionParameter] = "";
            }
        });

        setErrors({});
        return true;
    };

    const renderSteps = () => {
        const stepsArray = ["step1", "step2", "step3"].map((stepKey, index) => ({
            label: steps[stepKey].trim(),
            isActive: index <= currentStepIndex,
        }));
        return stepsArray;
    };

    const totalSteps = 3;

    const handleNext = () => {
        if (!validateAndCollectStepValues()) {
            return;
        }

        if (currentStepIndex < totalSteps - 1) {
            setCurrentStepIndex((prev) => prev + 1);
        } else {
            const formData = appendFormData(formValues);
            submit(formData, { method: "post" });
            setIsSubmitted(true);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prev) => prev - 1);
        }
    };

    const filteredQuestions = (questions ?? []).filter(
        (question: T_Question) => question.rawData.step === currentStepIndex + 1,
    );

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col bg-base-200">
                <Header title={productData?.formHeader?.title} />
                <main className="flex-grow flex items-center justify-center px-4 py-6">
                    <ResponsePage />
                </main>
                <Footer footer={footer} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col pt-4 items-centre">
            <Header title={productData?.formHeader?.title} />
            <main className="flex-grow px-4 py-6 md:px-6">
                <Form
                    method="post"
                    className="max-w-2xl mx-auto"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleNext();
                    }}>
                    <div className="bg-base-100 shadow-xl p-8">
                        {/* Header */}
                        <FormHeader />

                        {/* Progress Steps */}
                        <div className="mb-8">
                            <Steps steps={renderSteps()} currentStepIndex={currentStepIndex} />
                        </div>

                        {/* Divider */}
                        <hr className="border-base-300 mb-6" />

                        {/* Company Info (only on first step) */}
                        {currentStepIndex === 0 && <CompanyInfoBlock />}

                        {/* Questions */}
                        <div className="space-y-6 min-h-[300px]">
                            <QuestionForm
                                questions={filteredQuestions}
                                formValues={formValues}
                                handleInputChange={handleInputChange}
                                errors={errors}
                            />
                        </div>

                        {/* Navigation Buttons */}
                        <FormButtons
                            currentStepIndex={currentStepIndex}
                            steps={renderSteps()}
                            onBack={handleBack}
                            onNext={handleNext}
                        />
                    </div>
                </Form>
            </main>
            <Footer footer={footer} />
        </div>
    );
};

export default MultiStepForm;
