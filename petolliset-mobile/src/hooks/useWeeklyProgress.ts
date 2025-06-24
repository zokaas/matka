// src/hooks/useWeeklyProgress.ts
import { useState, useEffect, useMemo } from 'react';
import { User, WeeklyInsight } from '../types/types';

const CHALLENGE_START_DATE = new Date('2025-01-06');
const CHALLENGE_END_DATE = new Date('2025-06-22');
const TOTAL_CHALLENGE_DISTANCE = 100000;

export const useWeeklyProgress = (users: User[]) => {
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsight[]>([]);

  const weeklyStats = useMemo(() => {
    if (!users || users.length === 0) return null;

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
    const weekNum = Math.ceil((weekStart.getTime() - new Date(weekYear, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const currentWeekKey = `${weekYear}-W${weekNum}`;

    const totalProgress = users.reduce((sum, user) => sum + user.totalKm, 0);
    const remainingChallengeDistance = Math.max(0, TOTAL_CHALLENGE_DISTANCE - totalProgress);
    const daysUntilEnd = Math.max(1, Math.ceil((CHALLENGE_END_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const weeksRemaining = Math.ceil(daysUntilEnd / 7);
    const weeklyGoal = Math.ceil(remainingChallengeDistance / weeksRemaining);
    const individualGoal = Math.round(weeklyGoal / users.length);

    const daysRemaining = 7 - (dayOfWeek === 0 ? 7 : dayOfWeek);

    return {
      weekStart,
      weekEnd,
      weeklyGoal,
      individualGoal,
      daysRemaining,
      currentWeekKey
    };
  }, [users]);

  useEffect(() => {
    if (!weeklyStats || !users.length) return;

    const insights = users.map((user) => {
      const weekActivities = user.activities.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= weeklyStats.weekStart && activityDate <= weeklyStats.weekEnd;
      });

      const weeklyProgress = weekActivities.reduce(
        (sum, activity) => sum + activity.kilometers,
        0
      );

      const weeklyPercentage = Math.min(
        200,
        weeklyStats.individualGoal > 0 ? Math.round((weeklyProgress / weeklyStats.individualGoal) * 100) : 0
      );

      const remainingKm = Math.max(0, weeklyStats.individualGoal - weeklyProgress);
      const dailyTarget = weeklyStats.daysRemaining > 0 ? Math.round(remainingKm / weeklyStats.daysRemaining) : 0;

      return {
        username: user.username,
        weeklyGoal: weeklyStats.individualGoal,
        weeklyProgress: Math.round(weeklyProgress),
        weeklyPercentage,
        dailyTarget,
        dailyProgress: 0, // Can be calculated if needed
        dailyPercentage: 0,
        rank: 0
      };
    });

    const sortedInsights = insights
      .sort((a, b) => b.weeklyProgress - a.weeklyProgress)
      .map((insight, index) => ({
        ...insight,
        rank: index + 1,
      }));

    setWeeklyInsights(sortedInsights);
  }, [users, weeklyStats]);

  return { weeklyInsights, weeklyStats };
};