// hooks/useWeeklyGoal.ts - DYNAMIC WEEKLY GOALS, 1-DECIMAL
import { useState, useEffect, useMemo } from 'react';
import { User } from '@/app/types/types';
import { challengeParams } from '@/app/constants/challengeParams';

const DEFAULT_COMPETITORS = 10;
const r1 = (n: number) => Number(n.toFixed(1));

interface WeeklyGoalData {
  // Current week data
  weeklyGoal: number;
  weeklyProgress: number;
  weeklyGoalPerUser: number;
  remainingDistance: number;
  progressPercentage: number;

  // Dynamic recalculation data
  goalAdjustment: number;
  adjustmentReason: 'ahead' | 'behind' | 'on-track';

  // Week boundaries
  currentWeekKey: string;
  daysRemaining: number;
  weekStart: Date;
  weekEnd: Date;

  // Historical tracking - ENHANCED
  previousWeekGoal: number | null;
  weeklyHistory: WeekHistory[];
  allWeeksData: WeekData[]; // Complete data for all weeks
  performanceTrend: 'improving' | 'declining' | 'stable';
  hasHistory: boolean;
}

interface WeekHistory {
  weekKey: string;
  goalSet: number;
  achieved: number;
  achievementRate: number;
  cumulativeProgress: number;
  weekStart: Date;
  weekEnd: Date;
}

interface WeekData {
  weekKey: string;
  weekNumber: number;
  weekStart: Date;
  weekEnd: Date;
  goalSet: number;            // Goal computed at the START of this week (1dp)
  achieved: number;           // What was done in this week (1dp)
  achievementRate: number;    // achieved / goalSet
  cumulativeProgress: number; // total km up to END of this week (1dp)
  isCurrent: boolean;
  isCompleted: boolean;
  daysInWeek: number; // How many days of this week have passed
}

