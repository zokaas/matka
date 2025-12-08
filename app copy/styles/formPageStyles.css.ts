// app/styles/formPageStyles.css.ts
import { style } from "@vanilla-extract/css";
import { themeVars, designConstants } from "@ui/themes";

export const stepsWrapperStyle = style({
    marginBottom: designConstants.spacing.smallPadding,  // 16px ✅
    position: "relative",
    paddingBottom: designConstants.spacing.largePadding,  // 32px ✅
});
    
export const dividerStyle = style({
    borderColor: themeVars.color.blackAlpha20,
    marginTop: designConstants.spacing.largePadding,
    marginBottom: designConstants.spacing.basicPadding,
});

export const buttonContainerStyle = style({
    marginTop: designConstants.spacing.largePadding,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

export const singleButtonContainerStyle = style({
    marginTop: designConstants.spacing.largePadding,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
});