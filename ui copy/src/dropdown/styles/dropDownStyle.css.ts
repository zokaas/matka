import { style } from "@vanilla-extract/css";
import { designConstants, themeVars } from "@ui/themes";

export const dropDownContainerStyle = style({
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: designConstants.spacing.tinyPadding,
    width: designConstants.width.full,
});

export const dropDownLabel = style({
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    fontWeight: designConstants.fontWeight.normal,

    color: themeVars.color.baseContent,
});

const baseFieldStyle = {
    display: "inline-flex" as const,
    fontSize: designConstants.fontSize.base,
    lineHeight: designConstants.lineHeight.normal,
    width: designConstants.width.full,
    borderRadius: designConstants.radius.md,
    justifyContent: "space-between" as const,
    padding: `${designConstants.spacing.tinyPadding} ${designConstants.spacing.smallPadding}`,
    border: "1px solid",
    cursor: "pointer" as const,
    transition: `all ${designConstants.transitions.base}`,
    minHeight: "42px",
    boxSizing: "border-box" as const,
    alignItems: "center" as const,

    backgroundColor: themeVars.color.baseWhite100,
    borderColor: themeVars.color.baseWhite400,
    color: themeVars.color.baseContent,
};

const baseFieldHoverStyle = {
    borderColor: themeVars.color.baseWhite200,
    backgroundColor: themeVars.color.baseWhite200,
};

const baseFieldFocusStyle = {
    outline: "none",
    boxShadow: `0 0 0 3px ${themeVars.color.primary}33`,
};

export const dropDownStyle = style({
    ...baseFieldStyle,

    ":hover": baseFieldHoverStyle,
    ":focus": baseFieldFocusStyle,
});

export const multiSelectFieldButton = style({
    ...baseFieldStyle,

    ":hover": baseFieldHoverStyle,
    ":focus-within": baseFieldFocusStyle,
});

export const dropDownOpenIconStyle = style({
    paddingLeft: designConstants.spacing.smallPadding,
    borderLeft: "1px solid",
    display: "flex",
    alignItems: "center",
    transition: `transform ${designConstants.transitions.base}`,

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

    backgroundColor: themeVars.color.baseWhite100,
    borderColor: themeVars.color.baseWhite400,
});

export const multiSelectListStyle = style({
    overflow: "hidden",
    borderRadius: designConstants.radius.md,
    padding: designConstants.spacing.tinyPadding,
    width: "var(--radix-popover-trigger-width)",
    minWidth: "var(--radix-popover-trigger-width)",
    maxWidth: "max(var(--radix-popover-trigger-width), 400px)",
    boxSizing: "border-box",
    boxShadow: designConstants.shadows.lg,
    border: "1px solid",

    backgroundColor: themeVars.color.baseWhite100,
    borderColor: themeVars.color.baseWhite400,
});

export const dropDownViewportStyle = style({
    padding: designConstants.spacing.tinyPadding,
    boxSizing: "border-box",
    maxHeight: "300px",
    overflowY: "auto",
    overflowX: "hidden",
});

const baseItemStyle = {
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

export const selectPlaceholder = style({
    color: themeVars.color.baseGray500,
    opacity: 0.8,
});

export const multiSelectTagsContainer = style({
    display: "flex",
    flexWrap: "wrap",
    gap: designConstants.spacing.tinyPadding,
    flex: 1,
    alignItems: "center",
    maxWidth: "calc(100% - 50px)",
    minHeight: "24px",
});

export const multiSelectFieldContainer = style({
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: designConstants.width.full,
});

export const multiSelectTag = style({
    display: "flex",
    alignItems: "center",
    gap: designConstants.spacing.tinyPadding,
    minWidth: "fit-content",
    height: "32px",
    padding: `${designConstants.spacing.defaultPadding} ${designConstants.spacing.tinyPadding}`,
    border: "1px solid",
    borderRadius: designConstants.radius.md,
    boxShadow: designConstants.shadows.sm,
    whiteSpace: "nowrap",
    fontSize: designConstants.fontSize.sm,
    fontWeight: designConstants.fontWeight.medium,
    transition: `all ${designConstants.transitions.base}`,

    backgroundColor: themeVars.color.baseWhite100,
    borderColor: themeVars.color.baseWhite400,
    color: themeVars.color.baseContent,

    ":hover": {
        backgroundColor: themeVars.color.baseWhite200,
        borderColor: themeVars.color.baseWhite200,
        boxShadow: designConstants.shadows.base,
    },
});

export const multiSelectTagRemove = style({
    all: "unset",
    cursor: "pointer",
    fontSize: designConstants.fontSize.base,
    lineHeight: "1",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid",
    transition: `all ${designConstants.transitions.base}`,
    flexShrink: 0,

    color: themeVars.color.baseGray500,
    borderColor: themeVars.color.baseGray500,
    backgroundColor: "transparent",

    ":hover": {
        backgroundColor: themeVars.color.error,
        borderColor: themeVars.color.error,
        color: themeVars.color.baseWhite100,
    },

    ":focus": {
        outline: `2px solid ${themeVars.color.primary}`,
        outlineOffset: "2px",
    },
});

export const multiSelectCheckbox = style({
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
