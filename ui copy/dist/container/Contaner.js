import { jsx as _jsx } from "react/jsx-runtime";
export const Container = ({ className, children }) => {
    if (className)
        return _jsx("div", { className: className, children: children });
    return _jsx("div", { children: children });
};
