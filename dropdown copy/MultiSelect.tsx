// MultiSelect.tsx
import React, { useState, useEffect } from "react";
import {Popover, Checkbox} from "radix-ui";
import {
    dropDownContainerStyle,
    dropDownOpenIconStyle,
    dropDownListStyle,
    dropDownStyle,
    dropDownViewportStyle,
    dropDownItemStyles,
    dropDownLabel,
} from "./styles";
import { Container } from "@ui/container";
import { T_MultiSelectProps } from "./types";
import { Icon } from "@ui/icon";
import { ErrorMessage } from "@ui/error";

export const MultiSelect: React.FC<T_MultiSelectProps> = ({
    fieldName,
    label,
    options,
    onChange,
    onBlur,
    placeholder = "Select options...",
    errorClassNames,
    error,
    classNames,
    value = [],
}) => {
    const [isOpen, setIsOpen] = useState(false);
    // Local state to ensure we have a controlled component
    const [selectedValues, setSelectedValues] = useState<string[]>(value);

    // Sync with parent value changes
    useEffect(() => {
        if (JSON.stringify(value) !== JSON.stringify(selectedValues)) {
            setSelectedValues(value);
        }
    }, [value, selectedValues]);

    const selectContainer = classNames?.dropDownContainer || dropDownContainerStyle;
    const selectLabel = classNames?.dropDownLabel || dropDownLabel;
    const selectField = classNames?.dropDownField || dropDownStyle;
    const selectIcon = classNames?.dropDownIcon || dropDownOpenIconStyle;
    const selectValuesList = classNames?.dropDownSelectionList || dropDownListStyle;
    const selectViewport = classNames?.dropDownViewport || dropDownViewportStyle;
    const selectItem = classNames?.dropDownItem || dropDownItemStyles;

    const handleCheckChange = (optionValue: string | number | boolean | string[], checked: boolean) => {
        const stringValue = String(optionValue);
        let newValues: string[];
        
        if (checked) {
            // Add value if not already present
            newValues = selectedValues.includes(stringValue) 
                ? selectedValues 
                : [...selectedValues, stringValue];
        } else {
            // Remove value
            newValues = selectedValues.filter(v => v !== stringValue);
        }
        
        setSelectedValues(newValues);
        // Call parent onChange with new values
        if (onChange) {
            onChange(newValues);
        }
    };

    const selectedCount = selectedValues.length;
    const displayText = selectedCount === 0 
        ? placeholder 
        : `${selectedCount} selected`;

    const clearAll = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newValues: string[] = [];
        setSelectedValues(newValues);
        if (onChange) {
            onChange(newValues);
        }
    };

    return (
        <Container className={selectContainer}>
            <label className={selectLabel} htmlFor={fieldName}>
                {label}
            </label>
            
            <Popover.Root 
                open={isOpen} 
                onOpenChange={setIsOpen}
            >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Popover.Trigger asChild>
                        <button
                            type="button"
                            className={selectField}
                            aria-label={label}
                            onBlur={onBlur}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                paddingRight: selectedCount > 0 ? '60px' : '40px' // Make room for clear button
                            }}
                        >
                            <span style={{ 
                                color: selectedCount === 0 ? '#999' : 'inherit',
                                flex: 1,
                                textAlign: 'left'
                            }}>
                                {displayText}
                            </span>
                            
                            <div className={selectIcon}>
                                {isOpen ? (
                                    <Icon iconName="chevron-up" iconPrefix="far" />
                                ) : (
                                    <Icon iconName="chevron-down" iconPrefix="far" />
                                )}
                            </div>
                        </button>
                    </Popover.Trigger>
                    
                    {selectedCount > 0 && (
                        <button
                            type="button"
                            onClick={clearAll}
                            style={{
                                position: 'absolute',
                                right: '30px',
                                padding: '2px 6px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                color: '#666',
                                borderRadius: '3px',
                                backgroundColor: '#f0f0f0',
                                border: 'none',
                                zIndex: 1
                            }}
                            title="Clear all"
                            aria-label="Clear all selections"
                        >
                            Clear
                        </button>
                    )}
                </div>
                
                <Popover.Portal>
                    <Popover.Content
                        className={selectValuesList}
                        sideOffset={5}
                        align="start"
                        style={{ width: 'var(--radix-popover-trigger-width)' }}
                    >
                        <div className={selectViewport}>
                            {options?.map((option, index) => {
                                if (!option || option.value == null) return null;
                                
                                const optionValue = String(option.value);
                                const isChecked = selectedValues.includes(optionValue);
                                
                                return (
                                    <div
                                        key={`${fieldName}_${optionValue}_${index}`}
                                        className={selectItem}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: 'pointer',
                                            padding: '8px'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCheckChange(option.value!, !isChecked);
                                        }}
                                    >
                                        <Checkbox.Root
                                            checked={isChecked}
                                            onCheckedChange={(checked) => {
                                                handleCheckChange(option.value!, checked === true);
                                            }}
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                backgroundColor: 'white',
                                                border: '1px solid #ccc',
                                                borderRadius: '3px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Checkbox.Indicator>
                                                <Icon iconName="check" iconPrefix="fas" />
                                            </Checkbox.Indicator>
                                        </Checkbox.Root>
                                        <span style={{ flex: 1 }}>
                                            {option.text}
                                        </span>
                                    </div>
                                );
                            })}
                            
                            {(!options || options.length === 0) && (
                                <div className={selectItem} style={{ color: '#999', padding: '8px' }}>
                                    No options available
                                </div>
                            )}
                        </div>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
            
            <ErrorMessage error={error} classNames={errorClassNames} />
        </Container>
    );
};