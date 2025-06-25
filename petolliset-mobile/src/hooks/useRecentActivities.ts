// src/hooks/useRecentActivities.ts
import { useState, useEffect } from 'react';
import { Activity } from '../types/types';
import apiService from '../services/apiService';

export const useRecentActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.activity.getRecentActivities(20);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  return { activities, loading, error, refetch: fetchRecentActivities };
};