import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const errorTextStyle = style({
    fontSize: designConstants.fontSize.sm,
    fontWeight: designConstants.fontWeight.normal,
    
    color: themeVars.color.error,
});