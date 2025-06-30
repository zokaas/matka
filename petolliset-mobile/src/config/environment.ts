// src/config/environment.ts - Expo-safe environment configuration
import { Platform } from 'react-native';

// Simple, reliable backend URL configuration
const PRODUCTION_URL = 'https://matka-zogy.onrender.com';

// For debugging - make sure this logs correctly
if (__DEV__) {
  console.log('Environment setup - Platform:', Platform.OS);
  console.log('Environment setup - Backend URL:', PRODUCTION_URL);
}

export const ENV = {
  BACKEND_URL: PRODUCTION_URL,
  API_TIMEOUT: 15000, // 15 seconds
  DEBUG: __DEV__,
  PLATFORM: Platform.OS,
} as const;

// Export for easy access
export const BACKEND_URL = ENV.BACKEND_URL;

// Simple validation
if (!BACKEND_URL) {
  throw new Error('Backend URL is not defined');
}

export default ENV;