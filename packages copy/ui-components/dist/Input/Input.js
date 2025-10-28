import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Input = ({ name, label, placeholder, value, onChange, type = "text", errorMessage, }) => {
    return (_jsxs("div", { className: "flex-grow", children: [_jsx("label", { className: "block mb-2 font-medium text-base-content", children: label }), _jsx("input", { name: name, type: type, className: "w-full p-2 border border-base-300 bg-base-100 text-base-content rounded-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-base-content/40", placeholder: placeholder, value: value, onChange: (e) => onChange(e.target.value) }), errorMessage && _jsx("span", { className: "text-red-500 text-sm block", children: errorMessage })] }));
};
