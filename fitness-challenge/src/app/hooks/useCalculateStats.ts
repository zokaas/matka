import { useMemo } from "react";
import { User, TargetPaces } from "../types/types";
import { challengeParams } from "../constants/challengeParams";

export function useCalculateStats(users: User[]) {
  return useMemo(() => {
    const today = new Date();
    const startDate = new Date(challengeParams.startDate);
    const endDate = new Date(challengeParams.endDate);

    const daysRemaining = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const currentTotal = users.reduce((sum, user) => sum + user.totalKm, 0);
    const remainingDistance = challengeParams.totalDistance - currentTotal;
    const activeMemberCount = Math.max(1, users.length);

    const requiredPerUser = remainingDistance / activeMemberCount;
    const weeklyPerUser =
      daysRemaining > 7
        ? requiredPerUser / (daysRemaining / 7)
        : requiredPerUser;

    const daysFromStart = Math.ceil(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const currentDailyRate = currentTotal / Math.max(1, daysFromStart);

    const daysNeededAtCurrentPace =
      currentDailyRate > 0 ? remainingDistance / currentDailyRate : null;

    const projectedEndDate =
      daysNeededAtCurrentPace !== null
        ? new Date(
            today.getTime() + daysNeededAtCurrentPace * 24 * 60 * 60 * 1000
          )
        : null;

    return {
      totalProgress: currentTotal,
      remainingDistance,
      daysRemaining,
      dailyPerUser: requiredPerUser / daysRemaining,
      weeklyPerUser,
      projectedEndDate,
    } as TargetPaces;
  }, [users]);
}
