import React from "react";
import { ItemProps, ItemRef } from "./types";
import { Icon } from "@ui/icon";
import { Select } from "radix-ui";
import { iconStyle } from "./styles";

export const SelectItem = React.forwardRef<ItemRef, ItemProps>(
    (
        { children, className, indicatorClassName, showSelectedIndicator, ...props },
        forwardedRef
    ) => {
        return (
            <Select.Item className={className} {...props} ref={forwardedRef}>
                <Select.ItemText>{children}</Select.ItemText>
                {showSelectedIndicator && (
                    <Select.ItemIndicator className={indicatorClassName}>
                        <Icon iconName="check" iconPrefix="fas" className={iconStyle}/>
                    </Select.ItemIndicator>
                )}
            </Select.Item>
        );
    }
);