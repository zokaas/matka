// hooks/useEnhancedTargetPaces.ts
import { useState, useEffect } from "react";
import { User } from "@/app/types/types";
import { PaceCalculator } from "../utils/PaceCalculator";

export const useEnhancedTargetPaces = (users: User[]) => {
  const [enhancedPaces, setEnhancedPaces] = useState({
    totalProgress: 0,
    remainingDistance: 0,
    daysRemaining: 0,
    dailyPerUser: 0,
    weeklyPerUser: 0,
    historicalPace: 0,
    recentPace: 0,
    weeklyPace: 0,
    requiredPace: 0,
    projectedEndDate: null as Date | null,
    progressStatus: 'on track' as 'behind' | 'on track' | 'ahead',
    behindAmount: 0,
    expectedProgressToday: 0,
    projections: {
      historical: { estimatedEndDate: null as Date | null, daysFromTarget: null as number | null },
      recent: { estimatedEndDate: null as Date | null, daysFromTarget: null as number | null },
      weekly: { estimatedEndDate: null as Date | null, daysFromTarget: null as number | null }
    }
  });  

  useEffect(() => {
    if (!users || users.length === 0) return;

    try {
      const paceMetrics = PaceCalculator.calculatePaceMetrics(users);
      console.log("🔍 Calculating behindAmount:", {
        actualWeekly: paceMetrics.weeklyPace.weeklyRate,
        requiredWeekly: paceMetrics.requiredPace.weeklyRate,
        behindAmount: Math.max(0, Math.round(paceMetrics.requiredPace.weeklyRate - paceMetrics.weeklyPace.weeklyRate))
      });
      
      setEnhancedPaces({
        totalProgress: paceMetrics.totalProgress,
        remainingDistance: paceMetrics.remainingDistance,
        daysRemaining: paceMetrics.daysRemaining,
        dailyPerUser: paceMetrics.requiredPace.dailyRate / Math.max(1, users.length),
        weeklyPerUser: paceMetrics.recentPace.weeklyPerUser,
        historicalPace: paceMetrics.historicalPace.weeklyPerUser,
        recentPace: paceMetrics.recentPace.weeklyPerUser,
        weeklyPace: paceMetrics.weeklyPace.weeklyPerUser,
        requiredPace: paceMetrics.requiredPace.weeklyPerUser,
        projectedEndDate: paceMetrics.projectedEndDate,
        progressStatus: paceMetrics.progressStatus,
        behindAmount: paceMetrics.behindAmount,
        expectedProgressToday: paceMetrics.expectedProgressToday || 0,
        projections: {
          historical: {
            // Keep as Date object without formatting to string
            estimatedEndDate: paceMetrics.projections.historical.estimatedEndDate,
            daysFromTarget: paceMetrics.projections.historical.daysFromTarget
          },
          recent: {
            // Keep as Date object without formatting to string
            estimatedEndDate: paceMetrics.projections.recent.estimatedEndDate,
            daysFromTarget: paceMetrics.projections.recent.daysFromTarget
          },
          weekly: {
            // Keep as Date object without formatting to string
            estimatedEndDate: paceMetrics.projections.weekly.estimatedEndDate,
            daysFromTarget: paceMetrics.projections.weekly.daysFromTarget
          }
        }
      });      
    } catch (err) {
      console.error("Failed to calculate enhanced paces:", err);
    }
  }, [users]);

  return enhancedPaces;
};