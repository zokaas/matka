import { jsx as _jsx } from "react/jsx-runtime";
export const FlexContainer = ({ children, className = "" }) => {
    return _jsx("div", { className: `flex flex-col space-y-4 ${className}`, children: children });
};
