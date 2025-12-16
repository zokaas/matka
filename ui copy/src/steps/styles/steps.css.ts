import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const stepsStyle = style({
    margin: "0 auto",
    padding: `0 ${designConstants.spacing.smallPadding}`,
});

export const stepsContainerStyle = style({
    display: "flex",
    justifyContent: "space-between",
    marginTop: designConstants.spacing.largePadding,
    position: "relative",

    "::before": {
        content: "",
        position: "absolute",
        height: designConstants.spacing.defaultPadding,
        width: designConstants.width.full,
        top: "50%",
        transform: "translateY(-50%)",
        left: 0,

        background: themeVars.color.baseWhite400,
    },
});

export const stepsFilledLineStyle = style({
    content: "",
    position: "absolute",
    height: designConstants.spacing.defaultPadding,
    width: designConstants.width.full,
    top: "50%",
    transform: "translateY(-50%)",
    left: 0,
    transition: designConstants.transitions.slower,

    background: themeVars.steps.progressLineBackgroundColor,
});
