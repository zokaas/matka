// ui/src/dropdown/styles/dropDownStyle.css.ts
import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

// Container for the entire dropdown component
export const dropDownContainerStyle = style({
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: designConstants.spacing.tinyPadding,
});

// Label styling (if not using separate Label component)
export const dropDownLabel = style({
    // Structure
    fontSize: designConstants.fontSize.base,
    fontWeight: designConstants.fontWeight.normal,
    lineHeight: designConstants.lineHeight.normal,
    
    // Appearance
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});

// Main dropdown trigger button
export const dropDownStyle = style({
    // Structure
    display: "inline-flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: designConstants.spacing.smallPadding,
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    borderRadius: designConstants.radius.md,
    border: "1px solid",
    cursor: "pointer",
    transition: `all ${designConstants.transitions.base}`,
    
    // Appearance
    backgroundColor: themeVars.color.baseWhite100,
    borderColor: themeVars.color.baseWhite300,
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
    
    ":hover": {
        borderColor: themeVars.color.baseWhite200,
        backgroundColor: themeVars.color.baseWhite200,
    },
    
    ":focus": {
        outline: "none",
        borderColor: themeVars.color.primary,
        boxShadow: `0 0 0 3px ${themeVars.color.primary}33`,
    },
});

// Icon container (chevron)
export const dropDownOpenIconStyle = style({
    // Structure
    paddingLeft: designConstants.spacing.smallPadding,
    borderLeft: "1px solid",
    display: "flex",
    alignItems: "center",
    transition: `transform ${designConstants.transitions.base}`,
    
    // Appearance
    color: themeVars.color.baseGray500,
    borderColor: themeVars.color.baseWhite300,
});

// Dropdown list container (portal)
export const dropDownListStyle = style({
    // Structure
    overflow: "hidden",
    padding: designConstants.spacing.tinyPadding,
    borderRadius: designConstants.radius.md,
    width: "var(--radix-select-trigger-width)",
    minWidth: "var(--radix-select-trigger-width)",
    maxWidth: "max(var(--radix-select-trigger-width), 400px)",
    boxSizing: "border-box",
    boxShadow: designConstants.shadows.lg,
    zIndex: designConstants.zIndex.dropdown,
    
    // Appearance
    backgroundColor: themeVars.color.baseWhite100,
    border: `1px solid ${themeVars.color.baseWhite300}`,
});

// MultiSelect specific list (uses Popover)
export const multiSelectListStyle = style({
    // Structure
    overflow: "hidden",
    padding: designConstants.spacing.tinyPadding,
    borderRadius: designConstants.radius.md,
    width: "var(--radix-popover-trigger-width)",
    minWidth: "var(--radix-popover-trigger-width)",
    maxWidth: "max(var(--radix-popover-trigger-width), 400px)",
    boxSizing: "border-box",
    boxShadow: designConstants.shadows.lg,
    zIndex: designConstants.zIndex.dropdown,
    
    // Appearance
    backgroundColor: themeVars.color.baseWhite100,
    border: `1px solid ${themeVars.color.baseWhite300}`,
});

// Viewport (scrollable area)
export const dropDownViewportStyle = style({
    // Structure
    padding: designConstants.spacing.tinyPadding,
    boxSizing: "border-box",
    maxHeight: "300px",
    overflowY: "auto",
    overflowX: "hidden",
});

// Individual dropdown item
const baseItemStyle = {
    // Structure
    fontSize: designConstants.fontSize.base,
    lineHeight: 1.4,
    padding: designConstants.spacing.tinyPadding,
    borderRadius: designConstants.radius.sm,
    position: "relative" as const,
    userSelect: "none" as const,
    boxSizing: "border-box" as const,
    minHeight: "auto",
    cursor: "pointer",
    transition: `all ${designConstants.transitions.fast}`,
    
    // Appearance
    color: themeVars.color.baseContent,
};

const baseHoverStyle = {
    outline: "none",
    backgroundColor: themeVars.color.baseWhite200,
    color: themeVars.color.primary,
};

