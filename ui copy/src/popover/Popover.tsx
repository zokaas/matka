import React from "react";
import { Popover as RadixPopover } from "radix-ui";
import { T_PopoverProps } from "./types";
import {
    popoverArrowStyles,
    popoverButtonStyles,
    popoverCloseIconStyles,
    popoverContentStyles,
} from "./styles";
import { Icon } from "@ui/icon";

export const Popover: React.FC<T_PopoverProps> = ({
    children,
    classNames,
    popoverIcon,
    side,
    sideOffset,
    popoverOpen,
    setPopoverOpen,
}) => {
    const buttonStyles = classNames?.popoverButton || popoverButtonStyles;
    const contentStyles = classNames?.popoverContent || popoverContentStyles;
    const arrowStyles = classNames?.popoverArrow || popoverArrowStyles;
    const buttonIcon = popoverIcon || <Icon iconName="plus" iconPrefix="fas" />;
    const closeIcon = classNames?.popoverCloseIcon || popoverCloseIconStyles;
    const popoverSide = side || "bottom";
    const popoverSideOffset = sideOffset || 0;

    return (
        <RadixPopover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
            <RadixPopover.Trigger asChild>
                <button
                    className={buttonStyles}
                    onClick={(popoverOpen) => setPopoverOpen(!popoverOpen)}>
                    {buttonIcon}
                </button>
            </RadixPopover.Trigger>
            <RadixPopover.Portal>
                <RadixPopover.Content
                    className={contentStyles}
                    side={popoverSide}
                    sideOffset={popoverSideOffset}>
                    {children}
                    <RadixPopover.Close
                        className={closeIcon}
                        onClick={(popoverOpen) => setPopoverOpen(!popoverOpen)}>
                        <Icon iconPrefix="fas" iconName="xmark" />
                    </RadixPopover.Close>
                    <RadixPopover.Arrow className={arrowStyles} />
                </RadixPopover.Content>
            </RadixPopover.Portal>
        </RadixPopover.Root>
    );
};
