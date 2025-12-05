// packages/ui/src/themes/index.ts

import { swedenB2BTheme } from "./sweden-b2b-application.theme.css";

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

// Export theme classes
export { swedenB2BTheme } from "./sweden-b2b-application.theme.css";

// Export metadata utilities
export {
    themeMetadata,
    getThemeMetadata,
    getAllThemeIds,
    type ThemeMetadata,
} from './metadata';

/**
 * Get the CSS class name for a theme
 */
export function getThemeClass(productId: string): string {
    const themeMap: Record<string, string> = {
        'sweden-b2b-application': swedenB2BTheme,
    };
    
    return themeMap[productId] || themeMap['sweden-b2b-application'];
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
 *   fontFamily: themeVars.font.family,
 * });
 * ```
 */