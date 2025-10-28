import React, { useState, useRef, useEffect } from "react";
import { T_MultiSelectDropdown } from "./multiSelectDropdownTypes";

export const MultiSelectDropdown: React.FC<T_MultiSelectDropdown> = ({
    name,
    label,
    options,
    selectedOptions,
    onChange,
    errorMessage,
    placeholder,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleOptionToggle = (optionName: string) => {
        const newSelectedOptions = selectedOptions.includes(optionName)
            ? selectedOptions.filter((option) => option !== optionName)
            : [...selectedOptions, optionName];

        onChange(newSelectedOptions);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex-grow" ref={dropdownRef}>
            <label className="block mb-2 font-medium text-base-content">{label}</label>
            <div className="relative">
                <div
                    className="w-full p-2 border border-base-300 bg-base-100 text-base-content rounded-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2 cursor-pointer"
                    onClick={toggleDropdown}>
                    <span className="block truncate">
                        {selectedOptions.length > 0
                            ? `${selectedOptions.length} selected`
                            : placeholder}
                    </span>
                </div>
                {dropdownOpen && (
                    <div className="absolute z-10 w-full bg-base-100 border border-base-300 rounded mt-1 max-h-60 overflow-y-auto">
                        <input
                            type="text"
                            className="sticky top-0 z-10 w-full p-2 border-b border-base-300 bg-base-100"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {options
                            .filter((option) =>
                                option.value.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((option) => (
                                <label
                                    key={option.value}
                                    className="flex items-center p-2 hover:bg-base-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedOptions.includes(option.value)}
                                        onChange={() => handleOptionToggle(option.value)}
                                        className="appearance-none w-4 h-4 border border-base-300 rounded bg-base-100 checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 relative after:content-['✓'] after:text-primary-content after:text-xs after:absolute after:inset-0 after:flex after:items-center after:justify-center after:scale-0 checked:after:scale-100 after:transition-transform mr-2"
                                    />
                                    {option.value}
                                </label>
                            ))}
                    </div>
                )}
            </div>
            {selectedOptions.length > 0 && (
                <div className="mb-2">
                    <span className="font-medium text-base-content">Selected:</span>
                    <ul className="mt-1">
                        {options
                            .filter((option) => selectedOptions.includes(option.value))
                            .map((option) => (
                                <li
                                    key={option.value}
                                    className="inline-block mr-2 mt-1 px-2 py-1 bg-base-200 rounded">
                                    {option.value}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
            {errorMessage && <span className="text-red-500 text-sm block">{errorMessage}</span>}
        </div>
    );
};
