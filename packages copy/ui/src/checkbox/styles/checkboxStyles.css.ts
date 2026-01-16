import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const checkboxContainerStyle = style({
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    width: designConstants.width.full,
});

export const checkboxFieldContainerStyle = style({
    display: "flex",
    alignItems: "center",
    gap: designConstants.spacing.smallPadding,
});

export const checkboxRootStyle = style({
    all: "unset",
    width: "20px",
    height: "20px",
    minWidth: "20px",
    minHeight: "20px",
    borderRadius: designConstants.radius.sm,
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    cursor: "pointer",
    transition: `all ${designConstants.transitions.base}`,
    boxSizing: "border-box",
    marginTop: "2px",

    backgroundColor: themeVars.color.baseWhite100,
    borderColor: themeVars.color.baseWhite400,
    boxShadow: `inset 0px 1px 4px 0px ${themeVars.color.blackAlpha20}`,

    ":hover": {
        borderColor: themeVars.color.primary,
        backgroundColor: themeVars.color.baseWhite200,
    },

    ":focus": {
        outline: "none",
        boxShadow: `0 0 0 2px ${themeVars.color.primary}33`,
    },

    selectors: {
        "&[data-state='checked']": {
            backgroundColor: themeVars.color.primary,
            borderColor: themeVars.color.primary,
        },
        "&[data-disabled]": {
            opacity: 0.5,
            cursor: "not-allowed",
            pointerEvents: "none",
            backgroundColor: themeVars.color.baseWhite200,
        },
    },
});

export const checkboxIndicatorStyle = style({
    color: themeVars.color.baseWhite100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    lineHeight: "1",
});

export const checkboxLabelStyle = style({
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.normal,
    lineHeight: designConstants.lineHeight.normal,
    cursor: "pointer",
    userSelect: "none",
    flex: 1,

    color: themeVars.color.baseContent,
});
