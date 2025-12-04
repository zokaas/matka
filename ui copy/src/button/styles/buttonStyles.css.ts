import { style } from "@vanilla-extract/css";

export const buttonStyles = style({
    width: "auto",
    height: "auto",
    border: "none",
    borderRadius: "2px",
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
    backgroundImage: "linear-gradient(to top, #c7c7c7, #fff)",
    padding: "5px 10px",
    lineHeight: "1.5rem",
    fontSize: "1rem",
    color: "#373737",
    cursor: "pointer",
    outline: "none",
    ":disabled": {
        color: "#cccccc",
        cursor: "not-allowed", // Add this - shows it's disabled
    },
    ":hover": {
        backgroundImage: "linear-gradient(to top, #bbb, #eee)",
    },
    ":focus": {
        outline: "none",
    },
});