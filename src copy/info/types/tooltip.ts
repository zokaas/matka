export type T_TooltipProps = {
    content: string;
    description?: string | null;
    trigger?: string;
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    className?: string;
};