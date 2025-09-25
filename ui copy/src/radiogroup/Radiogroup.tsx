import React from "react";
import { RadioGroup } from "radix-ui";
import { T_RadioGroupProps } from "./types";
import { Container } from "@ui/container";
import {
    radiogroupContainerStyle,
    radiogroupLabelStyle,
    radioIndicatorStyle,
    radioItemContainerStyle,
    radioItemStyle,
    radioLabelStyle,
} from "./styles/radiogroupStyles.css";
import { RadioItemContainer } from "./RadioItemContainer";
import { Label } from "@ui/label";

export const Radiogroup: React.FC<T_RadioGroupProps> = ({
    options,
    fieldName,
    label,
    onChange,
    classNames,
    defaultValue,
    infoItems,
}) => {
    const rootStyle = classNames?.radioRoot || radiogroupContainerStyle;
    const itemContainerStyle = classNames?.radioItemContainer || radioItemContainerStyle;

    const ItemLabelStyle = classNames?.radioLabel || radioLabelStyle;

    const labelStyle = classNames?.radioLabel || radiogroupLabelStyle;
    const indicatorStyle = classNames?.radioIndicator || radioIndicatorStyle;

    const itemStyle = classNames?.radioItem || radioItemStyle;

    return (
        <Container className={radiogroupContainerStyle}>
            <Label htmlFor={fieldName} labelClassName={labelStyle} infoItems={infoItems}>
                {label}
            </Label>
            <RadioGroup.Root
                className={rootStyle}
                name={fieldName}
                defaultValue={defaultValue}
                onValueChange={(e) => onChange(e)}>
                {options.map((option, index) => {
                    return (
                        <RadioItemContainer
                            className={itemContainerStyle}
                            key={`${fieldName}_${index}`}>
                            <RadioGroup.Item
                                className={itemStyle}
                                value={`${option.value}`}
                                id={`${fieldName}_${index}`}>
                                <RadioGroup.Indicator className={indicatorStyle} />
                            </RadioGroup.Item>
                            <label className={ItemLabelStyle} htmlFor={`${option.value}_${index}`}>
                                {option.text}
                            </label>
                        </RadioItemContainer>
                    );
                })}
            </RadioGroup.Root>
            {/* Error here? */}
        </Container>
    );
};
