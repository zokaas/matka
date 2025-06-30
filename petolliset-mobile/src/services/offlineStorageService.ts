// src/services/offlineStorageService.ts - Enhanced offline storage with caching
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Activity, Quote } from '../types/types';

interface CacheMetadata {
  timestamp: number;
  version: string;
}

interface CachedData<T> {
  data: T;
  metadata: CacheMetadata;
}

export class OfflineStorageService {
  private static readonly CACHE_VERSION = '1.0.0';
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private static readonly KEYS = {
    USERS: 'cached_users',
    TOTAL_KM: 'cached_total_km',
    QUOTES: 'cached_quotes',
    RECENT_ACTIVITIES: 'cached_recent_activities',
    USER_PROFILE: 'cached_user_profile_',
    OFFLINE_ACTIVITIES: 'offline_activities',
    OFFLINE_QUOTES: 'offline_quotes',
    LAST_SYNC: 'last_sync_timestamp',
  } as const;

  // Generic cache methods
  private static async setCache<T>(key: string, data: T): Promise<void> {
    try {
      const cachedData: CachedData<T> = {
        data,
        metadata: {
          timestamp: Date.now(),
          version: this.CACHE_VERSION,
        },
      };
      await AsyncStorage.setItem(key, JSON.stringify(cachedData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  private static async getCache<T>(key: string): Promise<T | null> {
    try {
      const cachedString = await AsyncStorage.getItem(key);
      if (!cachedString) return null;

      const cached: CachedData<T> = JSON.parse(cachedString);
      
      // Check version compatibility
      if (cached.metadata.version !== this.CACHE_VERSION) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      // Check if cache is still valid
      const now = Date.now();
      const isExpired = now - cached.metadata.timestamp > this.CACHE_DURATION;
      
      if (isExpired) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  // Users caching
  static async cacheUsers(users: User[]): Promise<void> {
    await this.setCache(this.KEYS.USERS, users);
  }

  static async getCachedUsers(): Promise<User[] | null> {
    return this.getCache<User[]>(this.KEYS.USERS);
  }

  // Total kilometers caching
  static async cacheTotalKm(totalKm: number): Promise<void> {
    await this.setCache(this.KEYS.TOTAL_KM, totalKm);
  }

  static async getCachedTotalKm(): Promise<number | null> {
    return this.getCache<number>(this.KEYS.TOTAL_KM);
  }

  // Quotes caching
  static async cacheQuotes(quotes: Quote[]): Promise<void> {
    await this.setCache(this.KEYS.QUOTES, quotes);
  }

  static async getCachedQuotes(): Promise<Quote[] | null> {
    return this.getCache<Quote[]>(this.KEYS.QUOTES);
  }

  // Recent activities caching
  static async cacheRecentActivities(activities: any[]): Promise<void> {
    await this.setCache(this.KEYS.RECENT_ACTIVITIES, activities);
  }

  static async getCachedRecentActivities(): Promise<any[] | null> {
    return this.getCache<any[]>(this.KEYS.RECENT_ACTIVITIES);
  }

  // User profile caching
  static async cacheUserProfile(username: string, user: User): Promise<void> {
    await this.setCache(this.KEYS.USER_PROFILE + username, user);
  }

  static async getCachedUserProfile(username: string): Promise<User | null> {
    return this.getCache<User>(this.KEYS.USER_PROFILE + username);
  }

  // Offline activity queue
  static async addOfflineActivity(activity: {
    username: string;
    activity: string;
    duration: number;
    date: string;
    bonus?: string | null;
    tempId: string;
  }): Promise<void> {
    try {
      const existing = await AsyncStorage.getItem(this.KEYS.OFFLINE_ACTIVITIES);
      const activities = existing ? JSON.parse(existing) : [];
      activities.push({ ...activity, timestamp: Date.now() });
      await AsyncStorage.setItem(this.KEYS.OFFLINE_ACTIVITIES, JSON.stringify(activities));
    } catch (error) {
      console.error('Error adding offline activity:', error);
    }
  }

  static async getOfflineActivities(): Promise<any[]> {
    try {
      const activities = await AsyncStorage.getItem(this.KEYS.OFFLINE_ACTIVITIES);
      return activities ? JSON.parse(activities) : [];
    } catch (error) {
      console.error('Error getting offline activities:', error);
      return [];
    }
  }

  static async removeOfflineActivity(tempId: string): Promise<void> {
    try {
      const existing = await AsyncStorage.getItem(this.KEYS.OFFLINE_ACTIVITIES);
      if (existing) {
        const activities = JSON.parse(existing);
        const filtered = activities.filter((a: any) => a.tempId !== tempId);
        await AsyncStorage.setItem(this.KEYS.OFFLINE_ACTIVITIES, JSON.stringify(filtered));
      }
    } catch (error) {
      console.error('Error removing offline activity:', error);
    }
  }

  // Offline quotes queue
  static async addOfflineQuote(quote: { text: string; tempId: string }): Promise<void> {
    try {
      const existing = await AsyncStorage.getItem(this.KEYS.OFFLINE_QUOTES);
      const quotes = existing ? JSON.parse(existing) : [];
      quotes.push({ ...quote, timestamp: Date.now() });
      await AsyncStorage.setItem(this.KEYS.OFFLINE_QUOTES, JSON.stringify(quotes));
    } catch (error) {
      console.error('Error adding offline quote:', error);
    }
  }

  static async getOfflineQuotes(): Promise<any[]> {
    try {
      const quotes = await AsyncStorage.getItem(this.KEYS.OFFLINE_QUOTES);
      return quotes ? JSON.parse(quotes) : [];
    } catch (error) {
      console.error('Error getting offline quotes:', error);
      return [];
    }
  }

  static async removeOfflineQuote(tempId: string): Promise<void> {
    try {
      const existing = await AsyncStorage.getItem(this.KEYS.OFFLINE_QUOTES);
      if (existing) {
        const quotes = JSON.parse(existing);
        const filtered = quotes.filter((q: any) => q.tempId !== tempId);
        await AsyncStorage.setItem(this.KEYS.OFFLINE_QUOTES, JSON.stringify(filtered));
      }
    } catch (error) {
      console.error('Error removing offline quote:', error);
    }
  }

  // Sync management
  static async setLastSyncTime(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.KEYS.LAST_SYNC, Date.now().toString());
    } catch (error) {
      console.error('Error setting last sync time:', error);
    }
  }

  static async getLastSyncTime(): Promise<number | null> {
    try {
      const timestamp = await AsyncStorage.getItem(this.KEYS.LAST_SYNC);
      return timestamp ? parseInt(timestamp) : null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }

  // Clear all cache
  static async clearCache(): Promise<void> {
    try {
      const keys = Object.values(this.KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Get cache info for debugging
  static async getCacheInfo(): Promise<{
    users: boolean;
    totalKm: boolean;
    quotes: boolean;
    recentActivities: boolean;
    offlineActivities: number;
    offlineQuotes: number;
    lastSync: Date | null;
  }> {
    const [
      users,
      totalKm,
      quotes,
      recentActivities,
      offlineActivities,
      offlineQuotes,
      lastSyncTime,
    ] = await Promise.all([
      this.getCachedUsers(),
      this.getCachedTotalKm(),
      this.getCachedQuotes(),
      this.getCachedRecentActivities(),
      this.getOfflineActivities(),
      this.getOfflineQuotes(),
      this.getLastSyncTime(),
    ]);

    return {
      users: users !== null,
      totalKm: totalKm !== null,
      quotes: quotes !== null,
      recentActivities: recentActivities !== null,
      offlineActivities: offlineActivities.length,
      offlineQuotes: offlineQuotes.length,
      lastSync: lastSyncTime ? new Date(lastSyncTime) : null,
    };
  }
}