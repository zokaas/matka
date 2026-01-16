import { style, styleVariants, globalStyle } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const stepsComponentContainerStyle = style({
    padding: `0 ${designConstants.spacing.largePadding} ${designConstants.spacing.largePadding} ${designConstants.spacing.largePadding}`,

    "@media": {
        "screen and (max-width: 768px)": {
            padding: `0 ${designConstants.spacing.smallPadding} ${designConstants.spacing.largePadding} ${designConstants.spacing.smallPadding}`,
        },
        "screen and (max-width: 480px)": {
            padding: `0 ${designConstants.spacing.smallPadding} ${designConstants.spacing.basicPadding} ${designConstants.spacing.smallPadding}`,
        },
    },
});

export const stepsStyle = style({
    margin: "0 auto",
    padding: `0 ${designConstants.spacing.smallPadding}`,
});

export const stepsContainerStyle = style({
    display: "flex",
    justifyContent: "space-between",
    marginTop: designConstants.spacing.largePadding,
    position: "relative",

    "@media": {
        "screen and (max-width: 480px)": {
            flexDirection: "column",
            alignItems: "stretch",
            gap: designConstants.spacing.smallPadding,
            paddingBottom: 0,
            marginTop: designConstants.spacing.basicPadding,
        },
    },

    selectors: {
        "&::before": {
            content: "",
            position: "absolute",
            height: designConstants.spacing.defaultPadding,
            width: designConstants.width.full,
            top: "50%",
            transform: "translateY(-50%)",
            left: 0,
            background: themeVars.color.baseWhite400,
            zIndex: 0,
        },
    },
});

globalStyle(`${stepsContainerStyle}::before`, {
    "@media": {
        "screen and (max-width: 480px)": {
            width: designConstants.spacing.defaultPadding,
            height: "100%",
            top: 0,
            left: "20px",
            transform: "none",
            clipPath: "inset(20px 0 20px 0)",
        },
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
    zIndex: 0,

    "@media": {
        "screen and (max-width: 480px)": {
            width: designConstants.spacing.defaultPadding,
            height: "var(--mobile-progress-height, 0%)",
            top: 0,
            left: "20px",
            transform: "none",
            clipPath: "inset(20px 0 0 0)",
        },
    },
});
