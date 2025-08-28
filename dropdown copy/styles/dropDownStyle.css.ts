import { style } from "@vanilla-extract/css";

/* =========================
   Dropdown Styles
   ========================= */
export const dropDownContainerStyle = style({
    flexGrow: 1,
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
    width: "var(--radix-popover-trigger-width)"
});

export const dropDownViewportStyle = style({
    padding: "5px",
});

export const dropDownItemStyles = style({
    fontSize: "1rem",
    lineHeight: "1.5rem",
    color: "#000000",
    display: "flex",
    alignItems: "center",
    height: "25px",
    paddingRight: "30px",
    paddingLeft: "20px",
    padding: "8px 5px", // Base padding without left space
    position: "relative",
    userSelect: "none",
    selectors: {
        "&[data-highlighted]": {
            outline: "none",
            backgroundColor: "#e2ecf6",
            color: "#274f8b",
        },
    },
});

export const dropDownItemWithIndicatorStyles = style([
    dropDownItemStyles,
    {
        paddingLeft: "35px", // Add left padding only when indicators are present
    },
]);

export const dropdownItemIndicatorStyles = style({
    position: "absolute",
    left: 0,
    width: "25px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
});

/* =========================
   Multi-Select Styles
   ========================= */
export const multiSelectTagsContainer = style({
    display: "flex",
    flexWrap: "wrap", // Allow wrapping
    gap: "4px",
    flex: 1,
    alignItems: "center",
    maxWidth: "calc(100% - 50px)", // Reserve space for dropdown icon
});

export const selectFieldContainer = style({
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
    minWidth: "91px", // Minimum width, but can grow
    height: "30px",
    padding: "12px 15px",
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
    backgroundImage: "linear-gradient(to top, #efefef, var(--ffffff-white-2))",
    border: "none",
    borderRadius: "4px",
    whiteSpace: "nowrap", // Prevent text wrapping
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
// Add these styles to your existing styles file:

export const multiSelectOptionButton = style({
    fontSize: "1rem",
    lineHeight: "1.5rem",
    color: "#000000",
    display: "flex",
    alignItems: "center",
    height: "25px",
    padding: "8px 5px",
    position: "relative",
    userSelect: "none",
    width: "100%",
    textAlign: "left",
    border: "none",
    background: "none",
    cursor: "pointer",
    selectors: {
        "&:hover": {
            outline: "none",
            backgroundColor: "#e2ecf6",
            color: "#274f8b",
        },
        "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
        }
    }
});

export const multiSelectOptionButtonDisabled = style([
    multiSelectOptionButton,
    {
        opacity: 0.5,
        cursor: "not-allowed",
    }
]);

export const filterContainer = style({
    padding: "5px",
    borderBottom: "1px solid #e5e7eb"
});

export const noOptionsMessage = style({
    padding: "12px",
    textAlign: "center",
    color: "#6b7280"
});

export const multiSelectOptionCheckbox = style({
    width: "17px",
    height: "17px",
    borderRadius: "2px",
    boxShadow: "inset 0px 1px 4px 0px rgba(0, 0, 0, 0.5)",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "8px",
});

/* =========================
   Icons
   ========================= */
export const iconStyle = style({
    color: "#2e6db4 !important",
});
