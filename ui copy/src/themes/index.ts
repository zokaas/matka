export { designConstants } from "./constants";
export { themeVars } from "./contract.css";

//theme imports
import { swedenB2BTheme } from "./sweden-b2b-application";

/**
 * Get the CSS class name for a theme
 */
export function getThemeClass(productId: string): string {
    const themeMap: Record<string, string> = {
        "sweden-b2b-application": swedenB2BTheme,
    };

    // TODO: create opr default theme!
    return themeMap[productId] || swedenB2BTheme;
}
