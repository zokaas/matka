export type T_TooltipProps = {
    header: string;
    description?: string | null;
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    classNames?: T_TooltipClassNames;
};

export type T_TooltipClassNames = {
    tooltipTrigger?: string;
    tooltipContent?: string;
    tooltipArrow?: string;
    tooltipHeader?: string;
    tooltipDescription?: string;
};