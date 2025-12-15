import { style } from "@vanilla-extract/css";
import { themeVars, designConstants } from "@ui/themes";

export const boComponentContainer = style({
    padding: "5px",
    border: "1px solid",
    borderColor: "oklch(95% 0 0)",
    zIndex: designConstants.zIndex.modal,
});

export const boLabelAndButtonContainer = style({
    display: "flex",
    flexDirection: "column",
    gap: designConstants.spacing.tinyPadding,
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
    marginTop: designConstants.spacing.tinyPadding,
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
    // fr = fraction => https://www.digitalocean.com/community/tutorials/css-css-grid-layout-fr-unit
    // https://css-tricks.com/introduction-fr-css-unit/
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "0 10px",
    marginRight: designConstants.spacing.basicPadding,
});

export const boResultValuesContainer = style({
    padding: `${designConstants.spacing.defaultPadding} 0`,
});

export const boResultValueLabelContainer = style({
    padding: designConstants.spacing.defaultPadding,
    backgroundColor: themeVars.color.baseWhite400,
    fontWeight: designConstants.fontWeight.semiBold,
});

export const boResultValueContainer = style({
    // padding: designConstants.spacing.defaultPadding,
});
