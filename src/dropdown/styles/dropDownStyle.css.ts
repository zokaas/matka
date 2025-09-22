import { style } from "@vanilla-extract/css";
export const dropDownContainerStyle = style({
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
});

export const dropDownLabel = style({
    fontSize: "1rem",
});

export const dropDownStyle = style({
    display: "inline-flex",
    fontSize: "1rem",
    lineHeight: "1.5rem",
    width: "100%",
    backgroundColor: "white",
    border: "1px solid #cccccc",
    borderRadius: "6px",
    justifyContent: "space-between",
    padding: "10px",
});
/*
    &:hover {
        background-color: var(--mauve-3);
    }
    &:focus {
        box-shadow: 0 0 0 2px black;
    }
    &[data-placeholder] {
        color: var(--violet-9);
    } */

export const dropDownOpenIconStyle = style({
    color: "#cccccc",
    borderLeft: "1px solid #cccccc",
    paddingLeft: "10px",
});

export const dropDownListStyle = style({
    overflow: "hidden",
    backgroundColor: "white",
    borderRadius: "6px",
    padding: "5px",
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.6), 0 2px 2px 0 rgba(0, 0, 0, 0.5)",
    width: "var(--radix-select-trigger-width)",
    maxWidth: "var(--radix-select-trigger-width)",
    boxSizing: "border-box",
});

export const multiSelectListStyle = style({
    overflow: "hidden",
    backgroundColor: "white",
    borderRadius: "6px",
    padding: "5px",
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.6), 0 2px 2px 0 rgba(0, 0, 0, 0.5)",
    width: "var(--radix-popover-trigger-width)",
    maxWidth: "var(--radix-popover-trigger-width)",
    boxSizing: "border-box",
});

export const dropDownViewportStyle = style({
    padding: "5px 10px",
    boxSizing: "border-box",
});

export const dropDownItemIndicatorStyles = style({
    position: "absolute",
    left: 0,
    width: "25px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
});

export const iconStyle = style({
    color: "#2e6db4 !important",
});

export const filterContainer = style({
    padding: "5px",
    borderBottom: "1px solid #e5e7eb",
});
const baseItemStyle = {
    fontSize: "1rem",
    lineHeight: "1.5rem",
    color: "#000000",
    display: "flex",
    alignItems: "center",
    height: "25px",
    padding: "8px 5px",
    position: "relative" as const,
    userSelect: "none" as const,
};

const baseHoverStyle = {
    outline: "none",
    backgroundColor: "#e2ecf6",
    color: "#274f8b",
};

export const dropDownItemStyles = style({
    ...baseItemStyle,
    paddingRight: "30px",
    paddingLeft: "20px",
    selectors: {
        "&[data-highlighted]": baseHoverStyle,
    },
});

export const multiSelectTagsContainer = style({
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    flex: 1,
    alignItems: "center",
    maxWidth: "calc(100% - 50px)",
});

export const multiSelectFieldContainer = style({
    position: "relative",
    display: "flex",
    alignItems: "center",
});

export const multiSelectPlaceholder = style({
    color: "#999",
});

export const multiSelectTag = style({
    display: "flex",
    alignItems: "center",
    minWidth: "91px",
    height: "30px",
    padding: "12px 15px",
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
    backgroundImage: "linear-gradient(to top, #efefef, var(--ffffff-white-2))",
    border: "none",
    borderRadius: "4px",
    whiteSpace: "nowrap",
});

export const multiSelectTagRemove = style({
    cursor: "pointer",
    color: "#666",
    fontSize: "16px",
    lineHeight: "1",
    width: "16px",
    height: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "2px",
    transition: "background-color 0.2s",
    marginLeft: "8px",
});

export const multiSelectCheckbox = style({
    width: "17px",
    height: "17px",
    borderRadius: "2px",
    boxShadow: "inset 0px 1px 4px 0px rgba(0, 0, 0, 0.5)",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "5px",
});

export const multiSelectOptionText = style({
    flex: 1,
});

export const multiSelectOptionButton = style({
    ...baseItemStyle,
    width: "100%",
    textAlign: "left",
    border: "none",
    background: "none",
    cursor: "pointer",
    selectors: {
        "&:hover": baseHoverStyle,
        "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
        },
    },
});
