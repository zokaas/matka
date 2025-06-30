// src/contexts/AuthContext.tsx - Authentication context
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, AuthUser } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchUser: (username: string) => Promise<{ success: boolean; error?: string }>;
  recentUsers: string[];
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<string[]>([]);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      const [currentUser, recent] = await Promise.all([
        AuthService.getCurrentUser(),
        AuthService.getRecentUsers(),
      ]);
      
      setUser(currentUser);
      setRecentUsers(recent);
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string) => {
    const result = await AuthService.login(username);
    
    if (result.success) {
      const [newUser, recent] = await Promise.all([
        AuthService.getCurrentUser(),
        AuthService.getRecentUsers(),
      ]);
      
      setUser(newUser);
      setRecentUsers(recent);
    }
    
    return result;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const switchUser = async (username: string) => {
    const result = await AuthService.switchUser(username);
    
    if (result.success) {
      const [newUser, recent] = await Promise.all([
        AuthService.getCurrentUser(),
        AuthService.getRecentUsers(),
      ]);
      
      setUser(newUser);
      setRecentUsers(recent);
    }
    
    return result;
  };

  const refreshAuth = async () => {
    await initializeAuth();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user?.isAuthenticated || false,
    login,
    logout,
    switchUser,
    recentUsers,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};