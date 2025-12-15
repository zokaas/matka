import React, { useState, useMemo } from "react";
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


    const selectedIds: Array<number> = useMemo(() => {
        return Array.isArray(value) ? value.map(Number).filter((id) => !Number.isNaN(id)) : [];
    }, [value]);

    const selectedTexts = useMemo(() => {
        return selectedIds
            .map((id) => {
                const opt = options?.find((o) => o.id === id);
                return opt?.text || "";
            })
            .filter(Boolean);
    }, [selectedIds, options]);

    const selectContainer = classNames?.dropDownContainer || dropDownContainerStyle;
    const selectIcon = classNames?.dropDownIcon || dropDownOpenIconStyle;
    const selectValuesList = classNames?.dropDownSelectionList || multiSelectListStyle;
    const selectViewport = classNames?.dropDownViewport || dropDownViewportStyle;
    const selectFieldContainer = classNames?.multiSelectFieldContainer || multiSelectFieldContainer;
    const selectValue = classNames?.dropDownValue || selectPlaceholder;
    const tagsContainer = classNames?.multiSelectTagsContainer || multiSelectTagsContainer;
    const tagStyle = classNames?.multiSelectTag || multiSelectTag;
    const tagRemove = classNames?.multiSelectTagRemove || multiSelectTagRemove;
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

    const handleCheckChange = (optionId: number, checked: boolean) => {
        const option = options?.find((opt) => opt.id === optionId);
        if (!option) return;

        let newIds: number[];

        if (checked) {
            newIds = selectedIds.includes(optionId) ? selectedIds : [...selectedIds, optionId];
        } else {
            newIds = selectedIds.filter((id) => id !== optionId);
        }

        onChange?.(newIds);
    };

    const removeItem = (e: React.MouseEvent, itemId: number) => {
        e.preventDefault();
        e.stopPropagation();

        const newIds = selectedIds.filter((id) => id !== itemId);
        onChange?.(newIds);
    };

    const optionItems = optionsArray.map((option, index) => {
        if (option?.value === undefined || option?.value === null) return null;

        const optionId = option.id;
        if (!optionId) return null; // Skip options without IDs

        const isChecked = selectedIds.includes(optionId);
        const isNoResults = option.value === NO_RESULTS;

        return (
            <label
                key={`${fieldName}_${optionId}_${index}`}
                className={selectOptionButton}
                style={isNoResults ? { cursor: "not-allowed", opacity: 0.5 } : undefined}>
                {!isNoResults && (
                    <Checkbox.Root
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                            handleCheckChange(optionId, checked === true);
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
                            <div className={tagsContainer}>
                                {selectedTexts.length === 0 ? (
                                    <span className={selectValue}>{placeholder}</span>
                                ) : (
                                    selectedTexts.map((text, idx) => {
                                        const opt = options?.find((o) => o.text === text);
                                        const optId = opt?.id;
                                        const itemId = optId || idx;
                                        return (
                                            <span key={`tag_${itemId}_${idx}`} className={tagStyle}>
                                                {text}
                                                {optId !== undefined && (
                                                    <input
                                                        type="button"
                                                        className={tagRemove}
                                                        onClick={(e) => removeItem(e, optId)}
                                                        value="×"
                                                        title={`Remove ${text}`}
                                                        aria-label={`Remove ${text}`}
                                                    />
                                                )}
                                            </span>
                                        );
                                    })
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
