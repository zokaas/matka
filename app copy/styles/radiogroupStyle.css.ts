import { style } from "@vanilla-extract/css";
import { vars } from "@ui/themes";

export const b2bRadioLabelStyle = style({
    color: vars.color.baseContent,
    fontSize: vars.font.size.baseFontSize,
    lineHeight: vars.font.lineHeight.baseLineHeight,
    paddingLeft: vars.spacing.smallPadding,
});

export const b2bRadiogroupRootStyle = style({
    display: "flex",
    flexDirection: "row",
    gap: vars.spacing.smallPadding,
    marginTop: vars.spacing.tinyPadding,
});

export const b2bRadioItemStyle = style({
    all: "unset",
    width: "24px",
    height: "24px",
    borderRadius: "100%",
    boxShadow: `inset 0 1px 4px 0 ${vars.color.blackAlpha50}`,
    backgroundColor: vars.color.baseWhite400,
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
    color: vars.color.baseContent,
    fontSize: vars.font.size.baseFontSize,
    lineHeight: vars.font.lineHeight.baseLineHeight,
});
