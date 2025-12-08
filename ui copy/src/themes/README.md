# Theme System

A theme system separating structure from appearance.

## Core Concept

```
designConstants  →  Structure (spacing, sizing, shadows)    →  Same everywhere
themeVars       →  Appearance (colors, fonts, backgrounds) →  Changes per theme
```

## Quick Start

```typescript
import { themeVars, designConstants } from '@ui/themes';
import { style } from '@vanilla-extract/css';

export const button = style({
    // Structure - use designConstants
    padding: designConstants.spacing.smallPadding,
    borderRadius: designConstants.radius.md,
    fontSize: designConstants.fontSize.base,
    boxShadow: designConstants.shadows.lg,
    
    // Appearance - use themeVars
    backgroundColor: themeVars.color.primary,
    color: themeVars.color.primaryContent,
    
});
```

## Design Constants

Values that are **identical across all themes**.

### Spacing
```typescript
designConstants.spacing.defaultPadding  // 4px
designConstants.spacing.tinyPadding     // 8px
designConstants.spacing.smallPadding    // 16px
designConstants.spacing.basicPadding    // 24px
designConstants.spacing.largePadding    // 32px
```

### Sizing
```typescript
designConstants.size.xs      // 8px
designConstants.size.s       // 16px
designConstants.size.m       // 24px
designConstants.size.l       // 32px
designConstants.size.xl      // 40px
designConstants.size.xxl     // 48px
designConstants.size.xxxl    // 56px
designConstants.size.huge    // 64px
```

### Border Radius
```typescript
designConstants.radius.sm    // 2px
designConstants.radius.md    // 4px
designConstants.radius.lg    // 8px
designConstants.radius.xl    // 16px
```

### Typography
```typescript
// Font sizes
designConstants.fontSize.sm      // 14px
designConstants.fontSize.base    // 16px
designConstants.fontSize.lg      // 18px
designConstants.fontSize.xl      // 20px
designConstants.fontSize.xxl     // 24px
designConstants.fontSize.xxxl    // 30px

// Font weights
designConstants.fontWeight.normal    // 400
designConstants.fontWeight.medium    // 500
designConstants.fontWeight.semiBold  // 600
designConstants.fontWeight.bold      // 700

// Line heights
designConstants.lineHeight.tight    // 1.25
designConstants.lineHeight.normal   // 1.5
designConstants.lineHeight.relaxed  // 1.75
```

### Containers
```typescript
designConstants.width.full          // 100%
designConstants.width.containerSm   // 384px
designConstants.width.containerMd   // 448px
designConstants.width.containerLg   // 512px
designConstants.width.containerXl   // 576px
designConstants.width.container2xl  // 672px
designConstants.width.container6xl  // 1152px
```

### Shadows
```typescript
designConstants.shadows.sm      // Subtle
designConstants.shadows.base    // Base
designConstants.shadows.md      // Medium
designConstants.shadows.lg      // Large
designConstants.shadows.xl      // Extra large
designConstants.shadows.custom  // Custom
designConstants.shadows.strong  // Strong
```

### Z-Index
```typescript
designConstants.zIndex.dropdown       // 1000
designConstants.zIndex.sticky         // 1020
designConstants.zIndex.fixed          // 1030
designConstants.zIndex.modalBackdrop  // 1040
designConstants.zIndex.modal          // 1050
designConstants.zIndex.popover        // 1060
designConstants.zIndex.tooltip        // 1070
```

### Layout
```typescript
designConstants.layout.header.minHeight  // 76px
designConstants.layout.header.position   // relative
designConstants.layout.header.width      // 100%
designConstants.layout.header.zIndex     // 10
```

### Transitions
```typescript
designConstants.transitions.fast    // 150ms
designConstants.transitions.base    // 200ms
designConstants.transitions.slow    // 300ms
designConstants.transitions.slower  // 500ms
```

## Theme Variables

Values that **change per theme**.

### Colors
```typescript
// Brand colors
themeVars.color.primary
themeVars.color.primaryContent
themeVars.color.secondary
themeVars.color.secondaryContent
themeVars.color.accent
themeVars.color.accentContent

// Base colors
themeVars.color.baseWhite100
themeVars.color.baseWhite200
themeVars.color.baseWhite400
themeVars.color.baseWhite400
themeVars.color.baseContent
themeVars.color.activeContent

// Semantic colors
themeVars.color.success
themeVars.color.successContent
themeVars.color.warning
themeVars.color.warningContent
themeVars.color.error
themeVars.color.errorContent
themeVars.color.info
themeVars.color.infoContent

// Component-specific
themeVars.color.baseGray100
themeVars.color.baseGray500
themeVars.color.baseNeutral350
themeVars.color.baseGreen400
themeVars.color.baseGreen410
themeVars.color.baseGreen420
themeVars.color.baseGreen500
themeVars.color.blackAlpha50
themeVars.color.blackAlpha43
themeVars.color.blackAlpha20
```

### Typography
```typescript
themeVars.font.family  // Font family (changes per theme)
```

### Background
```typescript
themeVars.background.image  // Background image
themeVars.background.color  // Background color
```
### Logo
```typescript
themeVars.assets.logo  // logo image
```

### Component-Specific
```typescript
themeVars.header.backgroundColor
themeVars.steps.badgeBackgroundColor
themeVars.steps.badgeBorderColor
themeVars.steps.labelColor
themeVars.steps.labelActiveColor
themeVars.steps.progressLineBackgroundColor
```

## Decision Tree

```
Need a value?
    │
    ├─ Is it a color, font, or background?
    │   └─ YES → Use themeVars
    │
    └─ Is it layout/structure?
        └─ YES → Use designConstants
```

## Creating a Theme

Only define colors, fonts, and backgrounds. Structure is shared automatically.

```typescript
// themes/my-theme.theme.css.ts
import { createTheme } from "@vanilla-extract/css";
import { themeVars } from "./contract.css";

export const myTheme = createTheme(themeVars, {
    color: {
        primary: "oklch(60% 0.25 250)",
        primaryContent: "oklch(100% 0 0)",
        // ... ~other colors
    },
    
    font: {
        family: "'My Font', sans-serif",
    },
    
    background: {
        image: "url(/path/to/bg.svg)",
        color: "transparent",
    },
    
    header: {
        backgroundColor: "oklch(100% 0 0)",
    },
    
    steps: {
        badgeBackgroundColor: "oklch(0.68 0.13 152)",
        badgeBorderColor: "oklch(0.68 0.13 152)",
        labelColor: "oklch(68% 0.02 260)",
        labelActiveColor: "oklch(15% 0.02 260)",
        progressLineBackgroundColor: "oklch(0.68 0.13 152)",
    },
});
```

Then add to `index.ts`:

```typescript
export { myTheme } from './my-theme.theme.css';

export function getThemeClass(productId: string): string {
    const themeMap: Record<string, string> = {
        'my-theme': myTheme,
        // ...
    };
    return themeMap[productId] || myTheme;
}
```