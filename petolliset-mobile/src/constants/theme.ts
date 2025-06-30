// src/constants/theme.ts - Modern, vibrant theme
export const theme = {
  colors: {
    primary: '#6366f1',        // Modern indigo
    primaryLight: '#a5b4fc',   // Light indigo
    primaryDark: '#4f46e5',    // Dark indigo
    
    secondary: '#06b6d4',      // Cyan
    secondaryLight: '#67e8f9', // Light cyan
    
    accent: '#f59e0b',         // Amber
    accentLight: '#fbbf24',    // Light amber
    
    background: '#f8fafc',     // Clean light gray
    surface: '#ffffff',        // Pure white
    surfaceElevated: '#f1f5f9', // Slightly darker surface
    
    success: '#10b981',        // Emerald
    warning: '#f59e0b',        // Amber
    error: '#ef4444',          // Red
    info: '#3b82f6',           // Blue
    
    text: '#1e293b',           // Dark slate
    textSecondary: '#64748b',  // Slate
    textMuted: '#94a3b8',      // Light slate
    textOnPrimary: '#ffffff',  // White text on primary
    
    border: '#e2e8f0',         // Light border
    borderLight: '#f1f5f9',    // Very light border
    
    // Status colors for progress
    progressBad: '#ef4444',    // Red
    progressOk: '#f59e0b',     // Amber
    progressGood: '#10b981',   // Green
    progressExcellent: '#8b5cf6', // Purple
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 5,
    },
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '800' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodyMedium: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    captionMedium: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
    },
    small: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
    smallMedium: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
    },
  },
  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
};

// Helper function to get progress color based on percentage
export const getProgressColor = (percentage: number) => {
  if (percentage >= 100) return theme.colors.progressExcellent;
  if (percentage >= 75) return theme.colors.progressGood;
  if (percentage >= 50) return theme.colors.progressOk;
  return theme.colors.progressBad;
};

// Helper function for consistent spacing
export const spacing = (multiplier: number) => theme.spacing.md * multiplier;