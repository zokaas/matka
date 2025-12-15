import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const buttonStyles = style({
    width: "auto",
    height: "auto",
    padding: `${designConstants.spacing.tinyPadding} ${designConstants.spacing.smallPadding}`,
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.normal,
    lineHeight: designConstants.lineHeight.normal,
    borderRadius: designConstants.radius.md,
    border: "none",
    cursor: "pointer",
    transition: `all ${designConstants.transitions.base}`,

    boxShadow: designConstants.shadows.md,
    backgroundImage: `linear-gradient(to top, ${themeVars.color.baseWhite400}, ${themeVars.color.baseWhite100})`,
    color: themeVars.color.baseContent,

    ":hover": {
        backgroundImage: `linear-gradient(to top, ${themeVars.color.baseWhite200}, ${themeVars.color.baseWhite100})`,
        boxShadow: designConstants.shadows.md,
    },

    ":disabled": {
        color: themeVars.color.baseGray500,
        cursor: "not-allowed",
        opacity: 0.6,
    },
});
