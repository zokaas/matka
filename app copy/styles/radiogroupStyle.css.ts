import { style } from "@vanilla-extract/css";
import { themeVars, designConstants } from "@ui/themes";

export const b2bRadioLabelStyle = style({
    color: themeVars.color.baseContent,
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    paddingLeft: designConstants.spacing.smallPadding,
});

export const b2bRadiogroupRootStyle = style({
    display: "flex",
    flexDirection: "row",
    gap: designConstants.spacing.smallPadding,
    marginTop: designConstants.spacing.tinyPadding,
});

export const b2bRadioItemStyle = style({
    all: "unset",
    width: "24px",
    height: "24px",
    borderRadius: "100%",
    boxShadow: `inset 0 1px 4px 0 ${themeVars.color.blackAlpha50}`,
    backgroundColor: themeVars.color.baseWhite400,
    ":hover": {
        boxShadow: "inset 0 1px 4px 0 #268fe0",
    },
});

export const b2bRadioIndicatorStyle = style({
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
        backgroundColor: "#2e6db4",
    },
});

export const b2bRadioItemLabelStyle = style({
    color: themeVars.color.baseContent,
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
});