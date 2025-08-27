import React, { useState } from "react";
import { Select } from "radix-ui";
import {
    dropDownContainerStyle,
    dropDownOpenIconStyle,
    dropDownListStyle,
    dropDownStyle,
    dropDownViewportStyle,
    dropDownItemStyles,
    dropdownItemIndicatorStyles,
    dropDownLabel,
} from "./styles";
import { Container } from "@ui/container";
import { ItemProps, ItemRef, T_DropDownProps } from "./types";
import { Icon } from "@ui/icon";
import { ErrorMessage } from "@ui/error";

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
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectContainer = classNames?.dropDownContainer || dropDownContainerStyle;
    const selectLabel = classNames?.dropDownLabel || dropDownLabel;
    const selectField = classNames?.dropDownField || dropDownStyle;
    const selectValue = classNames?.dropdownValue || dropDownOpenIconStyle;
    const selectIcon = classNames?.dropDownIcon || dropDownOpenIconStyle;
    const selectValuesList = classNames?.dropDownSelectionList || dropDownListStyle;
    const selectViewport = classNames?.dropDownViewport || dropDownViewportStyle;
    const selectItem = classNames?.dropDownItem || dropDownItemStyles;
    const selectItemIndicator = classNames?.dropDownItemIndicator || dropdownItemIndicatorStyles;

    return (
        <Container className={selectContainer}>
            <label className={selectLabel} htmlFor={fieldName}>
                {label}
            </label>
            <Select.Root
                onValueChange={(e) => onChange(e)}
                onOpenChange={(state) => {
                    setIsOpen(state);
                }}
                defaultOpen={isOpen}>
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
                    <Select.Content className={selectValuesList}>
                        <Select.Viewport className={selectViewport}>
                            {options?.map((option, index) => (
                                <SelectItem
                                    value={`${option.value}`}
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
                        <Icon iconName="check" iconPrefix="fas" />
                    </Select.ItemIndicator>
                )}
            </Select.Item>
        );
    }
);
