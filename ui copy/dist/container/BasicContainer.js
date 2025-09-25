import { jsx as _jsx } from "react/jsx-runtime";
// TODO: Currently not in use, as I am not sure if it is needed. But code is already written, so I'll let it be here
export const BasicContainer = ({ className, children }) => {
    if (className)
        return _jsx("div", { className: className, children: children });
    return _jsx("div", { children: children });
};
