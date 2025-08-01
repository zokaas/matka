import { Theme, ThemeId } from './themeTypes';
import { tourDeFranceTheme } from './tourDeFranceTheme';

export const themes: Record<ThemeId, Theme> = {
  tour: tourDeFranceTheme,
};

// Always use a valid lowercase key
const selectedThemeId = localStorage.getItem("selectedTheme")?.toLowerCase() || "tour";
export const activeTheme = selectedThemeId;
