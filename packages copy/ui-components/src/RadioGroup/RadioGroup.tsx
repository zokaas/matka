import React from "react";
import { T_RadioGroup } from "./radioGroupTypes";

export const RadioGroup: React.FC<T_RadioGroup> = ({
    label,
    name,
    options,
    selectedValue,
    onChange,
    errorMessage,
}) => {
    return (
        <div className="flex-grow mb-6">
            <label className="block mb-2 font-medium text-base-content">{label}</label>

            <div className="flex space-x-4">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={selectedValue === option.value}
                            onChange={() => onChange(option.value)}
                            className="sr-only peer"
                        />
                        <div className="w-5 h-5 rounded-full border-2 border-base-300 bg-base-100 flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2">
                            <div className="w-2 h-2 rounded-full bg-base-100 opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                        </div>
                        <span className="text-base font-medium text-base-content/70 peer-checked:text-base-content transition-colors duration-200">
                            {option.value}
                        </span>
                    </label>
                ))}
            </div>

            {errorMessage && <span className="text-red-500 text-sm block">{errorMessage}</span>}
        </div>
    );
};
