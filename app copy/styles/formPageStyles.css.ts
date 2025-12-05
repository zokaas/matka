// app/styles/formPageStyles.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const stepsWrapperStyle = style({
    // Structure
    marginBottom: designConstants.spacing.largePadding,
    position: "relative",
    paddingBottom: designConstants.spacing.largePadding,
});

export const dividerStyle = style({
    // Structure
    borderTopWidth: "1px",
    marginBottom: designConstants.spacing.basicPadding,
    
    // Appearance
    borderColor: themeVars.color.baseNeutral350,
});

export const buttonContainerStyle = style({
    // Structure
    marginTop: "50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: designConstants.spacing.smallPadding,
});

export const singleButtonContainerStyle = style({
    // Structure
    marginTop: "50px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
});