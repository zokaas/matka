import React from "react";
import { Checkbox as RadixCheckbox } from "radix-ui";
import { T_CheckboxProps } from "./types";
import { Container } from "@ui/container";
import { Label } from "@ui/label";
import { ErrorMessage } from "@ui/error";
import { Icon } from "@ui/icon";
import {
    checkboxContainerStyle,
    checkboxFieldContainerStyle,
    checkboxRootStyle,
    checkboxIndicatorStyle,
    checkboxLabelStyle,
} from "./styles";

export const Checkbox: React.FC<T_CheckboxProps> = ({
    fieldName,
    label,
    checked = false,
    onChange,
    onBlur,
    classNames,
    error,
    errorClassNames,
    disabled,
    infoItems,
}) => {
    const containerStyle = classNames?.checkboxContainer || checkboxContainerStyle;
    const fieldContainerStyle = classNames?.checkboxFieldContainer || checkboxFieldContainerStyle;
    const rootStyle = classNames?.checkboxRoot || checkboxRootStyle;
    const indicatorStyle = classNames?.checkboxIndicator || checkboxIndicatorStyle;
    const labelStyle = classNames?.checkboxLabel || checkboxLabelStyle;

    return (
        <Container className={containerStyle}>
            <Container className={fieldContainerStyle}>
                <RadixCheckbox.Root
                    className={rootStyle}
                    checked={checked}
                    onCheckedChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    id={fieldName}
                    name={fieldName}>
                    <RadixCheckbox.Indicator className={indicatorStyle}>
                        <Icon iconName="check" iconPrefix="fas" />
                    </RadixCheckbox.Indicator>
                </RadixCheckbox.Root>
                <Label 
                    htmlFor={fieldName} 
                    labelClassName={labelStyle}
                    infoItems={infoItems}>
                    {label}
                </Label>
            </Container>
            <ErrorMessage error={error} classNames={errorClassNames} />
        </Container>
    );
};