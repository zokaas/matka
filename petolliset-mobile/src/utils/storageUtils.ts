
// src/utils/storageUtils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  USERNAME: 'username',
  USER_PREFERENCES: 'userPreferences',
  CACHED_USERS: 'cachedUsers',
  LAST_SYNC: 'lastSync',
} as const;

export const storeData = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
};

export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

// User-specific storage helpers
export const getCurrentUsername = async (): Promise<string | null> => {
  return getData<string>(STORAGE_KEYS.USERNAME);
};

export const setCurrentUsername = async (username: string): Promise<void> => {
  return storeData(STORAGE_KEYS.USERNAME, username);
};

export const clearCurrentUsername = async (): Promise<void> => {
  return removeData(STORAGE_KEYS.USERNAME);
};