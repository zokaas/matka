import { style } from "@vanilla-extract/css";

export const tooltipTriggerStyles = style({
    all: "unset",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#2e6db4",
    color: "white",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    marginLeft: "8px",
    transition: "background-color 0.2s ease",
    
    ":hover": {
        backgroundColor: "#274f8b",
    },
    
    ":focus": {
        outline: "2px solid #2e6db4",
        outlineOffset: "2px",
    },
});

export const tooltipContentStyles = style({
    borderRadius: "6px",
    padding: "12px 16px",
    maxWidth: "300px",
    backgroundColor: "white",
    color: "#333",
    fontSize: "14px",
    lineHeight: "1.4",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2)",
    zIndex: 1000,
});

export const tooltipArrowStyles = style({
    fill: "white",
    stroke: "#e5e7eb",
    strokeWidth: "1px",
});

export const tooltipHeaderStyles = style({
    margin: "0 0 8px 0",
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
});

export const tooltipDescriptionStyles = style({
    margin: "0",
    color: "#6b7280",
    lineHeight: "1.5",
});