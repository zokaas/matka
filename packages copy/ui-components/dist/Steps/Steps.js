import { jsx as _jsx } from "react/jsx-runtime";
import { Step } from "./Step";
export const Steps = ({ steps, currentStepIndex }) => {
    const getStepState = (currentStepIndex, stepsCount, index) => {
        if (index < currentStepIndex)
            return "completed";
        if (index === currentStepIndex)
            return "active";
        if (index === stepsCount - 1)
            return "last";
        return "inactive";
    };
    return (_jsx("div", { className: "w-full max-w-2xl px-4 mb-8 mx-auto", children: _jsx("div", { className: "flex items-center justify-between w-full", children: steps.map((step, index) => {
                const state = getStepState(currentStepIndex, steps.length, index);
                return (_jsx(Step, { currentStepIndex: currentStepIndex, index: index, label: step.stepLabel, state: state }, step.stepName));
            }) }) }));
    /* return (
        <div className="w-full max-w-2xl px-4 mb-8 mx-auto"> */
    {
        /* Step circles + connectors */
    }
    {
        {
            /* <div className="flex items-center justify-between w-full">
                {steps.map((_, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isActive = isCompleted || isCurrent;
                    const isLast = index === steps.length - 1;

                    return (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all
                  ${
                      isCompleted
                          ? "bg-green-500 text-white border-green-500"
                          : isCurrent
                            ? "bg-indigo-500 text-white border-indigo-500"
                            : "bg-gray-200 text-gray-500 border-gray-300"
                  }`}>
                                    {isCompleted ? "✓" : index + 1}
                                </div>
                                <span
                                    className={`mt-2 text-sm ${
                                        isActive ? "text-black font-medium" : "text-gray-400"
                                    }`}>
                                    {steps[index].label}
                                </span>
                            </div> */
        }
    }
    {
        /* Connector */
    }
    /*  {!isLast && (
                                <div className="flex-1 h-1 mx-2">
                                    <div
                                        className={`h-1 w-full rounded-full transition-all duration-300 ${
                                            currentStepIndex > index
                                                ? "bg-indigo-500"
                                                : "bg-gray-300"
                                        }`}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    ); */
};
