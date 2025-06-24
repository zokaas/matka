
// src/hooks/useTargetPaces.ts - Target paces hook
import { useState, useEffect } from 'react';
import { User, TargetPaces } from '../types/types';
import { handleResponse, userAPI } from '../services/apiService';

const BACKEND_URL = 'https://matka-zogy.onrender.com'; // Same as web app

export const useTargetPaces = (users: User[]): TargetPaces | null => {
  const [targetPaces, setTargetPaces] = useState<TargetPaces | null>(null);

  useEffect(() => {
    if (!users || users.length === 0) {
      setTargetPaces(null);
      return;
    }

    const today = new Date();
    const startDate = new Date('2025-01-06');
    const endDate = new Date('2025-06-22');
    
    const totalProgress = users.reduce((sum, user) => sum + user.totalKm, 0);
    const remainingDistance = Math.max(0, 100000 - totalProgress);
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    const activeMemberCount = Math.max(1, users.length);
    const dailyPerUser = daysRemaining > 0 ? remainingDistance / (daysRemaining * activeMemberCount) : 0;
    const weeklyPerUser = dailyPerUser * 7;

    // Calculate projected end date
    const daysFromStart = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentDailyRate = totalProgress / Math.max(1, daysFromStart);
    const daysNeededAtCurrentPace = currentDailyRate > 0 ? remainingDistance / currentDailyRate : null;
    
    const projectedEndDate = daysNeededAtCurrentPace !== null
      ? new Date(today.getTime() + daysNeededAtCurrentPace * 24 * 60 * 60 * 1000)
      : null;

    setTargetPaces({
      totalProgress,
      remainingDistance,
      daysRemaining,
      dailyPerUser,
      weeklyPerUser,
      projectedEndDate,
    });
  }, [users]);

  return targetPaces;
};

// src/services/apiService.ts - Update to match web app API
export const activityAPI = {
  // ... existing methods ...

  getRecentActivities: async (limit: number = 20): Promise<any[]> => {
    try {
      const response = await fetch(`${BACKEND_URL}/activities/recent?limit=${limit}`);
      return handleResponse(response);
    } catch (error) {
      // Fallback to fetching from all users if new endpoint doesn't exist
      const users = await userAPI.getAllUsers();
      const allActivities: any[] = [];

      for (const user of users) {
        try {
          const userActivities = await userAPI.getUserActivities(user.username);
          userActivities.forEach(activity => {
            allActivities.push({
              ...activity,
              username: user.username,
              profilePicture: user.profilePicture,
            });
          });
        } catch (userError) {
          console.warn(`Failed to fetch activities for ${user.username}:`, userError);
        }
      }

      return allActivities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    }
  },
};