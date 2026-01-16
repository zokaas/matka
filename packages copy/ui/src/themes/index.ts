export { designConstants } from "./constants";
export { themeVars } from "./contract.css";

//theme imports
import { swedenB2BTheme } from "./sweden-b2b-application";
import { swedenFlexOnlineTheme } from "./sweden-flex-online/sweden-flex-online.theme.css";

/**
 * Get the CSS class name for a theme
 */
export function getThemeClass(productId: string): string {
    const themeMap: Record<string, string> = {
        "sweden-b2b-application": swedenB2BTheme,
        "sweden-flex-online": swedenFlexOnlineTheme,
    };

    // TODO: create opr default theme!
    return themeMap[productId] || swedenB2BTheme;
}
