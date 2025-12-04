import { style } from "@vanilla-extract/css";
import { vars } from "@ui/themes";

export const boComponentContainer = style({
    padding: "5px",
    border: "1px solid",
    borderColor: "oklch(95% 0 0)",
    zIndex: 10000,
});

export const boQuestionContainer = style({
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
});

export const boLabelButtonRow = style({
    all: "unset",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    minHeight: "40px",
});

export const boLabelContainer = style({
    flex: "1",
    marginRight: "12px",
    maxWidth: "calc(100% - 60px)",
});

export const boButtonContainer = style({
    all: "unset",
    flexShrink: 0,
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: "2px",
});

export const boPopoverButton = style({
    all: "unset",
    borderRadius: "100%",
    width: vars.size.xl,
    height: vars.size.xl,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: vars.color.baseWhite100,
    backgroundColor: vars.color.baseGreen500,
    ":hover": {
        backgroundColor: vars.color.baseGreen420,
    },
});

export const boCloseIcon = style({
    all: "unset",
    display: "inline-flex",
    position: "absolute",
    top: vars.size.xs,
    right: vars.size.xs,
});

export const addBoFormButton = style({
    all: "unset",
    marginTop: vars.spacing.smallPadding,
    marginLeft: "auto",
    marginRight: 0,
    padding: vars.spacing.tinyPadding,
    borderRadius: "2px",
    boxShadow: `0 2px 4px 0 ${vars.color.blackAlpha20}`,
    backgroundImage: `linear-gradient(to bottom, ${vars.color.baseGreen400} -14%, ${vars.color.baseGreen500} 114%)`,
    color: vars.color.baseWhite100,
    ":hover": {
        backgroundImage: `linear-gradient(to bottom, ${vars.color.baseGreen410} -14%, ${vars.color.baseGreen500} 114%)`,
    },
    ":active": {
        backgroundImage: `linear-gradient(to bottom, ${vars.color.baseGreen420} -14%, ${vars.color.baseGreen500} 114%)`,
    },
    ":disabled": {
        boxShadow: `0 2px 1px 0 ${vars.color.blackAlpha43}`,
        backgroundImage: "none",
        backgroundColor: vars.color.baseNeutral350,
    },
});

export const boResultAndButton = style({
    all: "unset",
    display: "flex",
    borderTop: `1px solid ${vars.color.baseGray100}`,
    marginTop: vars.spacing.tinyPadding,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
});

export const removeBoFormButton = style({
    flexShrink: 0,
    all: "unset",
    width: vars.size.xl,
    height: vars.size.huge,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: vars.color.baseContent,
    ":hover": {
        color: vars.color.blackAlpha20,
    },
});

export const boResultContainer = style({
    flex: "1",
    display: "grid",
    // fr = fraction => https://www.digitalocean.com/community/tutorials/css-css-grid-layout-fr-unit
    // https://css-tricks.com/introduction-fr-css-unit/
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
    marginTop: vars.spacing.tinyPadding,
    marginRight: vars.spacing.basicPadding,
});

export const boResultValuesContainer = style({
    padding: `${vars.spacing.defaultPadding} 0`,
});

export const boResultValueLabelContainer = style({
    padding: vars.spacing.defaultPadding,
    backgroundColor: vars.color.baseWhite400,
    fontWeight: vars.fontWeight.semiBold,
});

export const boResultValueContainer = style({
    padding: vars.spacing.defaultPadding,
});
