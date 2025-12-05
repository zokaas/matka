// app/styles/beneficialOwnerStyle.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const boComponentContainer = style({
    // Structure
    padding: designConstants.spacing.tinyPadding,
    border: "1px solid",
    borderRadius: designConstants.radius.sm,
    zIndex: 10000,
    
    // Appearance
    borderColor: themeVars.color.baseWhite300,
});

export const boQuestionContainer = style({
    // Structure
    display: "flex",
    flexDirection: "column",
    gap: designConstants.spacing.smallPadding,
    width: "100%",
});

export const boLabelButtonRow = style({
    // Structure
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    minHeight: "40px",
});

export const boLabelContainer = style({
    // Structure
    flex: "1",
    marginRight: designConstants.spacing.smallPadding,
    maxWidth: "calc(100% - 60px)",
});

export const boButtonContainer = style({
    // Structure
    flexShrink: 0,
    width: designConstants.size.xl,
    height: designConstants.size.xl,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: designConstants.spacing.defaultPadding,
});

export const boPopoverButton = style({
    // Structure
    all: "unset",
    borderRadius: "100%",
    width: designConstants.size.xl,
    height: designConstants.size.xl,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: `background-image ${designConstants.transitions.base}`,
    
    // Appearance
    color: themeVars.color.baseWhite100,
    backgroundColor: themeVars.color.baseGreen500,
    
    ":hover": {
        backgroundImage: themeVars.color.baseGreen420,
    },
});

export const boCloseIcon = style({
    // Structure
    all: "unset",
    display: "inline-flex",
    position: "absolute",
    top: designConstants.spacing.tinyPadding,
    right: designConstants.spacing.tinyPadding,
});

export const addBoFormButton = style({
    // Structure
    marginTop: designConstants.spacing.smallPadding,
    marginLeft: "auto",
    marginRight: 0,
    padding: designConstants.spacing.tinyPadding,
    borderRadius: designConstants.radius.sm,
    boxShadow: designConstants.shadows.base,
    border: "none",
    cursor: "pointer",
    transition: `background-image ${designConstants.transitions.base}`,
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.normal,
    lineHeight: designConstants.lineHeight.normal,
    
    // Appearance
    backgroundImage: `linear-gradient(to bottom, ${themeVars.color.baseGreen400} -14%, ${themeVars.color.baseGreen500} 114%)`,
    color: themeVars.color.baseWhite100,
    fontFamily: themeVars.font.family,
    
    ":hover": {
        backgroundImage: `linear-gradient(to bottom, ${themeVars.color.baseGreen410} -14%, ${themeVars.color.baseGreen500} 114%)`,
    },
    
    ":active": {
        backgroundImage: `linear-gradient(to bottom, ${themeVars.color.baseGreen420} -14%, ${themeVars.color.baseGreen500} 114%)`,
    },
    
    ":disabled": {
        boxShadow: designConstants.shadows.sm,
        backgroundImage: "none",
        backgroundColor: themeVars.color.baseNeutral350,
        color: themeVars.color.baseGray500,
        cursor: "not-allowed",
    },
});

export const boResultAndButton = style({
    // Structure
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: designConstants.spacing.tinyPadding,
    borderTop: "1px solid",
    
    // Appearance
    borderColor: themeVars.color.baseGray500,
});

export const removeBoFormButton = style({
    // Structure
    flexShrink: 0,
    all: "unset",
    width: designConstants.size.xl,
    height: designConstants.size.huge,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: `color ${designConstants.transitions.base}`,
    
    // Appearance
    color: themeVars.color.baseContent,
    
    ":hover": {
        color: themeVars.color.error,
    },
});

export const boResultContainer = style({
    // Structure
    flex: "1",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: designConstants.spacing.smallPadding,
    marginTop: designConstants.spacing.tinyPadding,
    marginRight: designConstants.spacing.basicPadding,
});

export const boResultValuesContainer = style({
    // Structure
    padding: `${designConstants.spacing.defaultPadding} 0`,
});

export const boResultValueLabelContainer = style({
    // Structure
    padding: designConstants.spacing.defaultPadding,
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.semiBold,
    lineHeight: designConstants.lineHeight.normal,
    
    // Appearance
    backgroundColor: themeVars.color.baseWhite400,
    fontFamily: themeVars.font.family,
});

export const boResultValueContainer = style({
    // Structure
    padding: designConstants.spacing.defaultPadding,
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    
    // Appearance
    fontFamily: themeVars.font.family,
});