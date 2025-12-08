import { designConstants, themeVars } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const badgeActiveStyle = style({
    backgroundColor: themeVars.steps.badgeBackgroundColor,
    borderColor: themeVars.steps.badgeBorderColor,
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "50%",
    transition: "0.4s ease",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
});

export const progressLineActiveStyle = style({
    backgroundColor: themeVars.steps.progressLineBackgroundColor,
    content: "",
    position: "absolute",
    height: "0.25rem",
    width: "100%",
    top: "50%",
    transition: "0.4s ease",
    transform: "translateY(-50%)",
    left: 0,
});

export const labelStyle = style({
    color: themeVars.steps.labelColor,
    fontSize: designConstants.fontSize.base,
    marginTop: designConstants.spacing.smallPadding,
});

export const labelActiveStyle = style({
    color: themeVars.steps.labelActiveColor,
});