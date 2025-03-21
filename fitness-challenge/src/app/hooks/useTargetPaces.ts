import { useState, useEffect } from "react";
import { User, TargetPaces } from "@/app/types/types";

export interface EnhancedTargetPaces extends TargetPaces {
  historicalPace: number;
  recentPace: number;
  weeklyPace: number;
  requiredPace: number;
  projections: {
    historical: {
      estimatedEndDate: Date | null;
      daysFromTarget: number | null;
    };
    recent: {
      estimatedEndDate: Date | null;
      daysFromTarget: number | null;
    };
    weekly: {
      estimatedEndDate: Date | null;
      daysFromTarget: number | null;
    };
  };
}

export const useEnhancedTargetPaces = (users: User[]): EnhancedTargetPaces => {
  const [enhancedPaces, setEnhancedPaces] = useState<EnhancedTargetPaces>({
    totalProgress: 0,
    remainingDistance: 0,
    daysRemaining: 0,
    dailyPerUser: 0,
    weeklyPerUser: 0,
    historicalPace: 0,
    recentPace: 0,
    weeklyPace: 0,
    requiredPace: 0,
    projectedEndDate: null,
    projections: {
      historical: { estimatedEndDate: null, daysFromTarget: null },
      recent: { estimatedEndDate: null, daysFromTarget: null },
      weekly: { estimatedEndDate: null, daysFromTarget: null }
    }
  });

  useEffect(() => {
    if (users.length === 0) return;

    const today = new Date();
    const startDate = new Date("2025-01-06");
    const endDate = new Date("2025-06-22");
    const RECENT_PERIOD_DAYS = 28; // 4 viikkoa
    const WEEKLY_PERIOD_DAYS = 7; // 1 viikko

    // Aikalaskennat
    const daysRemaining = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysFromStart = Math.ceil(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Etäisyyslaskennat
    const currentTotal = users.reduce((sum, user) => sum + user.totalKm, 0);
    const remainingDistance = 100000 - currentTotal;
    const activeMemberCount = Math.max(1, users.length);

    // ========== ERILAISET VAUHDIT ==========
    
    // 1. HISTORICAL PACE - koko historian keskiarvo
    const historicalDailyRate = daysFromStart > 0 ? currentTotal / daysFromStart : 0;
    const historicalWeeklyRate = historicalDailyRate * 7;
    const historicalWeeklyPerUser = historicalWeeklyRate / activeMemberCount;

    // 2. RECENT PACE - viimeisen 28 päivän keskiarvo
    const recentStartDate = new Date(today);
    recentStartDate.setDate(today.getDate() - RECENT_PERIOD_DAYS);
    
    // Suodata viimeaikaiset aktiviteetit
    const recentActivities = users.flatMap(user => 
      user.activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= recentStartDate && activityDate <= today;
      })
    );
    
    const recentTotalKm = recentActivities.reduce((sum, activity) => sum + activity.kilometers, 0);
    const recentDailyRate = recentTotalKm / Math.min(daysFromStart, RECENT_PERIOD_DAYS);
    const recentWeeklyRate = recentDailyRate * 7;
    const recentWeeklyPerUser = recentWeeklyRate / activeMemberCount;

    // 3. WEEKLY PACE - viimeisen 7 päivän keskiarvo
    const weeklyStartDate = new Date(today);
    weeklyStartDate.setDate(today.getDate() - WEEKLY_PERIOD_DAYS);
    
    const weeklyActivities = users.flatMap(user => 
      user.activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= weeklyStartDate && activityDate <= today;
      })
    );
    
    const weeklyTotalKm = weeklyActivities.reduce((sum, activity) => sum + activity.kilometers, 0);
    const weeklyDailyRate = weeklyTotalKm / Math.min(daysFromStart, WEEKLY_PERIOD_DAYS);
    const weeklyWeeklyRate = weeklyDailyRate * 7;
    const weeklyWeeklyPerUser = weeklyWeeklyRate / activeMemberCount;

    // 4. REQUIRED PACE - vaadittu vauhti maaliin pääsemiseksi
    const requiredDailyRate = daysRemaining > 0 ? remainingDistance / daysRemaining : 0;
    const requiredWeeklyRate = requiredDailyRate * 7;
    const requiredWeeklyPerUser = requiredWeeklyRate / activeMemberCount;

    // ========== PROJECTED END DATES ==========
    
    // Laskentafunktio
    const calculateEndDate = (dailyRate: number): Date | null => {
      if (dailyRate <= 0) return null;
      
      const daysNeeded = remainingDistance / dailyRate;
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + Math.ceil(daysNeeded));
      return endDate;
    };
    
    // Jokaisen tahdin perusteella laskettu päättymispäivä
    const historicalEndDate = calculateEndDate(historicalDailyRate);
    const recentEndDate = calculateEndDate(recentDailyRate);
    const weeklyEndDate = calculateEndDate(weeklyDailyRate);
    
    // Erotus päivissä tavoitepäivästä
    const calculateDaysFromTarget = (date: Date | null): number | null => {
      if (!date) return null;
      return Math.ceil((date.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
    };
    
    const historicalDaysFromTarget = calculateDaysFromTarget(historicalEndDate);
    const recentDaysFromTarget = calculateDaysFromTarget(recentEndDate);
    const weeklyDaysFromTarget = calculateDaysFromTarget(weeklyEndDate);

    // Lasketaan kuinka paljon ollaan "jäljessä" tai "edellä" tavoitetta
    const expectedProgressAtThisPoint = (100000 * daysFromStart) / totalDays;
    const behindAmount = currentTotal < expectedProgressAtThisPoint 
      ? expectedProgressAtThisPoint - currentTotal 
      : undefined;

    // =========================================

    setEnhancedPaces({
      totalProgress: currentTotal,
      remainingDistance,
      daysRemaining,
      dailyPerUser: requiredDailyRate / activeMemberCount,
      weeklyPerUser: recentWeeklyPerUser, // Käytetään tähän viimeaikaista tahtia defaultina
      historicalPace: historicalWeeklyPerUser,
      recentPace: recentWeeklyPerUser,
      weeklyPace: weeklyWeeklyPerUser,
      requiredPace: requiredWeeklyPerUser,
      projectedEndDate: recentEndDate, // Käytetään tähän viimeaikaista arvioita defaultina
      behindAmount,
      projections: {
        historical: { 
          estimatedEndDate: historicalEndDate, 
          daysFromTarget: historicalDaysFromTarget 
        },
        recent: { 
          estimatedEndDate: recentEndDate, 
          daysFromTarget: recentDaysFromTarget 
        },
        weekly: { 
          estimatedEndDate: weeklyEndDate, 
          daysFromTarget: weeklyDaysFromTarget 
        }
      }
    });
  }, [users]);

  return enhancedPaces;
}