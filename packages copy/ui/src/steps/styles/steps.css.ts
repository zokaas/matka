import { style } from "@vanilla-extract/css";

export const stepsStyle = style({
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "0 16px",
});

export const stepsContainerStyle = style({
    display: "flex",
    justifyContent: "space-between",
    marginTop: "40px",
    position: "relative",
    "::before": {
        content: "",
        position: "absolute",
        background: "oklch(87.2% 0.01 258.338)",
        height: "0.25rem",
        width: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        left: 0,
    },
});

export const stepsFilledLineStyle = style({
    content: "",
    position: "absolute",
    background: "oklch(58.5% 0.233 277.117)", // color-indigo-500
    height: "0.25rem",
    width: "100%",
    top: "50%",
    transition: "0.4s ease",
    transform: "translateY(-50%)",
    left: 0,
});
