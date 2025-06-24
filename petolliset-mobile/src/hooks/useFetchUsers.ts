// src/hooks/useFetchUsers.ts
import { useState, useEffect } from 'react';
import { User } from '../types/types';
import apiService from '../services/apiService';

export const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalKm, setTotalKm] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersData, totalData] = await Promise.all([
        apiService.getAllUsers(),
        apiService.getTotalKilometers()
      ]);
      
      setUsers(usersData);
      setTotalKm(totalData.totalKm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, totalKm, loading, error, refetch: fetchUsers };
};
