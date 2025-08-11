// hooks/useWeeklyGoal.ts - LOPULLISESTI KORJATTU VERSIO
import { useState, useEffect, useMemo } from 'react';
import { User } from '@/app/types/types';
import { challengeParams } from '@/app/constants/challengeParams';

interface WeeklyGoalData {
  // Current week data
  weeklyGoal: number;
  weeklyProgress: number;
  weeklyGoalPerUser: number;
  remainingDistance: number;
  progressPercentage: number;
  
  // Dynamic recalculation data
  goalAdjustment: number; // Change from previous week
  adjustmentReason: 'ahead' | 'behind' | 'on-track';
  
  // Week boundaries
  currentWeekKey: string;
  daysRemaining: number;
  weekStart: Date;
  weekEnd: Date;
  
  // Historical tracking
  previousWeekGoal: number | null;
  weeklyHistory: WeekHistory[];
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

export const useWeeklyGoal = (users: User[]): WeeklyGoalData => {
  const [weeklyHistory, setWeeklyHistory] = useState<WeekHistory[]>([]);

  // 🔧 STABLE week boundaries calculation
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
  }, []);

  // 🔧 KORJATTU: Total progress calculation (koko haasteen edistyminen)
  const totalProgress = useMemo(() => {
    return users.reduce((sum, user) => sum + user.totalKm, 0);
  }, [users]);

  // 🔧 KORJATTU: KULUVAN VIIKON edistyminen
  const weeklyProgress = useMemo(() => {
    if (!users || users.length === 0) return 0;

    // console.log('🔍 Calculating weekly progress for current week:', {
    //   weekStart: weekBoundaries.weekStart.toISOString(),
    //   weekEnd: weekBoundaries.weekEnd.toISOString(),
    //   usersCount: users.length
    // });

    const totalWeeklyKm = users.reduce((totalProgress, user) => {
      const weekActivities = user.activities.filter((activity) => {
        const activityDate = new Date(activity.date);
        
        // 🔧 KORJAUS: Tarkista että päivämäärä on validi
        if (isNaN(activityDate.getTime())) {
          console.warn('Invalid activity date:', activity.date);
          return false;
        }

        // 🔧 KORJAUS: Käytä getTime() vertailuun
        const isInWeek = activityDate.getTime() >= weekBoundaries.weekStart.getTime() && 
                        activityDate.getTime() <= weekBoundaries.weekEnd.getTime();
        
        if (isInWeek) {
          // console.log('✅ Activity in current week:', {
          //   user: user.username,
          //   activity: activity.activity,
          //   date: activity.date,
          //   kilometers: activity.kilometers,
          //   activityDate: activityDate.toISOString()
          // });
        }
        
        return isInWeek;
      });

      const userWeeklyKm = weekActivities.reduce((sum, activity) => sum + activity.kilometers, 0);
      
      console.log(`User ${user.username}: ${userWeeklyKm} km this week (${weekActivities.length} activities)`);
      
      return totalProgress + userWeeklyKm;
    }, 0);

    // console.log('📊 Total weekly progress:', weeklyProgress.toFixed(1));
    
    return totalWeeklyKm;
  }, [users, weekBoundaries.weekStart, weekBoundaries.weekEnd]);

  // 🔧 STABLE weekly goal calculation with deficit catching
  const dynamicWeeklyGoal = useMemo(() => {
    if (!users || users.length === 0) return {
      weeklyGoal: 0,
      goalAdjustment: 0,
      adjustmentReason: 'on-track' as const,
      previousGoal: null,
      hasHistory: false
    };

    // 🔧 PAKOTA dynaaminen laskenta
    // Calculate dynamically WITH DEFICIT CATCHING
    const remainingChallengeDistance = Math.max(0, challengeParams.totalDistance - totalProgress);
    const daysUntilEnd = Math.max(1, Math.ceil(
      (new Date(challengeParams.endDate).getTime() - weekBoundaries.today.getTime()) / 
      (1000 * 60 * 60 * 24)
    ));
    const weeksRemaining = Math.ceil(daysUntilEnd / 7);
    
    // 🔧 LISÄTTY: Laske odotus vs. todellisuus (deficit catching)
    const challengeStartDate = new Date(challengeParams.startDate);
    const daysSinceStart = Math.max(1, Math.ceil(
      (weekBoundaries.today.getTime() - challengeStartDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    ));
    const totalChallengeDays = challengeParams.totalDays;
    const expectedProgressByNow = (challengeParams.totalDistance * daysSinceStart) / totalChallengeDays;
    const deficit = Math.max(0, expectedProgressByNow - totalProgress);
    
    console.log('🧮 Dynamic goal calculation:', {
      remainingChallengeDistance: Math.round(remainingChallengeDistance),
      weeksRemaining,
      expectedProgressByNow: Math.round(expectedProgressByNow),
      actualProgress: Math.round(totalProgress),
      deficit: Math.round(deficit),
      daysSinceStart,
      totalChallengeDays
    });
    
    // Base weekly goal + deficit spread over remaining weeks
    const baseWeeklyGoal = remainingChallengeDistance / weeksRemaining;
    const deficitPerWeek = deficit / weeksRemaining;
    const calculatedGoal = Math.ceil(baseWeeklyGoal + deficitPerWeek);
    
    console.log('📈 Goal breakdown:', {
      baseWeeklyGoal: Math.round(baseWeeklyGoal),
      deficitPerWeek: Math.round(deficitPerWeek),
      finalGoal: calculatedGoal
    });
    
    // Cache the result (optional - poistettu testaamista varten)
    // localStorage.setItem(cacheKey, calculatedGoal.toString());
    
    const previousGoal = weeklyHistory.length > 0 ? weeklyHistory[weeklyHistory.length - 1].goalSet : null;
    const goalAdjustment = previousGoal ? calculatedGoal - previousGoal : 0;
    const adjustmentReason: 'ahead' | 'behind' | 'on-track' = 
      goalAdjustment > 5 ? 'behind' : goalAdjustment < -5 ? 'ahead' : 'on-track';
    
    return {
      weeklyGoal: calculatedGoal,
      goalAdjustment,
      adjustmentReason,
      previousGoal,
      hasHistory: weeklyHistory.length > 0
    };
  }, [users, totalProgress, weekBoundaries, weeklyHistory]); // 🔧 POISTETTU cachedWeeklyGoal dependenssi

  // 🔧 STABLE derived calculations
  const derivedData = useMemo(() => {
    const weeklyGoalPerUser = users.length > 0 ? Number((dynamicWeeklyGoal.weeklyGoal / users.length).toFixed(1)) : 0;
    const remainingDistance = Math.max(0, dynamicWeeklyGoal.weeklyGoal - weeklyProgress);
    const progressPercentage = dynamicWeeklyGoal.weeklyGoal > 0 ? Math.min(100, (weeklyProgress / dynamicWeeklyGoal.weeklyGoal) * 100) : 0;

    return {
      weeklyGoalPerUser,
      remainingDistance: Number(remainingDistance.toFixed(1)),
      progressPercentage: Number(progressPercentage.toFixed(1)),
    };
  }, [dynamicWeeklyGoal.weeklyGoal, weeklyProgress, users.length]);

  // Performance trend analysis (simplified)
  const performanceTrend = useMemo((): 'improving' | 'declining' | 'stable' => {
    if (weeklyHistory.length < 2) return 'stable';
    
    const recent = weeklyHistory.slice(-2);
    const improvement = recent[1].achievementRate - recent[0].achievementRate;
    
    if (improvement > 0.1) return 'improving';
    if (improvement < -0.1) return 'declining';
    return 'stable';
  }, [weeklyHistory]);

  // Load historical data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`weekly-history-${challengeParams.startDate}`);
      if (stored) {
        const history = JSON.parse(stored).map((week: WeekHistory) => ({
          ...week,
          weekStart: new Date(week.weekStart),
          weekEnd: new Date(week.weekEnd)
        }));
        setWeeklyHistory(history);
      }
    } catch (error) {
      console.error('Failed to load weekly history:', error);
    }
  }, []);

  // 🔧 RETURN STABLE OBJECT
  return useMemo(() => ({
    weeklyGoal: dynamicWeeklyGoal.weeklyGoal,
    weeklyProgress: Number(weeklyProgress.toFixed(1)), // 🔧 1 desimaali
    weeklyGoalPerUser: derivedData.weeklyGoalPerUser,
    remainingDistance: derivedData.remainingDistance,
    progressPercentage: derivedData.progressPercentage,
    goalAdjustment: dynamicWeeklyGoal.goalAdjustment,
    adjustmentReason: dynamicWeeklyGoal.adjustmentReason,
    currentWeekKey: weekBoundaries.currentWeekKey,
    daysRemaining: weekBoundaries.daysRemaining,
    weekStart: weekBoundaries.weekStart,
    weekEnd: weekBoundaries.weekEnd,
    previousWeekGoal: dynamicWeeklyGoal.previousGoal,
    weeklyHistory,
    performanceTrend,
    hasHistory: dynamicWeeklyGoal.hasHistory
  }), [
    dynamicWeeklyGoal,
    weeklyProgress,
    derivedData,
    weekBoundaries,
    weeklyHistory,
    performanceTrend
  ]);
};