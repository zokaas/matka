import React from "react";
import { T_Textarea } from "./textareaTypes";

export const Textarea: React.FC<T_Textarea> = ({
    name,
    label,
    placeholder,
    value,
    onChange,
    errorMessage,
}) => {
    return (
        <div className="flex-grow">
            <label className="block mb-2 font-medium text-base-content">{label}</label>
            <textarea
                name={name}
                className="w-full p-2 border border-base-300 bg-base-100 text-base-content rounded-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2 placeholder-base-content/40"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
            />
            {errorMessage && <span className="text-red-500 text-sm block">{errorMessage}</span>}
        </div>
    );
};
