import { T_IconType } from "@ui/button";
import { ReactElement } from "react";

export type T_PopoverClassNames = {
    popoverButton?: string;
    popoverContent?: string;
    popoverArrow?: string;
    popoverCloseIcon?: string;
};

export type T_PopoverProps = {
    children: ReactElement;
    classNames?: T_PopoverClassNames;
    popoverIcon?: T_IconType;
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    popoverOpen: boolean;
    setPopoverOpen: (state: boolean) => void;
};
