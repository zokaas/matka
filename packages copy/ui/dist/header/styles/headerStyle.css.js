import { style } from "@vanilla-extract/css";
import { vars } from "@ui/themes";
export const headerStyles = style({
    backgroundColor: vars.header.backgroundColor,
    boxShadow: vars.header.boxShadow,
    minHeight: vars.header.minHeight,
    position: vars.header.position,
    width: vars.header.width,
    zIndex: vars.header.zIndex,
});
export const headerContentContainer = style({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "976px",
    height: "100%",
    marginInline: "auto",
    paddingInline: "1.5rem",
});
export const headerLogoContainer = style({
    flexShrink: "0",
});
export const headerLogoImage = style({
    height: "64px !important",
    width: "auto !important",
    maxWidth: "100%",
});
export const headerTitle = style({
    fontSize: "1.5rem",
    color: vars.color.baseContent,
    lineHeight: "1.333rem",
    fontWeight: "600",
});
