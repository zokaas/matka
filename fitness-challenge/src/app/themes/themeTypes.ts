// themeTypes.ts
import { ThemeTranslations } from './translationKeys';


export interface Stage {
  name: string;
  pointsRequired: number;
  emoji: string;
  description: string;
  stageType: string;
  weather: string;
  location: string; // ✅ required
  color: string;
}

export interface Theme {
  name: string;
  totalStages: number;
  totalDistance: number;
  totalPoints: number;
  stages: Stage[];
  translations: ThemeTranslations;
  weatherIcons: Record<string, string>;
  stageColors: Record<string, string>;
  colors: ThemeColors;
}

export type ThemeId = "tour";

export interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  mutedText: string;
  border: string;
  accent: string;
  button: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}

export interface Stage {
  name: string;
  pointsRequired: number;
  emoji: string;
  description: string;
  stageType: string;
  weather: string;
  location: string; // ✅ required
  color: string;
}

export interface Theme {
  name: string;
  totalStages: number;
  totalDistance: number;
  totalPoints: number;
  stages: Stage[];
  translations: ThemeTranslations;
  weatherIcons: Record<string, string>;       // ✅ add this
  stageColors: Record<string, string>;        // ✅ add this
  colors: ThemeColors;                        // ✅ add this
}