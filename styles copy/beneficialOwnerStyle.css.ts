import { style } from "@vanilla-extract/css";
import { themeVars, designConstants } from "@ui/themes";

export const boComponentContainer = style({
    padding: "5px",
    zIndex: designConstants.zIndex.modal,
    marginBottom: designConstants.spacing.largePadding,
});

export const boLabelAndButtonContainer = style({
    display: "flex",
    flexDirection: "column",
    gap: designConstants.spacing.defaultPadding,
    width: "100%",
});

export const boLabelButtonRow = style({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    minHeight: "40px",
});

export const boButtonContainer = style({
    flexShrink: 0,
    marginLeft: designConstants.spacing.smallPadding,
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: "2px",
});

export const boPopoverButton = style({
    all: "unset",
    borderRadius: "100%",
    width: designConstants.size.xl,
    height: designConstants.size.xl,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: themeVars.color.baseWhite100,
    backgroundColor: themeVars.color.baseGreen500,
    ":hover": {
        backgroundImage: themeVars.color.baseGreen420,
    },
});

export const boCloseIcon = style({
    all: "unset",
    display: "inline-flex",
    position: "absolute",
    top: designConstants.size.s,
    right: designConstants.size.s,
});

export const boQuestionsStyle = style({
    padding: 0,
    margin: 0,
    marginBottom: designConstants.spacing.tinyPadding,
    width: designConstants.width.full,
    minWidth: designConstants.width.full,
});

export const addBoFormButton = style({
    marginTop: designConstants.spacing.smallPadding,
    padding: `${designConstants.spacing.tinyPadding} ${designConstants.spacing.smallPadding}`,
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
        backgroundImage: `linear-gradient(to top, ${themeVars.color.baseWhite400}, ${themeVars.color.baseWhite100})`,
        boxShadow: designConstants.shadows.md,
    },
    ":disabled": {
        color: themeVars.color.baseGray500,
        cursor: "not-allowed",
        opacity: 0.6,
    },

    ":focus": {
        outline: `2px solid ${themeVars.color.baseWhite400}`,
        outlineOffset: "2px",
    },
});

export const boResultAndButton = style({
    display: "flex",
    borderTop: `1px solid ${themeVars.color.baseGray500}`,
    marginTop: designConstants.spacing.smallPadding,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
});

export const removeBoFormButton = style({
    flexShrink: 0,
    all: "unset",
    width: designConstants.size.xl,
    height: designConstants.size.xl,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: themeVars.color.baseContent,
    ":hover": {
        color: themeVars.color.error,
    },
});

export const boResultContainer = style({
    flex: "1",
    display: "grid",
    gridTemplateColumns: "1fr",
    marginRight: 0,
    wordBreak: "break-word",

    "@media": {
        "screen and (min-width: 480px)": {
            gridTemplateColumns: "repeat(2, 1fr)",
            columnGap: "10px",
            rowGap: "0px",
            marginRight: designConstants.spacing.basicPadding,
        },
    },
});

export const boResultValueLabelContainer = style({
    backgroundColor: themeVars.color.baseWhite400,
    fontWeight: designConstants.fontWeight.semiBold,
    margin: designConstants.spacing.tinyPadding,
    padding: `${designConstants.spacing.defaultPadding} 0`,
});

export const boResultValueContainer = style({
    margin: designConstants.spacing.tinyPadding,
});
