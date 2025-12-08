import { style } from "@vanilla-extract/css";

export const checkboxContainerStyle = style({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flexGrow: 1,
});

export const checkboxFieldContainerStyle = style({
    display: "flex",
    alignItems: "center",
    gap: "12px",
});

export const checkboxRootStyle = style({
    all: "unset",
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    border: "1px solid #cccccc",
    backgroundColor: "white",
    boxShadow: "inset 0px 1px 4px 0px rgba(0, 0, 0, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    cursor: "pointer",
    transition: "all 0.2s ease",

    ":hover": {
        borderColor: "#2e6db4",
        backgroundColor: "#f8f9fa",
    },

    ":focus": {
        outline: "none",
        boxShadow: "0 0 0 2px oklch(0.6948 0.1262 151.95)",
    },

    selectors: {
        "&[data-state='checked']": {
            backgroundColor: "#2e6db4",
            borderColor: "#2e6db4",
        },
        "&[data-disabled]": {
            opacity: 0.5,
            cursor: "not-allowed",
            pointerEvents: "none",
        },
    },
});

export const checkboxIndicatorStyle = style({
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
});

export const checkboxLabelStyle = style({
    color: "oklch(21% 0.006 285.885)",
    fontSize: "1rem",
    lineHeight: "1.5",
    cursor: "pointer",
    userSelect: "none",
});