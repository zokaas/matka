import { swedenB2BTheme } from "./sweden-b2b-application";


/**
 * Theme System Exports
 * 
 * CONSTANTS: Import these directly in components for values that never change
 * THEME VARS: Use these in vanilla-extract styles for values that change per theme
 */

// Export design constants (spacing, sizing, shadows, etc.)
export { designConstants } from "./constants";

// Export theme contract (colors, fonts, backgrounds)
export { themeVars } from "./contract.css";


/**
 * Get the CSS class name for a theme
 */
export function getThemeClass(productId: string): string {
    const themeMap: Record<string, string> = {
        'sweden-b2b-application': swedenB2BTheme
    };
    
    // Default to Sweden theme if not found
    return themeMap[productId] || swedenB2BTheme;
}

/**
 * Usage Guide:
 * 
 * In components:
 * - Use `designConstants` for spacing, sizing, shadows, z-index
 * - Use `themeVars` for colors, fonts, backgrounds
 * 
 * Example:
 * ```ts
 * import { style } from '@vanilla-extract/css';
 * import { themeVars, designConstants } from '@ui/themes';
 * 
 * export const myStyle = style({
 *   // Constants - same everywhere
 *   padding: designConstants.spacing.basicPadding,
 *   borderRadius: designConstants.radius.lg,
 *   boxShadow: designConstants.shadows.lg,
 *   
 *   // Theme-specific - changes per theme
 *   color: themeVars.color.primary,
 *   backgroundColor: themeVars.color.baseWhite100,
 *   
 * });
 * ```
 */