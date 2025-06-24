// src/hooks/useUser.ts
import { useState, useEffect } from 'react';
import { User } from '../types/types';
import apiService from '../services/apiService';

export const useUser = (username: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!username) return;
    
    try {
      setLoading(true);
      setError(null);
      const userData = await apiService.getUser(username, 1, 1000);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [username]);

  return { user, loading, error, refetch: fetchUser };
};