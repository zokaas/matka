import { style } from "@vanilla-extract/css";

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
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.6), 0 2px 2px 0 rgba(0, 0, 0, 0.5)",
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
    padding: "5px 35px 5px 25px",
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
/*
.Item {
	&[data-disabled] {
		color: var(--mauve-8);
		pointer-events: none;
	}
	&[data-highlighted] {
		outline: none;
		background-color: var(--violet-9);
		color: var(--violet-1);
	}
}
*/

export const dropdownItemIndicatorStyles = style({
    position: "absolute",
    left: 0,
    width: "25px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
});
