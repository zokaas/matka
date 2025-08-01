// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  currentUser: string | null;
  login: (username: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored login
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const login = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      isLoggedIn: !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};