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
      behindAmount: 0,
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
    if (!users || users.length === 0) return;

    try {
      // Make sure PaceCalculator exists and has the necessary methods
      if (!PaceCalculator || typeof PaceCalculator.calculatePaceMetrics !== 'function') {
        console.error("PaceCalculator is not properly defined");
        return;
      }

      const paceMetrics = PaceCalculator.calculatePaceMetrics(users);

      // Safely extract values with fallbacks
      const actualWeekly = (paceMetrics?.weeklyPace?.weeklyRate || 0);
      const requiredWeekly = (paceMetrics?.requiredPace?.weeklyRate || 0);
      const behindAmount = Math.max(0, Math.round(requiredWeekly - actualWeekly));

      setEnhancedPaces({
        totalProgress: paceMetrics?.totalProgress || 0,
        remainingDistance: paceMetrics?.remainingDistance || 0,
        daysRemaining: paceMetrics?.daysRemaining || 0,
        dailyPerUser: (paceMetrics?.requiredPace?.dailyRate || 0) / Math.max(1, users.length),
        weeklyPerUser: paceMetrics?.recentPace?.weeklyPerUser || 0,
        historicalPace: paceMetrics?.historicalPace?.weeklyPerUser || 0,
        recentPace: paceMetrics?.recentPace?.weeklyPerUser || 0,
        weeklyPace: paceMetrics?.weeklyPace?.weeklyPerUser || 0,
        requiredPace: paceMetrics?.requiredPace?.weeklyPerUser || 0,
        projectedEndDate: paceMetrics?.projectedEndDate || null,
        progressStatus: paceMetrics?.progressStatus || 'on track',
        behindAmount,
        projections: {
          historical: {
            estimatedEndDate: paceMetrics?.projectedEndDate
              ? format(paceMetrics.projectedEndDate, 'yyyy-MM-dd')
              : null,
            daysFromTarget: paceMetrics?.projectedEndDate && PaceCalculator.CHALLENGE_END_DATE
              ? Math.ceil(
                  (paceMetrics.projectedEndDate.getTime() - PaceCalculator.CHALLENGE_END_DATE.getTime()) /
                  (1000 * 60 * 60 * 24)
                )
              : null
          },
          recent: {
            estimatedEndDate: paceMetrics?.projectedEndDate
              ? format(paceMetrics.projectedEndDate, 'yyyy-MM-dd')
              : null,
            daysFromTarget: paceMetrics?.projectedEndDate && PaceCalculator.CHALLENGE_END_DATE
              ? Math.ceil(
                  (paceMetrics.projectedEndDate.getTime() - PaceCalculator.CHALLENGE_END_DATE.getTime()) /
                  (1000 * 60 * 60 * 24)
                )
              : null
          },
          weekly: {
            estimatedEndDate: paceMetrics?.projectedEndDate
              ? format(paceMetrics.projectedEndDate, 'yyyy-MM-dd')
              : null,
            daysFromTarget: paceMetrics?.projectedEndDate && PaceCalculator.CHALLENGE_END_DATE
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