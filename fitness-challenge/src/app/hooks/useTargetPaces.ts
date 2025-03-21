import { useState, useEffect } from "react";
import { User } from "@/app/types/types";
import { format } from "date-fns";
import { PaceCalculator } from "../utils/PaceCalculator";

export const useEnhancedTargetPaces = (users: User[]) => {
  const [enhancedPaces, setEnhancedPaces] = useState(() => {
    return {
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
      behindAmount: 0, // <-- Added here

      projections: {
        historical: {
          estimatedEndDate: null as string | null,
          daysFromTarget: null as number | null,
        },
        recent: {
          estimatedEndDate: null as string | null,
          daysFromTarget: null as number | null,
        },
        weekly: {
          estimatedEndDate: null as string | null,
          daysFromTarget: null as number | null,
        }
      }
    };
  });

  useEffect(() => {
    if (users.length === 0) return;

    try {
      const paceMetrics = PaceCalculator.calculatePaceMetrics(users);

      const actualWeekly = paceMetrics.weeklyPace.weeklyRate;
      const requiredWeekly = paceMetrics.requiredPace.weeklyRate;
      const behindAmount = Math.max(0, Math.round(requiredWeekly - actualWeekly));

      setEnhancedPaces({
        totalProgress: paceMetrics.totalProgress,
        remainingDistance: paceMetrics.remainingDistance,
        daysRemaining: paceMetrics.daysRemaining,
        dailyPerUser: paceMetrics.requiredPace.dailyRate / users.length,
        weeklyPerUser: paceMetrics.recentPace.weeklyPerUser, // Using recent as default
        historicalPace: paceMetrics.historicalPace.weeklyPerUser,
        recentPace: paceMetrics.recentPace.weeklyPerUser,
        weeklyPace: paceMetrics.weeklyPace.weeklyPerUser,
        requiredPace: paceMetrics.requiredPace.weeklyPerUser,
        projectedEndDate: paceMetrics.projectedEndDate,
        progressStatus: paceMetrics.progressStatus,
        behindAmount, // <-- Added here
        projections: {
          historical: {
            estimatedEndDate: paceMetrics.projectedEndDate
              ? format(paceMetrics.projectedEndDate, 'yyyy-MM-dd')
              : null,
            daysFromTarget: paceMetrics.projectedEndDate
              ? Math.ceil(
                  (paceMetrics.projectedEndDate.getTime() - PaceCalculator.CHALLENGE_END_DATE.getTime()) /
                  (1000 * 60 * 60 * 24)
                )
              : null
          },
          recent: {
            estimatedEndDate: paceMetrics.projectedEndDate
              ? format(paceMetrics.projectedEndDate, 'yyyy-MM-dd')
              : null,
            daysFromTarget: paceMetrics.projectedEndDate
              ? Math.ceil(
                  (paceMetrics.projectedEndDate.getTime() - PaceCalculator.CHALLENGE_END_DATE.getTime()) /
                  (1000 * 60 * 60 * 24)
                )
              : null
          },
          weekly: {
            estimatedEndDate: paceMetrics.projectedEndDate
              ? format(paceMetrics.projectedEndDate, 'yyyy-MM-dd')
              : null,
            daysFromTarget: paceMetrics.projectedEndDate
              ? Math.ceil(
                  (paceMetrics.projectedEndDate.getTime() - PaceCalculator.CHALLENGE_END_DATE.getTime()) /
                  (1000 * 60 * 60 * 24)
                )
              : null
          }
        }
      });
    } catch (error) {
      console.error('Error calculating pace metrics:', error);
    }
  }, [users]);

  return enhancedPaces;
};
