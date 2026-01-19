import { CSSObject } from "@styled-system/css";
import { E_Fonts } from "../general";

export function tableLayout(): CSSObject {
    return {};
}
export function tableHeaders(): CSSObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
        color: E_Fonts.BASIC_FONT_COLOR,
        fontWeight: "bold",
    };
}
export function tableCell(): CSSObject {
    return {
        fontFamily: E_Fonts.FONT_FAMILY,
        color: E_Fonts.BASIC_FONT_COLOR,
        fontSize: E_Fonts.BASIC_FONT_SIZE,
    };
}
export function tableRows(): CSSObject {
    return {};
}
export function tablePaginator(): CSSObject {
    return {};
}
