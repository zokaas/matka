import { style } from "@vanilla-extract/css";

export const buttonStyles = style({
    width: "auto",
    height: "auto",
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
    backgroundImage: "linear-gradient(to top, #c7c7c7, #fff)",
    padding: "5px 10px",
    lineHeight: "1.5rem",
    fontSize: "1rem",
    color: "#373737",
    ":disabled": {
        color: "#cccccc",
    },
    ":hover": {
        backgroundImage: "linear-gradient(to top, #bbb, #eee)",
    },
});
