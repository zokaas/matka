import { style } from "@vanilla-extract/css";
import { vars } from "@ui/themes";

// Steps wrapper
export const stepsWrapperStyle = style({
    marginBottom: "3rem",
});

// Divider/HR
export const dividerStyle = style({
    borderTopWidth: "1px",
    borderColor: vars.color.baseNeutral350, // Using vars instead of CSS variable
    marginBottom: vars.spacing.basicPadding, // Using vars instead of hardcoded "1.5rem"
});

// Button container - when both Back and Next are visible
export const buttonContainerStyle = style({
    marginTop: "50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

// Button container - when only Next is visible (first step)
export const singleButtonContainerStyle = style({
    marginTop: "50px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
});