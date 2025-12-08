// ui/src/steps/styles/steps.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const stepsStyle = style({
    // Structure
    margin: "0 auto",
    padding: `0 ${designConstants.spacing.smallPadding}`,
});

export const stepsContainerStyle = style({
    // Structure
    display: "flex",
    justifyContent: "space-between",
    marginTop: designConstants.spacing.largePadding,
    position: "relative",
    
    // Background line (unfilled)
    "::before": {
        content: "",
        position: "absolute",
        height: designConstants.spacing.defaultPadding,
        width: designConstants.width.full,
        top: "50%",
        transform: "translateY(-50%)",
        left: 0,
        
        // Appearance
        background: themeVars.color.baseWhite400,
    },
});

export const stepsFilledLineStyle = style({
    // Structure
    content: "",
    position: "absolute",
    height: designConstants.spacing.defaultPadding,
    width: designConstants.width.full,
    top: "50%",
    transform: "translateY(-50%)",
    left: 0,
    transition: designConstants.transitions.slower,
    
    // Appearance
    background: themeVars.steps.progressLineBackgroundColor,
});