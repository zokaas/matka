import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const stepContainerStyle = style({
    position: "relative",
    zIndex: 1,
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
    top: "65px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
});

export const stepLabelStyle = style({
    fontSize: designConstants.fontSize.sm,
    lineHeight: designConstants.lineHeight.normal,
    marginTop: designConstants.spacing.tinyPadding,
    color: themeVars.steps.labelColor,
});

export const stepActiveLabelStyle = style({
    color: themeVars.steps.labelActiveColor,
    fontWeight: designConstants.fontWeight.semiBold,
});
