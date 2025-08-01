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
  weatherIcons: Record<string, string>;       // ✅ add this
  stageColors: Record<string, string>;        // ✅ add this
}
