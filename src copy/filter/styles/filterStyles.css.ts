import { style } from "@vanilla-extract/css";

export const filterContainerStyle = style({
    display: "inline-flex",
    width: "100%",
    margin: "5px",
    boxSizing: "border-box",
});

export const filterInputStyle = style({
    border: "1px solid #cccccc",
    margin: "5px",
    marginRight: "11px",
    padding: "8px",
    borderRadius: "6px",
    boxSizing: "border-box",
    width: "100%",
});
