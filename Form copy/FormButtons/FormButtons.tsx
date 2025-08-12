import React from "react";
import { useLoaderData } from "react-router";
import { T_GetFormResponse } from "~/types";
import { Button } from "@ui-components/index";
import { T_FormButtons } from "./formButtonsTypes";

export const FormButtons: React.FC<T_FormButtons> = ({
    currentStepIndex,
    steps,
    onNext,
    onBack,
}) => {
    const loaderData = useLoaderData<T_GetFormResponse>();
    const { button } = loaderData.productData;

    return (
        <div className="flex justify-between gap-4 mt-8">
            {currentStepIndex > 0 ? (
                <Button variant="neutral" onClick={onBack}>
                    {button?.back}
                </Button>
            ) : (
                <div />
            )}
            <Button className="min-w-[120px]" variant="blue" onClick={onNext}>
                {currentStepIndex < steps.length - 1 ? button?.next : button?.submit}
            </Button>
        </div>
    );
};
