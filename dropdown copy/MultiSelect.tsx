import React, { useState, useEffect, useCallback } from "react";
import { Popover, Checkbox } from "radix-ui";
import {
    dropDownContainerStyle,
    dropDownOpenIconStyle,
    dropDownListStyle,
    dropDownStyle,
    dropDownViewportStyle,
    dropDownItemStyles,
    dropDownLabel,
    multiSelectTagsContainer,
    multiSelectPlaceholder,
    multiSelectTag,
    multiSelectTagRemove,
    multiSelectCheckbox,
    iconStyle,
    selectFieldContainer,
    dropdownItemIndicatorStyles,
    multiSelectOptionButton,
    multiSelectOptionButtonDisabled,
    filterContainer,
    noOptionsMessage,
    multiSelectOptionText
} from "./styles";
import { Container } from "@ui/container";
import { T_MultiSelectProps } from "./types";
import { Icon } from "@ui/icon";
import { ErrorMessage } from "@ui/error";
import { Filter } from "@ui/filter";
import { DEFAULT_PLACEHOLDER, NO_RESULTS, NO_RESULTS_DEFAULT_TEXT } from "./dropdown.constants";

export const MultiSelect: React.FC<T_MultiSelectProps> = ({
    fieldName,
    label,
    options,
    onChange,
    onBlur,
    placeholder,
    showSelectedItemIcon,
    errorClassNames,
    error,
    classNames,
    searchEnabled,
    searchNoResultsText,
    searchPlaceholder,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState<Array<string>>([]);
    const [optionsArray, setOptionsArray] = useState(options || []);

    // Update options array when options prop changes
    useEffect(() => {
        setOptionsArray(options || []);
    }, [options]);

    // CSS class assignments - matching DropDown exactly
    const selectContainer = classNames?.dropDownContainer || dropDownContainerStyle;
    const selectLabel = classNames?.dropDownLabel || dropDownLabel;
    const selectField = classNames?.dropDownField || dropDownStyle;
    const selectIcon = classNames?.dropDownIcon || dropDownOpenIconStyle;
    const selectValuesList = classNames?.dropDownSelectionList || dropDownListStyle;
    const selectViewport = classNames?.dropDownViewport || dropDownViewportStyle;
    const selectItem = classNames?.dropDownItem || dropDownItemStyles;
    const selectItemIndicator = classNames?.dropDownItemIndicator || dropdownItemIndicatorStyles;
    const searchLabel = searchNoResultsText || NO_RESULTS_DEFAULT_TEXT;
    const searchPlaceholderText = searchPlaceholder || DEFAULT_PLACEHOLDER;

    // Filter function matching the DropDown pattern exactly
    const filterContent = useCallback((searchText: string) => {
        if (searchText.length > 1 && options) {
            const result = options.filter((option) =>
                option.text.toLowerCase().includes(searchText.toLowerCase())
            );
            console.log(result);
            if (result.length > 0) {
                setOptionsArray(result);
            } else {
                setOptionsArray([{ text: searchLabel, value: NO_RESULTS }]);
            }
        }

        if (!searchText) setOptionsArray(options || []);
    }, [options, searchLabel]);

    const handleCheckChange = (
        optionValue: string | number | boolean | string[],
        checked: boolean
    ) => {
        const stringValue = String(optionValue);
        let newValues: string[];

        if (checked) {
            if (!selectedValues.includes(stringValue)) {
                newValues = [...selectedValues, stringValue];
            } else {
                newValues = selectedValues;
            }
        } else {
            newValues = selectedValues.filter((v) => v !== stringValue);
        }

        setSelectedValues(newValues);

        if (onChange) {
            onChange(newValues);
        }
    };

    const selectedCount = selectedValues.length;

    const getSelectedItems = () => {
        return selectedValues.map((value) => {
            const option = options?.find((opt) => String(opt.value) === value);
            return {
                value,
                text: option?.text || value,
            };
        });
    };

    const selectedItems = getSelectedItems();

    const removeItem = (e: React.MouseEvent, valueToRemove: string) => {
        e.preventDefault();
        e.stopPropagation();
        const newValues = selectedValues.filter((v) => v !== valueToRemove);
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
                onOpenChange={(state) => {
                    setIsOpen(state);
                }}
                defaultOpen={isOpen}>
                <Container className={selectFieldContainer}>
                    <Popover.Trigger asChild>
                        <button
                            type="button"
                            className={selectField}
                            aria-label={label}
                            onBlur={onBlur}>
                            <div className={multiSelectTagsContainer}>
                                {selectedCount === 0 ? (
                                    <span className={multiSelectPlaceholder}>{placeholder}</span>
                                ) : (
                                    selectedItems.map((item) => (
                                        <span key={item.value} className={multiSelectTag}>
                                            {item.text}
                                            <button
                                                type="button"
                                                className={multiSelectTagRemove}
                                                onClick={(e) => removeItem(e, item.value)}
                                                title={`Remove ${item.text}`}
                                                aria-label={`Remove ${item.text}`}>
                                                ×
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>
                            <Container className={selectIcon}>
                                {isOpen ? (
                                    <Icon iconName="chevron-up" iconPrefix="far" />
                                ) : (
                                    <Icon iconName="chevron-down" iconPrefix="far" />
                                )}
                            </Container>
                        </button>
                    </Popover.Trigger>
                </Container>
                <Popover.Portal>
                    <Popover.Content className={selectValuesList}>
                        {searchEnabled && (
                            <div className={filterContainer}>
                                <Filter
                                    placeholder={searchPlaceholderText}
                                    onChange={(searchValue) => filterContent(searchValue)}
                                    fieldName={`search_${fieldName}`}
                                    classNames={{
                                        containerCLassName: classNames?.filterContainer,
                                        inputClassName: classNames?.filterInput,
                                    }}
                                />
                            </div>
                        )}
                        <Container className={selectViewport}>
                            {optionsArray.length === 0 ? (
                                <div className={noOptionsMessage}>
                                    No options available
                                </div>
                            ) : (
                                optionsArray?.map((option, index) => {
                                    if (!option?.value) return null;

                                    const optionValue = String(option.value);
                                    const isChecked = selectedValues.includes(optionValue);
                                    const isNoResults = option.value === NO_RESULTS;

                                    return (
                                        <button
                                            type="button"
                                            key={`${fieldName}_${index}`}
                                            className={`${selectItem} ${isNoResults ? multiSelectOptionButtonDisabled : multiSelectOptionButton}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!isNoResults) {
                                                    handleCheckChange(option.value!, !isChecked);
                                                }
                                            }}
                                            disabled={isNoResults}>
                                            {!isNoResults && (
                                                <Checkbox.Root
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => {
                                                        handleCheckChange(option.value!, checked === true);
                                                    }}
                                                    className={multiSelectCheckbox}>
                                                    <Checkbox.Indicator>
                                                        <Icon 
                                                            iconName="check" 
                                                            iconPrefix="fas"
                                                            className={iconStyle}
                                                        />
                                                    </Checkbox.Indicator>
                                                </Checkbox.Root>
                                            )}
                                            <span className={multiSelectOptionText}>{option.text}</span>
                                            {showSelectedItemIcon && isChecked && !isNoResults && (
                                                <Icon 
                                                    iconName="check" 
                                                    iconPrefix="fas"
                                                    className={selectItemIndicator}
                                                />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </Container>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
            <ErrorMessage error={error} classNames={errorClassNames} />
        </Container>
    );
};