import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const modalOverlayStyles = style({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: designConstants.zIndex.modalBackdrop,

    backgroundColor: themeVars.color.blackAlpha50,
});

export const modalContentContainerStyles = style({
    position: "relative",
    width: "80%",
    maxWidth: designConstants.width.containerLg,
    height: "auto",
    padding: designConstants.spacing.largePadding,
    margin: designConstants.spacing.basicPadding,
    borderRadius: "0",
    boxShadow: designConstants.shadows.xl,
    overflowY: "auto",
    maxHeight: "90vh",

    backgroundColor: themeVars.color.baseWhite100,
    color: themeVars.color.baseContent,

    "@media": {
        "screen and (min-width: 768px)": {
            width: "50%",
            padding: designConstants.spacing.largePadding,
        },
    },
});

export const modalTitleStyles = style({
    fontSize: designConstants.fontSize.xxl,
    fontWeight: designConstants.fontWeight.bold,
    lineHeight: designConstants.lineHeight.tight,
    margin: `0 0 ${designConstants.spacing.smallPadding} 0`,
    textAlign: "center",

    color: themeVars.color.baseContent,
});

export const modalDescriptionStyles = style({
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.normal,
    lineHeight: designConstants.lineHeight.normal,
    margin: `0 0 ${designConstants.spacing.largePadding} 0`,
    textAlign: "center",

    color: themeVars.color.baseContent,
});

export const modalActionBlockStyles = style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: designConstants.spacing.smallPadding,
    marginTop: designConstants.spacing.basicPadding,

    "@media": {
        "screen and (max-width: 767px)": {
            flexDirection: "column",
            gap: designConstants.spacing.tinyPadding,
        },
    },
});

export const modalButtonStyles = style({
    width: "180px",
    height: "48px",
    padding: `${designConstants.spacing.smallPadding} ${designConstants.spacing.tinyPadding}`,
    margin: `0 ${designConstants.spacing.tinyPadding}`,
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.normal,
    lineHeight: designConstants.lineHeight.normal,
    borderRadius: "0",
    border: "none",
    boxShadow: designConstants.shadows.custom,
    cursor: "pointer",
    transition: `background-image ${designConstants.transitions.base}`,
    textAlign: "center",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    backgroundImage: `linear-gradient(to top, ${themeVars.color.baseWhite400}, ${themeVars.color.baseWhite100})`,
    color: themeVars.color.baseContent,

    ":hover": {
        backgroundImage: `linear-gradient(to top, ${themeVars.color.baseWhite200}, ${themeVars.color.baseWhite100})`,
    },

    ":disabled": {
        color: themeVars.color.baseGray500,
        cursor: "not-allowed",
        opacity: 0.6,
    },

    "@media": {
        "screen and (max-width: 767px)": {
            margin: `${designConstants.spacing.defaultPadding} 0`,
            width: "100%",
            whiteSpace: "normal",
        },
    },
});
