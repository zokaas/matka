import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// state = "active", "last", "completed", "inactive"
export const Step = ({ state, currentStepIndex, index, label }) => {
    const activeStateClasses = state === "active"
        ? "bg-indigo-500 text-white border-indigo-500"
        : "bg-gray-200 text-gray-500 border-gray-300";
    const completedStateClasses = state === "completed" ? "bg-green-500 text-white border-green-500" : "";
    const labelCompletedClasses = state === "active" ? "text-gray-950 font-medium" : "text-gray-400";
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: `${state} w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${completedStateClasses} ${activeStateClasses}`, children: state === "completed" ? "✓" : index + 1 }), _jsx("span", { className: `mt-2 text-sm ${labelCompletedClasses}`, children: label })] }), state !== "last" && (_jsx("div", { className: "flex-1 h-1 mx-2", children: _jsx("div", { className: `h-1 w-full rounded-full transition-all duration-300 ${currentStepIndex > index ? "bg-indigo-500" : "bg-gray-300"}` }) }))] }));
};
