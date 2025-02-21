import { useMemo } from "react";
import { User, TargetPaces } from "../types/types";

export function useCalculateStats(users: User[]) {
  return useMemo(() => {
    const today = new Date();
    const startDate = new Date("2025-01-06");
    const endDate = new Date("2025-05-31");

    const daysRemaining = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    const currentTotal = users.reduce((sum, user) => sum + user.totalKm, 0);
    const remainingDistance = 100000 - currentTotal;
    const activeMemberCount = Math.max(1, users.length);

    const requiredPerUser = remainingDistance / activeMemberCount;
    const weeklyPerUser =
      daysRemaining > 7
        ? requiredPerUser / (daysRemaining / 7)
        : requiredPerUser;

    return {
      totalProgress: currentTotal,
      remainingDistance,
      daysRemaining,
      dailyPerUser: requiredPerUser / daysRemaining,
      weeklyPerUser,
      projectedEndDate: new Date(
        today.getTime() +
          (remainingDistance /
            (currentTotal / (today.getTime() - startDate.getTime()))) *
            24 *
            60 *
            60 *
            1000
      ),
    } as TargetPaces;
  }, [users]);
}