// Single-select dropdown item
export const dropDownItemStyles = style({
    ...baseItemStyle,
    display: "flex",
    alignItems: "center",
    paddingRight: "30px",
    paddingLeft: "20px",
    
    selectors: {
        "&[data-highlighted]": baseHoverStyle,
        "&[data-disabled]": {
            opacity: 0.5,
            cursor: "not-allowed",
            pointerEvents: "none",
        },
    },
});

// Item indicator (checkmark for selected item)
export const dropDownItemIndicatorStyles = style({
    // Structure
    position: "absolute",
    left: "6px",
    top: "50%",
    transform: "translateY(-50%)",
    width: designConstants.size.s,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
});

// Icon styling
export const iconStyle = style({
    color: `${themeVars.color.primary} !important`,
});

// Filter container (inside dropdown)
export const filterContainer = style({
    // Structure
    padding: designConstants.spacing.tinyPadding,
    borderBottom: "1px solid",
    
    // Appearance
    borderColor: themeVars.color.baseWhite300,
});

// Placeholder text
export const selectPlaceholder = style({
    color: themeVars.color.baseGray500,
    opacity: 0.8,
});

// ============================================
// MultiSelect Specific Styles
// ============================================

// Container for selected tags
export const multiSelectTagsContainer = style({
    display: "flex",
    flexWrap: "wrap",
    gap: designConstants.spacing.defaultPadding,
    flex: 1,
    alignItems: "center",
    maxWidth: "calc(100% - 50px)",
});

// Field container wrapper
export const multiSelectFieldContainer = style({
    position: "relative",
    display: "flex",
    alignItems: "center",
});

// Individual selected tag
export const multiSelectTag = style({
    // Structure
    display: "flex",
    alignItems: "center",
    minWidth: "91px",
    height: "30px",
    padding: `${designConstants.spacing.smallPadding} ${designConstants.spacing.smallPadding}`,
    borderRadius: designConstants.radius.sm,
    border: "none",
    boxShadow: designConstants.shadows.custom,
    whiteSpace: "nowrap",
    fontSize: designConstants.fontSize.sm,
    
    // Appearance
    backgroundImage: `linear-gradient(to top, ${themeVars.color.baseWhite300}, ${themeVars.color.baseWhite100})`,
    color: themeVars.color.baseContent,
    fontFamily: themeVars.font.family,
});

// Remove button on tag
export const multiSelectTagRemove = style({
    // Structure
    cursor: "pointer",
    fontSize: designConstants.fontSize.base,
    lineHeight: "1",
    width: designConstants.size.xs,
    height: designConstants.size.xs,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: designConstants.radius.sm,
    marginLeft: designConstants.spacing.tinyPadding,
    transition: `background-color ${designConstants.transitions.base}`,
    
    // Appearance
    color: themeVars.color.baseGray500,
    
    ":hover": {
        backgroundColor: themeVars.color.baseWhite200,
        color: themeVars.color.error,
    },
});

// Checkbox in multiselect items
export const multiSelectCheckbox = style({
    // Structure
    width: "17px",
    height: "17px",
    borderRadius: designConstants.radius.sm,
    boxShadow: `inset 0px 1px 4px 0px ${themeVars.color.blackAlpha50}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: designConstants.spacing.tinyPadding,
    flexShrink: 0,
    
    // Appearance
    backgroundColor: themeVars.color.baseWhite100,
    border: `1px solid ${themeVars.color.baseWhite300}`,
});

// Option text
export const multiSelectOptionText = style({
    flex: 1,
    whiteSpace: "normal",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    fontFamily: themeVars.font.family,
});

// Option button/label
export const multiSelectOptionButton = style({
    ...baseItemStyle,
    width: "100%",
    textAlign: "left",
    border: "none",
    background: "none",
    alignItems: "flex-start",
    display: "flex",
    
    selectors: {
        "&:hover": baseHoverStyle,
        "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
        },
    },
});