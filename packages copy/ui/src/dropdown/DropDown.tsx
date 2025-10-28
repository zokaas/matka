import React, { useState } from "react";
import { Select } from "radix-ui";
import {
    dropDownContainerStyle,
    dropDownOpenIconStyle,
    dropDownListStyle,
    dropDownStyle,
    dropDownViewportStyle,
    dropDownItemStyles,
    dropDownItemIndicatorStyles,
    iconStyle,
} from "./styles";
import { Container } from "@ui/container";
import { ItemProps, ItemRef, T_DropDownProps } from "./types";
import { Icon } from "@ui/icon";
import { ErrorMessage } from "@ui/error";
import { Filter } from "@ui/filter";
import { DEFAULT_PLACEHOLDER, NO_RESULTS, NO_RESULTS_DEFAULT_TEXT } from "./dropdown.constants";
import { Label } from "@ui/label";

export const DropDown: React.FC<T_DropDownProps> = ({
    fieldName,
    label,
    options,
    onChange,
    onBlur,
    placeholder,
    errorClassNames,
    error,
    classNames,
    showSelectedItemIcon,
    searchEnabled,
    searchNoResultsText,
    searchPlaceholder,
    infoItems,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [optionsArray, setOptionsArray] = useState(options || []);

    const selectContainer = classNames?.dropDownContainer || dropDownContainerStyle;
    const selectField = classNames?.dropDownField || dropDownStyle;
    const selectValue = classNames?.dropDownValue || "";
    const selectIcon = classNames?.dropDownIcon || dropDownOpenIconStyle;
    const selectValuesList = classNames?.dropDownSelectionList || dropDownListStyle;
    const selectViewport = classNames?.dropDownViewport || dropDownViewportStyle;
    const selectItem = classNames?.dropDownItem || dropDownItemStyles;
    const selectItemIndicator = classNames?.dropDownItemIndicator || dropDownItemIndicatorStyles;
    const searchLabel = searchNoResultsText || NO_RESULTS_DEFAULT_TEXT;
    const searchPlaceholderText = searchPlaceholder || DEFAULT_PLACEHOLDER;

    const filterContent = (searchText: string) => {
        if (searchText.length > 1 && options) {
            const result = options?.filter((option) =>
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
    return (
        <Container className={selectContainer}>
            <Label htmlFor={fieldName} infoItems={infoItems}>
                {label}
            </Label>
            <Select.Root
                onValueChange={(e) => onChange(e)}
                onOpenChange={(state) => {
                    setIsOpen(state);
                }}
                defaultOpen={isOpen}
                name={fieldName}>
                <Select.Trigger
                    className={selectField}
                    aria-label={label}
                    onBlur={(e) => onBlur(e)}>
                    <Select.Value placeholder={placeholder} className={selectValue} />
                    <Select.Icon className={selectIcon}>
                        {isOpen ? (
                            <Icon iconName="chevron-up" iconPrefix="far" />
                        ) : (
                            <Icon iconName="chevron-down" iconPrefix="far" />
                        )}
                    </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                    <Select.Content
                        className={selectValuesList}
                        position="popper"
                        sideOffset={5}
                        collisionPadding={10}>
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
                        <Select.Viewport className={selectViewport}>
                            {optionsArray?.map((option, index) => (
                                <SelectItem
                                    value={`${option.value}`}
                                    disabled={option.value === NO_RESULTS}
                                    className={selectItem}
                                    indicatorClassName={selectItemIndicator}
                                    showSelectedIndicator={showSelectedItemIcon}
                                    key={`${fieldName}_${index}`}>
                                    {option.text}
                                </SelectItem>
                            ))}
                        </Select.Viewport>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
            <ErrorMessage error={error} classNames={errorClassNames} />
        </Container>
    );
};

const SelectItem = React.forwardRef<ItemRef, ItemProps>(
    (
        { children, className, indicatorClassName, showSelectedIndicator, ...props },
        forwardedRef
    ) => {
        return (
            <Select.Item className={className} {...props} ref={forwardedRef}>
                <Select.ItemText>{children}</Select.ItemText>
                {showSelectedIndicator && (
                    <Select.ItemIndicator className={indicatorClassName}>
                        <Icon iconName="check" iconPrefix="fas" className={iconStyle} />
                    </Select.ItemIndicator>
                )}
            </Select.Item>
        );
    }
);
