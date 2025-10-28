import React from "react";
import { T_Input } from "./inputTypes";

export const Input: React.FC<T_Input> = ({
    name,
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    errorMessage,
}) => {
    return (
        <div className="flex-grow">
            <label className="block mb-2 font-medium text-base-content">{label}</label>
            <input
                name={name}
                type={type}
                className="w-full p-2 border border-base-300 bg-base-100 text-base-content rounded-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-base-content/40"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {errorMessage && <span className="text-red-500 text-sm block">{errorMessage}</span>}
        </div>
    );
};
