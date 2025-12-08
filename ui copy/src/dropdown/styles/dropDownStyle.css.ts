import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const dropDownContainerStyle = style({
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: designConstants.spacing.tinyPadding,
    zIndex: designConstants.zIndex.popoverDropdown,
});

export const dropDownLabel = style({
    // Structure
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    fontWeight: designConstants.fontWeight.normal,

    // Appearance
    color: themeVars.color.baseContent,
});

export const dropDownStyle = style({
    // Structure
    display: "inline-flex",
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    width: designConstants.width.full,
    borderRadius: designConstants.radius.md,
    justifyContent: "space-between",
    padding: designConstants.spacing.smallPadding,
    border: "1px solid",
    cursor: "pointer",
    transition: `all ${designConstants.transitions.base}`,
    zIndex: designConstants.zIndex.popoverDropdown,

    // Appearance
    backgroundColor: themeVars.color.baseWhite100,
    borderColor: themeVars.color.baseWhite400,
    color: themeVars.color.baseContent,

    ":hover": {
        borderColor: themeVars.color.baseWhite200,
        backgroundColor: themeVars.color.baseWhite200,
    },

    // ":focus": {
    //     outline: "none",
    //     borderColor: themeVars.color.baseWhite400,
    //     boxShadow: `0 0 0 3px ${themeVars.color.baseWhite400}33`,
    // },
});

export const dropDownOpenIconStyle = style({
    // Structure
    paddingLeft: designConstants.spacing.smallPadding,
    borderLeft: "1px solid",
    display: "flex",
    alignItems: "center",
    transition: `transform ${designConstants.transitions.base}`,

    // Appearance
    color: themeVars.color.baseGray500,
    borderColor: themeVars.color.baseWhite400,
});

export const dropDownListStyle = style({
    position: "relative",
    overflow: "hidden",
    borderRadius: designConstants.radius.md,
    padding: designConstants.spacing.tinyPadding,
    width: "var(--radix-select-trigger-width)",
    minWidth: "var(--radix-select-trigger-width)",
    maxWidth: "max(var(--radix-select-trigger-width), 400px)",
    boxSizing: "border-box",
    boxShadow: designConstants.shadows.lg,
    zIndex: designConstants.zIndex.popoverDropdown,
    border: "1px solid",

    // Appearance
    backgroundColor: themeVars.color.baseWhite100,
    borderColor: themeVars.color.baseWhite400,
});

export const multiSelectListStyle = style({
    // Structure
    overflow: "hidden",
    borderRadius: designConstants.radius.md,
    padding: designConstants.spacing.tinyPadding,
    width: "var(--radix-popover-trigger-width)",
    minWidth: "var(--radix-popover-trigger-width)",
    maxWidth: "max(var(--radix-popover-trigger-width), 400px)",
    boxSizing: "border-box",
    boxShadow: designConstants.shadows.lg,
    zIndex: designConstants.zIndex.dropdown,
    border: "1px solid",

    // Appearance
    backgroundColor: themeVars.color.baseWhite100,
    borderColor: themeVars.color.baseWhite400,
});

export const dropDownViewportStyle = style({
    // Structure
    padding: designConstants.spacing.tinyPadding,
    boxSizing: "border-box",
    maxHeight: "300px",
    overflowY: "auto",
    overflowX: "hidden",
});

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
};

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

export const iconStyle = style({
    color: `${themeVars.color.primary} !important`,
});

export const filterContainer = style({
    // Structure
    padding: designConstants.spacing.tinyPadding,
    borderBottom: "1px solid",

    // Appearance
    borderColor: themeVars.color.baseWhite400,
});

export const selectPlaceholder = style({
    color: themeVars.color.baseGray500,
    opacity: 0.8,
});

// MultiSelect Specific Styles
export const multiSelectTagsContainer = style({
    display: "flex",
    flexWrap: "wrap",
    gap: designConstants.spacing.defaultPadding,
    flex: 1,
    alignItems: "center",
    maxWidth: "calc(100% - 50px)",
});

export const multiSelectFieldContainer = style({
    position: "relative",
    display: "flex",
    alignItems: "center",
});

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
    backgroundImage: `linear-gradient(to top, ${themeVars.color.baseWhite400}, ${themeVars.color.baseWhite100})`,
    color: themeVars.color.baseContent,
});

export const multiSelectTagRemove = style({
    // Structure
    cursor: "pointer",
    fontSize: designConstants.fontSize.base,
    lineHeight: "1",
    width: designConstants.size.s,
    height: designConstants.size.s,
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
    border: "1px solid",

    // Appearance
    backgroundColor: themeVars.color.baseWhite100,
    borderColor: themeVars.color.baseWhite400,
});

export const multiSelectOptionText = style({
    flex: 1,
    whiteSpace: "normal",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
});

export const multiSelectOptionButton = style({
    ...baseItemStyle,
    width: designConstants.width.full,
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
