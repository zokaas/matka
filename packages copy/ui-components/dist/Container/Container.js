import { jsx as _jsx } from "react/jsx-runtime";
export const Container = ({ children, className = "", maxWidth = "xl", padding = true, }) => {
    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        full: "max-w-full",
    };
    return (_jsx("div", { className: `${maxWidthClasses[maxWidth]} mx-auto ${padding ? "my-10 p-8" : ""} bg-base-100 ${className}`, children: children }));
};
