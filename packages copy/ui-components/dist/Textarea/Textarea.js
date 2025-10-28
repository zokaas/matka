import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Textarea = ({ name, label, placeholder, value, onChange, errorMessage, }) => {
    return (_jsxs("div", { className: "flex-grow", children: [_jsx("label", { className: "block mb-2 font-medium text-base-content", children: label }), _jsx("textarea", { name: name, className: "w-full p-2 border border-base-300 bg-base-100 text-base-content rounded-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2 placeholder-base-content/40", placeholder: placeholder, value: value, onChange: (e) => onChange(e.target.value), rows: 4 }), errorMessage && _jsx("span", { className: "text-red-500 text-sm block", children: errorMessage })] }));
};
