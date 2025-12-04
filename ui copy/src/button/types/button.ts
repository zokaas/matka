import { Icon } from "@ui/icon";
import { ReactElement } from "react";

export type T_IconType = ReactElement<typeof Icon>;

/* 
Allow just plain text, Icon or combination of text and Icon as children to button
Right now, I can't imagine that we would need something else than these two
*/
type T_LabelType = string | T_IconType | [string, T_IconType] | [T_IconType, string];

export type T_ButtonProps = {
    type: "button" | "submit" | "reset";
    label: T_LabelType;
    //onClick: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    ariaLabel?: string;
};
