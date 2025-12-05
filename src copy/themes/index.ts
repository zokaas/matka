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
 * Get theme metadata (fonts, logos, etc.)
 */
export type ThemeMetadata = {
    id: string;
    name: string;
    fontUrl?: string;
    logoUrl: string;
    faviconUrl?: string;
};

export const themeMetadata: Record<string, ThemeMetadata> = {
    'sweden-b2b-application': {
        id: 'sweden-b2b-application',
        name: 'Sweden B2B Application',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap',
        logoUrl: '/logos/t.svg',
        faviconUrl: '/favicons/sweden-b2b.ico',
    },
};

export function getThemeMetadata(productId: string): ThemeMetadata {
    const metadata = themeMetadata[productId];
    
    if (!metadata) {
        console.warn(
            `Theme metadata not found for productId: ${productId}, ` +
            `falling back to sweden-b2b-application`
        );
        return themeMetadata['sweden-b2b-application'];
    }
    
    return metadata;
}

export function getAllThemeIds(): string[] {
    return Object.keys(themeMetadata);
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