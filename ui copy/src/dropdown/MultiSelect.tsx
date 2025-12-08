import React, { useState } from "react";
import { Popover, Checkbox } from "radix-ui";
import { ErrorMessage } from "@ui/error";
import { Container } from "@ui/container";
import { Filter } from "@ui/filter";
import { Icon } from "@ui/icon";
import { Label } from "@ui/label";
import { NO_RESULTS, NO_RESULTS_DEFAULT_TEXT, DEFAULT_PLACEHOLDER } from "./dropdown.constants";
import {
    iconStyle,
    dropDownContainerStyle,
    dropDownOpenIconStyle,
    multiSelectListStyle,
    dropDownViewportStyle,
    multiSelectFieldContainer,
    selectPlaceholder,
    multiSelectTagsContainer,
    multiSelectTag,
    multiSelectTagRemove,
    multiSelectCheckbox,
    multiSelectOptionButton,
    multiSelectOptionText,
    multiSelectFieldButton,
} from "./styles";
import { T_MultiSelectProps } from "./types";

export const MultiSelect: React.FC<T_MultiSelectProps> = ({
    fieldName,
    label,
    options,
    onChange,
    onBlur,
    placeholder,
    value,
    errorClassNames,
    error,
    classNames,
    searchEnabled,
    searchNoResultsText,
    searchPlaceholder,
    infoItems,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [optionsArray, setOptionsArray] = useState(options || []);

    const selectedValues: string[] = Array.isArray(value) ? value.map(String) : [];
    const selectContainer = classNames?.dropDownContainer || dropDownContainerStyle;
    const selectField = classNames?.dropDownField || multiSelectFieldButton;
    const selectIcon = classNames?.dropDownIcon || dropDownOpenIconStyle;
    const selectValuesList = classNames?.dropDownSelectionList || multiSelectListStyle;
    const selectViewport = classNames?.dropDownViewport || dropDownViewportStyle;
    const selectFieldContainer = classNames?.multiSelectFieldContainer || multiSelectFieldContainer;
    const selectValue = classNames?.dropDownValue || selectPlaceholder;
    const selectTagsContainer = classNames?.multiSelectTagsContainer || multiSelectTagsContainer;
    const selectTag = classNames?.multiSelectTag || multiSelectTag;
    const selectTagRemove = classNames?.multiSelectTagRemove || multiSelectTagRemove;
    const selectCheckbox = classNames?.multiSelectCheckbox || multiSelectCheckbox;
    const selectOptionButton = classNames?.multiSelectOptionButton || multiSelectOptionButton;
    const selectOptionText = classNames?.multiSelectOptionText || multiSelectOptionText;

    const searchLabel = searchNoResultsText || NO_RESULTS_DEFAULT_TEXT;
    const searchPlaceholderText = searchPlaceholder || DEFAULT_PLACEHOLDER;

    const filterContent = (searchText: string) => {
        if (searchText.length > 1 && options) {
            const result = options.filter((option) =>
                option.text.toLowerCase().includes(searchText.toLowerCase())
            );
            if (result.length > 0) {
                setOptionsArray(result);
            } else {
                setOptionsArray([{ text: searchLabel, value: NO_RESULTS }]);
            }
        }
        if (!searchText) setOptionsArray(options || []);
    };

    const handleCheckChange = (optionValue: string | number | boolean, checked: boolean) => {
        const stringValue = String(optionValue);
        let newValues: Array<string>;

        if (checked) {
            newValues = selectedValues.includes(stringValue)
                ? selectedValues
                : [...selectedValues, stringValue];
        } else {
            newValues = selectedValues.filter((v) => v !== stringValue);
        }

        onChange?.(newValues);
    };

    const selectedItems = selectedValues.map((value) => {
        const option = options?.find((opt) => String(opt.value) === value);
        return { value, text: option?.text };
    });

    const removeItem = (e: React.MouseEvent, valueToRemove: string) => {
        e.preventDefault();
        e.stopPropagation();
        const newValues = selectedValues.filter((v) => v !== valueToRemove);
        onChange?.(newValues);
    };

    const optionItems = optionsArray.map((option, index) => {
        if (option?.value === undefined || option?.value === null) return null;

        const optionValue = String(option.value);
        const isChecked = selectedValues.includes(optionValue);
        const isNoResults = option.value === NO_RESULTS;

        return (
            <label
                key={`${fieldName}_${index}`}
                className={selectOptionButton}
                style={isNoResults ? { cursor: "not-allowed", opacity: 0.5 } : undefined}>
                {!isNoResults && (
                    <Checkbox.Root
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                            handleCheckChange(
                                option.value as string | number | boolean,
                                checked === true
                            );
                        }}
                        className={selectCheckbox}>
                        <Checkbox.Indicator>
                            <Icon iconName="check" iconPrefix="fas" className={iconStyle} />
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                )}
                <span className={selectOptionText}>{option.text}</span>
            </label>
        );
    });

    return (
        <Container className={selectContainer}>
            <Label htmlFor={fieldName} infoItems={infoItems}>
                {label}
            </Label>

            <Popover.Root onOpenChange={setIsOpen} open={isOpen}>
                <Container className={selectFieldContainer}>
                    <Popover.Trigger asChild>
                        <button
                            type="button"
                            className={multiSelectFieldButton}
                            aria-label={label}
                            onBlur={onBlur}>
                            <div className={selectTagsContainer}>
                                {selectedItems.length === 0 ? (
                                    <span className={selectValue}>{placeholder}</span>
                                ) : (
                                    selectedItems.map((item) => (
                                        <span key={item.value} className={selectTag}>
                                            {item.text}
                                            <input
                                                type="button"
                                                className={selectTagRemove}
                                                onClick={(e) => removeItem(e, item.value)}
                                                value="×"
                                                title={`Remove ${item.text}`}
                                                aria-label={`Remove ${item.text}`}
                                            />
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
                    <Popover.Content
                        className={selectValuesList}
                        align="start"
                        sideOffset={5}
                        collisionPadding={10}
                        style={{ width: "var(--radix-popover-trigger-width)" }}>
                        {searchEnabled && (
                            <Filter
                                placeholder={searchPlaceholderText}
                                onChange={(searchValue) => filterContent(searchValue)}
                                fieldName={`search_${fieldName}`}
                                classNames={{
                                    containerClassName: classNames?.filterContainer,
                                    inputClassName: classNames?.filterInput,
                                }}
                            />
                        )}
                        <Container className={selectViewport}>{optionItems}</Container>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>

            <ErrorMessage error={error} classNames={errorClassNames} />
        </Container>
    );
};
