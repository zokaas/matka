import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const stepContainerStyle = style({
    position: "relative",
    zIndex: 2,

    "@media": {
        "screen and (max-width: 480px)": {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: designConstants.spacing.smallPadding,
        },
    },
});

export const stepCircleStyle = style({
    width: designConstants.size.xl,
    height: designConstants.size.xl,
    minWidth: designConstants.size.xl,
    minHeight: designConstants.size.xl,
    maxWidth: designConstants.size.xl,
    maxHeight: designConstants.size.xl,
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    transition: designConstants.transitions.slower,
    backgroundColor: themeVars.color.baseWhite400,
    borderColor: themeVars.color.baseWhite400,
    flexShrink: 0,
    boxSizing: "border-box",

    "@media": {
        "screen and (max-width: 480px)": {
            margin: 0,
        },
    },
});

export const stepCircleCompletedStyle = style({
    backgroundColor: themeVars.steps.badgeBackgroundColor,
    borderColor: themeVars.steps.badgeBackgroundColor,
});

export const stepCountSyle = style({
    fontSize: designConstants.fontSize.sm,
    lineHeight: designConstants.lineHeight.tight,
    fontWeight: designConstants.fontWeight.normal,
    color: themeVars.steps.labelColor,
});

export const stepActiveStyle = style({
    color: themeVars.color.baseWhite100,
    fontWeight: designConstants.fontWeight.semiBold,
});

export const stepDoneStyle = style({
    fontSize: designConstants.fontSize.xl,
    fontWeight: designConstants.fontWeight.semiBold,
    lineHeight: "1",
    color: themeVars.color.baseWhite100,
});

export const stepLabelContainerStyle = style({
    position: "absolute",
    top: "50px",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
    maxWidth: "150px",

    "@media": {
        "screen and (max-width: 480px)": {
            position: "static",
            transform: "none",
            textAlign: "left",
            maxWidth: "none",
            flex: 1,
        },
    },
});

export const stepLabelStyle = style({
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    marginTop: designConstants.spacing.tinyPadding,
    color: themeVars.steps.labelColor,

    "@media": {
        "screen and (max-width: 480px)": {
            marginTop: 0,
            fontSize: designConstants.fontSize.base,
            lineHeight: "1.3",
        },
    },
});

export const stepActiveLabelStyle = style({
    fontSize: designConstants.fontSize.base,
    color: themeVars.steps.labelActiveColor,
    fontWeight: designConstants.fontWeight.normal,
});
