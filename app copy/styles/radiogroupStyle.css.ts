import { designConstants, themeVars } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const b2bRadioLabelStyle = style({
    // Structure
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    paddingLeft: designConstants.spacing.smallPadding,
    
    // Appearance
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});

export const b2bRadiogroupRootStyle = style({
    // Structure
    display: "flex",
    flexDirection: "row",
    gap: designConstants.spacing.smallPadding,
    marginTop: designConstants.spacing.tinyPadding,
});

export const b2bRadioItemStyle = style({
    // Structure
    all: "unset",
    width: "24px",
    height: "24px",
    borderRadius: "100%",
    cursor: "pointer",
    transition: `box-shadow ${designConstants.transitions.base}`,
    
    // Appearance
    boxShadow: `inset 0 1px 4px 0 ${themeVars.color.blackAlpha50}`,
    backgroundColor: themeVars.color.baseWhite400,
    
    ":hover": {
        boxShadow: "inset 0 1px 4px 0 #268fe0",
    },
});

export const b2bRadioIndicatorStyle = style({
    // Structure
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative",
    
    "::after": {
        content: "",
        display: "block",
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: "#2e6db4", // Specific blue for B2B
    },
});

export const b2bRadioItemLabelStyle = style({
    // Structure
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    
    // Appearance
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});
