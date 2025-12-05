// app/styles.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

/**
 * Main Application Styles
 * Root-level styles for the application
 */

// Root app container
export const appRootStyle = style({
    // Structure
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    
    // Appearance
    backgroundColor: themeVars.background.color,
    backgroundImage: themeVars.background.image,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});

// Main content wrapper
export const appMainStyle = style({
    // Structure
    flex: "1",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: designConstants.width.container6xl,
    marginInline: "auto",
    padding: designConstants.spacing.basicPadding,
    
    "@media": {
        "screen and (max-width: 768px)": {
            padding: designConstants.spacing.smallPadding,
        },
    },
});

// Page container
export const pageContainerStyle = style({
    // Structure
    width: "100%",
    maxWidth: designConstants.width.container2xl,
    marginInline: "auto",
    padding: designConstants.spacing.largePadding,
    borderRadius: designConstants.radius.lg,
    boxShadow: designConstants.shadows.xl,
    
    // Appearance
    backgroundColor: themeVars.color.baseWhite100,
    
    "@media": {
        "screen and (max-width: 768px)": {
            padding: designConstants.spacing.smallPadding,
            borderRadius: 0,
            boxShadow: "none",
        },
    },
});

// Section styles
export const sectionStyle = style({
    // Structure
    marginBottom: designConstants.spacing.largePadding,
    
    ":last-child": {
        marginBottom: 0,
    },
});

export const sectionTitleStyle = style({
    // Structure
    fontSize: designConstants.fontSize.xxl,
    fontWeight: designConstants.fontWeight.bold,
    lineHeight: designConstants.lineHeight.tight,
    marginBottom: designConstants.spacing.smallPadding,
    
    // Appearance
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});

export const sectionSubtitleStyle = style({
    // Structure
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    marginBottom: designConstants.spacing.basicPadding,
    
    // Appearance
    color: themeVars.color.baseGray500,
    fontFamily: themeVars.font.family,
});

// Card styles
export const cardStyle = style({
    // Structure
    padding: designConstants.spacing.basicPadding,
    borderRadius: designConstants.radius.lg,
    border: "1px solid",
    boxShadow: designConstants.shadows.base,
    marginBottom: designConstants.spacing.smallPadding,
    
    // Appearance
    backgroundColor: themeVars.color.baseWhite100,
    borderColor: themeVars.color.baseWhite300,
    
    ":hover": {
        boxShadow: designConstants.shadows.md,
    },
});

// Loading spinner
export const loadingSpinnerStyle = style({
    // Structure
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
    
    // Appearance
    color: themeVars.color.primary,
});

// Error page
export const errorPageStyle = style({
    // Structure
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    textAlign: "center",
    padding: designConstants.spacing.largePadding,
    
    // Appearance
    color: themeVars.color.baseContent,
});

export const errorTitleStyle = style({
    // Structure
    fontSize: designConstants.fontSize.xxxl,
    fontWeight: designConstants.fontWeight.bold,
    marginBottom: designConstants.spacing.smallPadding,
    
    // Appearance
    color: themeVars.color.error,
    fontFamily: themeVars.font.family,
});

export const errorMessageStyle = style({
    // Structure
    fontSize: designConstants.fontSize.lg,
    lineHeight: designConstants.lineHeight.normal,
    maxWidth: "600px",
    
    // Appearance
    color: themeVars.color.baseGray500,
    fontFamily: themeVars.font.family,
});

// Utility classes
export const visuallyHiddenStyle = style({
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
});

export const containerFluidStyle = style({
    width: "100%",
    paddingInline: designConstants.spacing.basicPadding,
});

export const textCenterStyle = style({
    textAlign: "center",
});

export const flexCenterStyle = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

// Divider
export const dividerStyle = style({
    // Structure
    height: "1px",
    width: "100%",
    marginBlock: designConstants.spacing.basicPadding,
    border: "none",
    
    // Appearance
    backgroundColor: themeVars.color.baseWhite300,
});

// Spacer utilities
export const spacerSmallStyle = style({
    height: designConstants.spacing.smallPadding,
});

export const spacerMediumStyle = style({
    height: designConstants.spacing.basicPadding,
});

export const spacerLargeStyle = style({
    height: designConstants.spacing.largePadding,
});