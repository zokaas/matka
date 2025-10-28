import React, { useState, useRef, useEffect } from "react";
import { T_Select } from "./selectTypes";

export const Select: React.FC<T_Select> = ({
    name,
    label,
    options,
    selectedValue,
    onChange,
    errorMessage,
    placeholder = "Choose an option",
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOptionClick = (option: { id: string; value: string }) => {
        onChange(option.value);
        setDropdownOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const filteredOptions =
        options && options.length > 15
            ? options.filter((option) =>
                  option.value.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : options || [];

    const selectedOption = options?.find((option) => option.value === selectedValue);

    return (
        <div className="flex-grow">
            <label className="block mb-2 font-medium text-base-content">{label}</label>
            <div className="relative" ref={dropdownRef}>
                <div
                    className="w-full px-3 py-3 border border-base-300 bg-base-100 text-base-content"
                    onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen(!dropdownOpen);
                    }}>
                    <span className="block truncate">
                        {selectedOption ? selectedOption.value : placeholder}
                    </span>
                </div>
                {dropdownOpen && (
                    <div className="absolute z-10 w-full bg-base-100 border border-base-300 mt-1 max-h-60 overflow-y-auto text-base-content shadow-lg">
                        {options && options.length > 15 && (
                            <div className="sticky top-0 z-10 border border-base-300 bg-base-100">
                                <input
                                    name={name}
                                    type="text"
                                    className="w-full px-3 py-3 bg-transparent focus:outline-none"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
                        {filteredOptions.map((option, index) => (
                            <div key={option.value}>
                                <div
                                    className="flex items-center px-3 py-3 hover:bg-base-200 cursor-pointer text-base-content transition-colors duration-150"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOptionClick(option);
                                    }}>
                                    <span className="block truncate">{option.value}</span>
                                    {selectedValue === option.value}
                                </div>
                                {index < filteredOptions.length - 1 && (
                                    <div className="border border-base-300 mb-2" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {errorMessage && (
                <span className="text-red-500 text-sm block mt-1">{errorMessage}</span>
            )}
        </div>
    );
};
