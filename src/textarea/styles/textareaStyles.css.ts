import { style } from "@vanilla-extract/css";

export const textareaContainerStyle = style({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
});

export const textareaLabelStyle = style({
    fontSize: "16px",
    fontWeight: "400",
    color: "oklch(21% 0.006 285.885)",
});

export const textareaFieldStyle = style({
    width: "100%",
    padding: "0.5rem",
    border: "1px solid",
    borderColor: "oklch(95% 0 0)",
    backgroundColor: "oklch(100% 0 0)",
    color: "oklch(21% 0.006 285.885)",
    borderRadius: "0.25rem",
    minHeight: "100px",

    "::placeholder": {
        color: "oklch(21% 0.006 285.885, 0.4)",
    },

    ":focus": {
        outline: "none",
        boxShadow: "0 0 0 2px oklch(0.6948 0.1262 151.95)",
    },
    ":hover": {
        borderColor: "oklch(90% 0 0)",
    },
});
