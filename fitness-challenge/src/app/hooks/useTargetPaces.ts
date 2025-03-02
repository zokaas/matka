import { useState, useEffect } from "react";
import { User, TargetPaces } from "@/app/types/types";

export const useTargetPaces = (users: User[]) => {
  const [targetPaces, setTargetPaces] = useState<TargetPaces>({
    totalProgress: 0,
    remainingDistance: 0,
    daysRemaining: 0,
    dailyPerUser: 0,
    weeklyPerUser: 0,
    projectedEndDate: null,
  });

  useEffect(() => {
    if (users.length === 0) return;

    const today = new Date();
    const startDate = new Date("2025-01-06");
    const endDate = new Date("2025-06-22");

    const daysRemaining = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const currentTotal = users.reduce((sum, user) => sum + user.totalKm, 0);
    const remainingDistance = 100000 - currentTotal;
    const activeMemberCount = Math.max(1, users.length);

    const requiredPerUser = remainingDistance / activeMemberCount;
    const weeksRemaining = Math.ceil(daysRemaining / 7);
    const weeklyPerUser =
      weeksRemaining > 0 ? Math.max(1, requiredPerUser / weeksRemaining) : 1;

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

    setTargetPaces({
      totalProgress: currentTotal,
      remainingDistance,
      daysRemaining,
      dailyPerUser: requiredPerUser / daysRemaining,
      weeklyPerUser,
      projectedEndDate,
    });
  }, [users]);

  return targetPaces;
};
