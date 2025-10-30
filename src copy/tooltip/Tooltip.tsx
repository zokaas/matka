import React, { useState } from "react";
import { Tooltip as RadixTooltip } from "radix-ui";
import { T_TooltipProps } from "./types";
import { Icon } from "@ui/icon";
import {
    tooltipTriggerStyles,
    tooltipContentStyles,
    tooltipArrowStyles,
    tooltipHeaderStyles,
    tooltipDescriptionStyles,
} from "./styles";

export const Tooltip: React.FC<T_TooltipProps> = ({
    header,
    description,
    side = "top",
    sideOffset = 5,
    classNames,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const triggerStyles = classNames?.tooltipTrigger || tooltipTriggerStyles;
    const contentStyles = classNames?.tooltipContent || tooltipContentStyles;
    const arrowStyles = classNames?.tooltipArrow || tooltipArrowStyles;
    const headerStyles = classNames?.tooltipHeader || tooltipHeaderStyles;
    const descriptionStyles = classNames?.tooltipDescription || tooltipDescriptionStyles;

    return (
        <RadixTooltip.Provider>
            <RadixTooltip.Root open={isOpen} onOpenChange={setIsOpen}>
                <RadixTooltip.Trigger asChild>
                    <button
                        type="button"
                        className={triggerStyles}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Show information">
                        <Icon iconName="info" iconPrefix="fas" />
                    </button>
                </RadixTooltip.Trigger>
                <RadixTooltip.Portal>
                    <RadixTooltip.Content
                        className={contentStyles}
                        side={side}
                        sideOffset={sideOffset}>
                        {header && <h4 className={headerStyles}>{header}</h4>}
                        {description && <p className={descriptionStyles}>{description}</p>}
                        <RadixTooltip.Arrow className={arrowStyles} />
                    </RadixTooltip.Content>
                </RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    );
};