export const useWeeklyGoal = (users: User[]): WeeklyGoalData => {
  // Only need setter (legacy storage load)
  const [, setWeeklyHistory] = useState<WeekHistory[]>([]);

  // Helper: week boundaries (Mon–Sun)
  const getWeekBoundaries = (date: Date) => {
    const dayOfWeek = date.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekYear = weekStart.getFullYear();
    const weekNum = Math.ceil(
      (weekStart.getTime() - new Date(weekYear, 0, 1).getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    );
    const weekKey = `${weekYear}-W${weekNum}`;

    return { weekStart, weekEnd, weekKey };
  };

  // Current week boundaries
  const currentWeekBoundaries = useMemo(() => {
    const today = new Date();
    const boundaries = getWeekBoundaries(today);
    const dayOfWeek = today.getDay();
    const daysRemaining = Math.max(1, 7 - (dayOfWeek === 0 ? 7 : dayOfWeek));

    return {
      ...boundaries,
      currentWeekKey: boundaries.weekKey,
      daysRemaining,
      today
    };
  }, []);

  // All weeks from start → end (inclusive)
  const allWeeksInChallenge = useMemo(() => {
    const challengeStart = new Date(challengeParams.startDate);
    const challengeEnd = new Date(challengeParams.endDate);
    const today = new Date();
    const weeks: WeekData[] = [];

    const currentWeekStart = new Date(challengeStart);
    const dayOfWeek = challengeStart.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentWeekStart.setDate(challengeStart.getDate() + mondayOffset);
    currentWeekStart.setHours(0, 0, 0, 0);

    let weekNumber = 1;

    while (currentWeekStart <= challengeEnd) {
      const wb = getWeekBoundaries(currentWeekStart);
      const isCurrent = wb.weekKey === currentWeekBoundaries.currentWeekKey;
      const isCompleted = wb.weekEnd < today;

      let daysInWeek = 7;
      if (isCurrent) {
        const dow = today.getDay();
        daysInWeek = dow === 0 ? 7 : dow;
      }

      weeks.push({
        ...wb,
        weekNumber,
        goalSet: 0,
        achieved: 0,
        achievementRate: 0,
        cumulativeProgress: 0,
        isCurrent,
        isCompleted,
        daysInWeek
      });

      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      weekNumber++;
    }

    return weeks;
  }, [currentWeekBoundaries.currentWeekKey]);

  // Fill each week's data with dynamic goals computed at the START of the week (1dp)
  const allWeeksData = useMemo(() => {
    const sourceUsers = users ?? [];
    let cumulativeBeforeThisWeek = 0; // progress up to the START of the current loop week

    return allWeeksInChallenge.map((week, index) => {
      const weeksRemaining = allWeeksInChallenge.length - index; // including this week
      const remainingBeforeWeek = Math.max(
        0,
        challengeParams.totalDistance - cumulativeBeforeThisWeek
      );

      // Equal split of remaining distance across remaining weeks (rounded to 1dp)
      const goalSet = r1(remainingBeforeWeek / Math.max(1, weeksRemaining));

      // Achieved this week (from activities, 1dp)
      const weeklyKm = sourceUsers.reduce((totalWeekKm, user) => {
        const weekActivities = user.activities.filter((activity) => {
          const activityDate = new Date(activity.date);
          return activityDate >= week.weekStart && activityDate <= week.weekEnd;
        });
        return (
          totalWeekKm +
          weekActivities.reduce((sum, activity) => sum + activity.kilometers, 0)
        );
      }, 0);

      const achieved = r1(weeklyKm);
      const achievementRate = goalSet > 0 ? achieved / goalSet : 0;

      // Update cumulative AFTER this week for next iteration (1dp)
      const cumulativeProgress = r1(cumulativeBeforeThisWeek + achieved);
      cumulativeBeforeThisWeek += achieved;

      return {
        ...week,
        goalSet,
        achieved,
        achievementRate,
        cumulativeProgress
      };
    });
  }, [allWeeksInChallenge, users]);

  // Current week specific data (with fallback competitor count and 1dp rounding)
  const currentWeekData = useMemo(() => {
    const currentWeek = allWeeksData.find((w) => w.isCurrent);
    if (!currentWeek) {
      return {
        weeklyGoal: 0,
        weeklyProgress: 0,
        weeklyGoalPerUser: 0,
        remainingDistance: 0,
        progressPercentage: 0,
        goalAdjustment: 0,
        adjustmentReason: 'on-track' as const,
        previousGoal: null
      };
    }

    const competitorCount = Math.max(users.length, DEFAULT_COMPETITORS);
    const weeklyGoalPerUser = r1(currentWeek.goalSet / competitorCount);

    const remainingDistance = r1(Math.max(0, currentWeek.goalSet - currentWeek.achieved));
    const progressPercentage = r1(
      currentWeek.goalSet > 0 ? (currentWeek.achieved / currentWeek.goalSet) * 100 : 0
    );

    // Previous week comparison
    const previousWeek = allWeeksData.find(
      (w) => w.weekNumber === currentWeek.weekNumber - 1
    );
    const previousGoal = previousWeek ? previousWeek.goalSet : null;
    const goalAdjustment = previousGoal ? r1(currentWeek.goalSet - previousGoal) : 0;
    const adjustmentReason: 'ahead' | 'behind' | 'on-track' =
      (goalAdjustment ?? 0) > 5 ? 'behind' : (goalAdjustment ?? 0) < -5 ? 'ahead' : 'on-track';

    return {
      weeklyGoal: currentWeek.goalSet,
      weeklyProgress: currentWeek.achieved,
      weeklyGoalPerUser,
      remainingDistance,
      progressPercentage,
      goalAdjustment,
      adjustmentReason,
      previousGoal
    };
  }, [allWeeksData, users.length]);

  // Historical (completed weeks only)
  const historicalWeeks = useMemo(() => {
    return allWeeksData
      .filter((w) => w.isCompleted)
      .map((w) => ({
        weekKey: w.weekKey,
        goalSet: w.goalSet,
        achieved: w.achieved,
        achievementRate: w.achievementRate,
        cumulativeProgress: w.cumulativeProgress,
        weekStart: w.weekStart,
        weekEnd: w.weekEnd
      }));
  }, [allWeeksData]);

  // Trend: compare last two completed weeks
  const performanceTrend = useMemo((): 'improving' | 'declining' | 'stable' => {
    const completed = allWeeksData.filter((w) => w.isCompleted);
    if (completed.length < 2) return 'stable';
    const recent = completed.slice(-2);
    const delta = recent[1].achievementRate - recent[0].achievementRate;
    if (delta > 0.1) return 'improving';
    if (delta < -0.1) return 'declining';
    return 'stable';
  }, [allWeeksData]);

  // Legacy load (optional)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`weekly-history-${challengeParams.startDate}`);
      if (stored) {
        const history = JSON.parse(stored).map((w: WeekHistory) => ({
          ...w,
          weekStart: new Date(w.weekStart),
          weekEnd: new Date(w.weekEnd)
        }));
        setWeeklyHistory(history);
      }
    } catch (error) {
      console.error('Failed to load weekly history:', error);
    }
  }, []);

  // Return
  return useMemo(() => {
    const { previousGoal, ...currentNoPrev } = currentWeekData;

    return {
      ...currentNoPrev,
      previousWeekGoal: previousGoal ?? null,
      currentWeekKey: currentWeekBoundaries.currentWeekKey,
      daysRemaining: currentWeekBoundaries.daysRemaining,
      weekStart: currentWeekBoundaries.weekStart,
      weekEnd: currentWeekBoundaries.weekEnd,
      weeklyHistory: historicalWeeks,
      allWeeksData,
      performanceTrend,
      hasHistory: historicalWeeks.length > 0
    };
  }, [
    currentWeekData,
    currentWeekBoundaries,
    historicalWeeks,
    allWeeksData,
    performanceTrend
  ]);
};
