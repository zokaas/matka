export { vars } from "./contract.css";
export { baseTokens } from "./base-tokens";
import { swedenB2BTheme } from "./sweden-b2b-application.theme.css";
export { swedenB2BTheme } from "./sweden-b2b-application.theme.css";;
export * from "./metadata";


export {
    themeMetadata,
    getThemeMetadata,
    getAllThemeIds,
    type ThemeMetadata,
} from './metadata';

export function getThemeClass(productId: string): string {
  const themeMap: Record<string, string> = {
    'sweden-b2b-application': swedenB2BTheme,
  };
  
  return themeMap[productId] || themeMap['sweden-b2b-application'];
}