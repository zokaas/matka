import { SystemStyleObject } from "@styled-system/css";
import { E_Colors } from "../general";
export declare function buttonStyles(): SystemStyleObject;
export declare function buttonTextStyles(): SystemStyleObject;
type T_GreenButtonStyles = {
    width?: string | Array<string>;
    marginTop?: string | Array<string>;
    marginRight?: string | Array<string>;
    marginBottom?: string | Array<string>;
};
export declare function greenButtonStyles(props?: T_GreenButtonStyles): SystemStyleObject;
export declare function grayButtonStyles(props?: T_GreenButtonStyles): SystemStyleObject;
export declare function buttonFontStyles(): SystemStyleObject;
export declare function disabledButtonStyles(props?: T_GreenButtonStyles): SystemStyleObject;
type T_WhiteButtonStyles = {
    width?: string | Array<string>;
    height?: string | Array<string>;
};
export declare function whiteButtonStyles(props?: T_WhiteButtonStyles): {
    width: string | string[];
    height: string | string[];
    color: E_Colors;
    borderRadius: string;
    border: string;
    boxShadow: string;
    background: string;
    ":hover": {
        boxShadow: string;
        border: string;
        color: string;
        cursor: string;
    };
    ":active": {
        backgroundColor: string;
        cursor: string;
    };
    ":disabled": {
        background: string;
        boxShadow: string;
    };
};
export declare function whiteButtonLoanPageStyles(props?: T_WhiteButtonStyles): SystemStyleObject;
export declare function whiteButtonFontStyles(): SystemStyleObject;
export declare function backButtonStyles(): SystemStyleObject;
export declare function backButtonFontStyles(): SystemStyleObject;
export {};
