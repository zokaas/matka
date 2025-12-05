// app/styles/beneficialOwnerStyle.css.ts
import { style } from "@vanilla-extract/css";
import { themeVars, designConstants } from "@ui/themes";

export const boComponentContainer = style({
    padding: "5px",
    border: "1px solid",
    borderColor: "oklch(95% 0 0)",
    zIndex: 10000,
});

export const boQuestionContainer = style({
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
});

export const boLabelButtonRow = style({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    minHeight: "40px",
});

export const boLabelContainer = style({
    flex: "1",
    marginRight: "12px",
    maxWidth: "calc(100% - 60px)",
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
    width: designConstants.size.xs,
    height: designConstants.size.xs,
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
    top: designConstants.size.xs,
    right: designConstants.size.xs,
});

export const addBoFormButton = style({
    marginTop: designConstants.spacing.smallPadding,
    marginLeft: "auto",
    marginRight: 0,
    padding: designConstants.spacing.tinyPadding,
    borderRadius: "2px",
    boxShadow: `0 2px 4px 0 ${themeVars.color.blackAlpha20}`,
    backgroundImage: `linear-gradient(to bottom, ${themeVars.color.baseGreen400} -14%, ${themeVars.color.baseGreen500} 114%)`,
    color: themeVars.color.baseWhite100,
    ":hover": {
        backgroundImage: `linear-gradient(to bottom, ${themeVars.color.baseGreen410} -14%, ${themeVars.color.baseGreen500} 114%)`,
    },
    ":active": {
        backgroundImage: `linear-gradient(to bottom, ${themeVars.color.baseGreen420} -14%, ${themeVars.color.baseGreen500} 114%)`,
    },
    ":disabled": {
        boxShadow: `0 2px 1px 0 ${themeVars.color.blackAlpha43}`,
        backgroundImage: "none",
        backgroundColor: themeVars.color.baseNeutral350,
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
    //backgroundColor: themeVars.color.baseGreen500,
    ":hover": {
        color: themeVars.color.blackAlpha20,
    },
});

export const boResultContainer = style({
    flex: "1",
    display: "grid",
    // fr = fraction => https://www.digitalocean.com/community/tutorials/css-css-grid-layout-fr-unit
    // https://css-tricks.com/introduction-fr-css-unit/
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
    marginTop: designConstants.spacing.tinyPadding,
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
    padding: designConstants.spacing.defaultPadding,
});