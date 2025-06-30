// src/services/authService.ts - Expo-safe authentication service
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './apiService';

export interface AuthUser {
  username: string;
  isAuthenticated: boolean;
  loginTime: number;
}

export class AuthService {
  private static readonly AUTH_KEY = 'auth_user';
  private static readonly RECENT_USERS_KEY = 'recent_users';
  private static readonly MAX_RECENT_USERS = 5;

  // Get current authenticated user
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const authData = await AsyncStorage.getItem(this.AUTH_KEY);
      if (!authData) {
        console.log('No auth data found');
        return null;
      }

      const user: AuthUser = JSON.parse(authData);
      console.log('Current user found:', user.username);
      
      if (user.isAuthenticated) {
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Simple login - verify username exists on backend
  static async login(username: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!username.trim()) {
        return { success: false, error: 'Anna käyttäjänimi' };
      }

      console.log('Attempting login for:', username);
      const normalizedUsername = username.trim();

      // Test backend connection first
      const isBackendAvailable = await apiService.testConnection();
      if (!isBackendAvailable) {
        return { success: false, error: 'Palvelin ei ole käytettävissä. Tarkista internetyhteys.' };
      }

      // Check if user exists on backend
      try {
        console.log('Checking if user exists:', normalizedUsername);
        await apiService.getUser(normalizedUsername, 1, 1);
        console.log('User exists');
      } catch (error) {
        // If user doesn't exist, create them
        console.log('User does not exist, creating new user');
        try {
          await apiService.addUser(normalizedUsername, 0);
          console.log('New user created successfully');
        } catch (createError) {
          console.error('Failed to create user:', createError);
          return { success: false, error: 'Käyttäjän luominen epäonnistui' };
        }
      }

      // Save authenticated user
      const authUser: AuthUser = {
        username: normalizedUsername,
        isAuthenticated: true,
        loginTime: Date.now(),
      };

      await AsyncStorage.setItem(this.AUTH_KEY, JSON.stringify(authUser));
      console.log('User authentication saved');
      
      // Add to recent users
      await this.addToRecentUsers(normalizedUsername);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Kirjautuminen epäonnistui';
      return { success: false, error: errorMessage };
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      console.log('Logging out user');
      await AsyncStorage.removeItem(this.AUTH_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.isAuthenticated || false;
  }

  // Get recent usernames for quick login
  static async getRecentUsers(): Promise<string[]> {
    try {
      const recentData = await AsyncStorage.getItem(this.RECENT_USERS_KEY);
      const recentUsers = recentData ? JSON.parse(recentData) : [];
      console.log('Recent users loaded:', recentUsers);
      return recentUsers;
    } catch (error) {
      console.error('Error getting recent users:', error);
      return [];
    }
  }

  // Add username to recent users list
  private static async addToRecentUsers(username: string): Promise<void> {
    try {
      const recent = await this.getRecentUsers();
      
      // Remove if already exists
      const filtered = recent.filter(u => u !== username);
      
      // Add to beginning
      const updated = [username, ...filtered].slice(0, this.MAX_RECENT_USERS);
      
      await AsyncStorage.setItem(this.RECENT_USERS_KEY, JSON.stringify(updated));
      console.log('Recent users updated:', updated);
    } catch (error) {
      console.error('Error adding to recent users:', error);
    }
  }

  // Clear recent users
  static async clearRecentUsers(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.RECENT_USERS_KEY);
      console.log('Recent users cleared');
    } catch (error) {
      console.error('Error clearing recent users:', error);
    }
  }

  // Switch user (logout current, login new)
  static async switchUser(username: string): Promise<{ success: boolean; error?: string }> {
    console.log('Switching to user:', username);
    await this.logout();
    return this.login(username);
  }
}