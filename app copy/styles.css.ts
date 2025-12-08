import { themeVars } from "@ui/themes";
import { style } from "@vanilla-extract/css";

export const bodyStyles = style({
    backgroundColor: themeVars.color.baseWhite100,
    backgroundImage: themeVars.background.image,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
});
