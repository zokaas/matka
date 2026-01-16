import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const inputContainerStyle = style({
    display: "flex",
    flexDirection: "column",
    gap: designConstants.spacing.tinyPadding,
    width: designConstants.width.full,
});

export const inputLabelStyle = style({
    fontWeight: designConstants.fontWeight.medium,
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    color: themeVars.color.baseContent,
});

export const inputWrapperStyle = style({
    position: "relative",
    width: designConstants.width.full,
});

export const inputFieldStyle = style({
    padding: designConstants.spacing.tinyPadding,
    border: `1px solid ${themeVars.color.baseWhite400}`,
    borderRadius: designConstants.radius.md,
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    color: themeVars.color.baseContent,
    backgroundColor: themeVars.color.baseWhite100,

    outline: "none",
    transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",

    ":focus": {
        borderColor: themeVars.color.baseWhite400,
        boxShadow: `0 0 0 3px ${themeVars.color.baseGray100}`,
    },

    "::placeholder": {
        color: themeVars.color.baseGray100,
    },

    selectors: {
        "&[aria-invalid='true']": {
            borderColor: themeVars.color.error,
        },
    },
});
