import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
export const Select = ({ name, label, options, selectedValue, onChange, errorMessage, placeholder = "Choose an option", }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const handleOptionClick = (option) => {
        onChange(option.value);
        setDropdownOpen(false);
    };
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    const filteredOptions = options && options.length > 15
        ? options.filter((option) => option.value.toLowerCase().includes(searchTerm.toLowerCase()))
        : options || [];
    const selectedOption = options?.find((option) => option.value === selectedValue);
    return (_jsxs("div", { className: "flex-grow", children: [_jsx("label", { className: "block mb-2 font-medium text-base-content", children: label }), _jsxs("div", { className: "relative", ref: dropdownRef, children: [_jsx("div", { className: "w-full px-3 py-3 border border-base-300 bg-base-100 text-base-content", onClick: (e) => {
                            e.stopPropagation();
                            setDropdownOpen(!dropdownOpen);
                        }, children: _jsx("span", { className: "block truncate", children: selectedOption ? selectedOption.value : placeholder }) }), dropdownOpen && (_jsxs("div", { className: "absolute z-10 w-full bg-base-100 border border-base-300 mt-1 max-h-60 overflow-y-auto text-base-content shadow-lg", children: [options && options.length > 15 && (_jsx("div", { className: "sticky top-0 z-10 border border-base-300 bg-base-100", children: _jsx("input", { name: name, type: "text", className: "w-full px-3 py-3 bg-transparent focus:outline-none", placeholder: "Search...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), onClick: (e) => e.stopPropagation() }) })), filteredOptions.map((option, index) => (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center px-3 py-3 hover:bg-base-200 cursor-pointer text-base-content transition-colors duration-150", onClick: (e) => {
                                            e.stopPropagation();
                                            handleOptionClick(option);
                                        }, children: [_jsx("span", { className: "block truncate", children: option.value }), selectedValue === option.value] }), index < filteredOptions.length - 1 && (_jsx("div", { className: "border border-base-300 mb-2" }))] }, option.value)))] }))] }), errorMessage && (_jsx("span", { className: "text-red-500 text-sm block mt-1", children: errorMessage }))] }));
};
