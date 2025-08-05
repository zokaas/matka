// hooks/useWeeklyGoal.ts - FIXED VERSION
import { useState, useEffect, useMemo, useCallback } from 'react';
import { User } from '@/app/types/types';
import { challengeParams } from '@/app/constants/challengeParams';

interface WeeklyGoalData {
  weeklyGoal: number;
  weeklyProgress: number;
  weeklyGoalPerUser: number;
  remainingDistance: number;
  progressPercentage: number;
  currentWeekKey: string;
  daysRemaining: number;
  weekStart: Date;
  weekEnd: Date;
}

export const useWeeklyGoal = (users: User[]): WeeklyGoalData => {
  const [cachedWeeklyGoal, setCachedWeeklyGoal] = useState<number | null>(null);

  // 🔧 STABLE week boundaries calculation - memoized with fewer dependencies
  const weekBoundaries = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekYear = weekStart.getFullYear();
    const weekNum = Math.ceil(
      (weekStart.getTime() - new Date(weekYear, 0, 1).getTime()) / 
      (7 * 24 * 60 * 60 * 1000)
    );
    const currentWeekKey = `${weekYear}-W${weekNum}`;
    const daysRemaining = Math.max(1, 7 - (dayOfWeek === 0 ? 7 : dayOfWeek));

    return {
      weekStart,
      weekEnd,
      currentWeekKey,
      daysRemaining,
      today
    };
  }, []); // 🔧 EMPTY DEPENDENCY ARRAY - only recalculate on mount

  // 🔧 STABLE total progress calculation
  const totalProgress = useMemo(() => {
    return users.reduce((sum, user) => sum + user.totalKm, 0);
  }, [users]);

  // 🔧 STABLE weekly goal calculation
  const weeklyGoal = useMemo(() => {
    if (!users || users.length === 0) return 0;

    // Try cache first
    if (cachedWeeklyGoal !== null) return cachedWeeklyGoal;

    // Try localStorage
    const storedGoal = localStorage.getItem(`weekly-goal-${weekBoundaries.currentWeekKey}`);
    if (storedGoal) {
      const parsed = parseInt(storedGoal, 10);
      setCachedWeeklyGoal(parsed);
      return parsed;
    }

    // Calculate dynamically
    const remainingChallengeDistance = Math.max(0, challengeParams.totalDistance - totalProgress);
    const daysUntilEnd = Math.max(1, Math.ceil(
      (new Date(challengeParams.endDate).getTime() - weekBoundaries.today.getTime()) / 
      (1000 * 60 * 60 * 24)
    ));
    const weeksRemaining = Math.ceil(daysUntilEnd / 7);
    
    const calculatedGoal = Math.ceil(remainingChallengeDistance / weeksRemaining);
    
    // Cache the result
    localStorage.setItem(`weekly-goal-${weekBoundaries.currentWeekKey}`, calculatedGoal.toString());
    setCachedWeeklyGoal(calculatedGoal);
    
    return calculatedGoal;
  }, [users.length, totalProgress, weekBoundaries, cachedWeeklyGoal]); // 🔧 STABLE DEPENDENCIES

  // 🔧 STABLE weekly progress calculation
  const weeklyProgress = useMemo(() => {
    if (!users || users.length === 0) return 0;

    return users.reduce((totalProgress, user) => {
      const weekActivities = user.activities.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= weekBoundaries.weekStart && activityDate <= weekBoundaries.weekEnd;
      });

      return totalProgress + weekActivities.reduce((sum, activity) => sum + activity.kilometers, 0);
    }, 0);
  }, [users, weekBoundaries.weekStart, weekBoundaries.weekEnd]); // 🔧 SPECIFIC DEPENDENCIES

  // 🔧 STABLE derived calculations
  const derivedData = useMemo(() => {
    const weeklyGoalPerUser = users.length > 0 ? Math.round(weeklyGoal / users.length) : 0;
    const remainingDistance = Math.max(0, weeklyGoal - weeklyProgress);
    const progressPercentage = weeklyGoal > 0 ? Math.min(100, (weeklyProgress / weeklyGoal) * 100) : 0;

    return {
      weeklyGoalPerUser,
      remainingDistance: Math.round(remainingDistance),
      progressPercentage: Math.round(progressPercentage),
    };
  }, [weeklyGoal, weeklyProgress, users.length]);

  // 🔧 STABLE cache reset effect
  useEffect(() => {
    const currentStoredKey = localStorage.getItem('current-week-key');
    if (currentStoredKey !== weekBoundaries.currentWeekKey) {
      setCachedWeeklyGoal(null);
      localStorage.setItem('current-week-key', weekBoundaries.currentWeekKey);
    }
  }, [weekBoundaries.currentWeekKey]);

  // 🔧 RETURN STABLE OBJECT
  return useMemo(() => ({
    weeklyGoal,
    weeklyProgress: Math.round(weeklyProgress),
    weeklyGoalPerUser: derivedData.weeklyGoalPerUser,
    remainingDistance: derivedData.remainingDistance,
    progressPercentage: derivedData.progressPercentage,
    currentWeekKey: weekBoundaries.currentWeekKey,
    daysRemaining: weekBoundaries.daysRemaining,
    weekStart: weekBoundaries.weekStart,
    weekEnd: weekBoundaries.weekEnd,
  }), [
    weeklyGoal,
    weeklyProgress,
    derivedData,
    weekBoundaries
  ]);
};