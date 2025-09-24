// In your src copy/modal/styles/modalStyles.css.ts file, add these missing exports:

import { style } from "@vanilla-extract/css";

// Your existing styles
export const modalStyles = style({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
});

export const modalContentContainer = style({
    background: "white",
    borderRadius: 8,
    padding: "2rem",
    maxWidth: 400,
    textAlign: "center",
});

export const actionBlock = style({
    marginTop: "1.5rem",
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
});

// Add these new missing styles:
export const modalTitle = style({
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#333",
});

export const modalDescription = style({
    fontSize: "1rem",
    marginBottom: "1.5rem",
    color: "#666",
    lineHeight: "1.5",
});

export const modalButton = style({
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    backgroundColor: "#3b82f6",
    color: "white",
    transition: "background-color 0.2s",
    selectors: {
        "&:hover": {
            backgroundColor: "#2563eb",
        },
        "&:disabled": {
            backgroundColor: "#9ca3af",
            cursor: "not-allowed",
        },
    },
});