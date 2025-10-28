import React from "react";
import { T_StepProps } from "./types";

// state = "active", "last", "completed", "inactive"

export const Step: React.FC<T_StepProps> = ({ state, currentStepIndex, index, label }) => {
    const activeStateClasses =
        state === "active"
            ? "bg-indigo-500 text-white border-indigo-500"
            : "bg-gray-200 text-gray-500 border-gray-300";
    const completedStateClasses =
        state === "completed" ? "bg-green-500 text-white border-green-500" : "";

    const labelCompletedClasses =
        state === "active" ? "text-gray-950 font-medium" : "text-gray-400";

    return (
        <>
            <div className="flex flex-col items-center">
                <div
                    className={`${state} w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${completedStateClasses} ${activeStateClasses}`}>
                    {state === "completed" ? "✓" : index + 1}
                </div>
                <span className={`mt-2 text-sm ${labelCompletedClasses}`}>{label}</span>
            </div>
            {state !== "last" && (
                <div className="flex-1 h-1 mx-2">
                    <div
                        className={`h-1 w-full rounded-full transition-all duration-300 ${
                            currentStepIndex > index ? "bg-indigo-500" : "bg-gray-300"
                        }`}
                    />
                </div>
            )}
        </>
    );
};
