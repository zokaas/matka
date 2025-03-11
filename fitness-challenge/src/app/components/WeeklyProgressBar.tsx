import React, { useState, useEffect } from "react";
import { useTargetPaces } from "@/app/hooks/useTargetPaces";
import { useFetchUsers } from "@/app/hooks/useFetchUsers";

const WeeklyProgressBar = () => {
  const { users, loading, error } = useFetchUsers();
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);

  // Get the target paces from the hook once users are loaded
  const targetPaces = useTargetPaces(users);

  useEffect(() => {
    if (users.length > 0 && targetPaces.weeklyPerUser > 0) {
      // Calculate the weekly goal based on the number of users and the weekly target per user
      const calculatedWeeklyGoal = Math.round(
        targetPaces.weeklyPerUser * users.length
      );
      setWeeklyGoal(calculatedWeeklyGoal);

      // Calculate current week's progress
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Determine the Monday of the current week
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + mondayOffset);
      weekStart.setHours(0, 0, 0, 0); // Start of Monday

      // Determine the Sunday of the current week
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999); // End of Sunday

      // Calculate days left in the week
      const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
      setDaysLeft(daysUntilSunday);

      // Calculate the total distance covered this week
      let currentWeekDistance = 0;
      users.forEach((user) => {
        const weekActivities = user.activities.filter((activity) => {
          const activityDate = new Date(activity.date);
          return activityDate >= weekStart && activityDate <= weekEnd;
        });

        const userWeeklyDistance = weekActivities.reduce(
          (sum, activity) => sum + activity.kilometers,
          0
        );

        currentWeekDistance += userWeeklyDistance;
      });

      setWeeklyProgress(Math.round(currentWeekDistance));
      setRemainingDistance(
        Math.max(0, calculatedWeeklyGoal - currentWeekDistance)
      );
    }
  }, [users, targetPaces]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-16">
        <div className="w-5 h-5 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 rounded text-red-500 text-center text-sm">
        Error loading data
      </div>
    );
  }

  const progressPercentage =
    weeklyGoal > 0 ? Math.min(100, (weeklyProgress / weeklyGoal) * 100) : 0;

  // Calculate daily target remaining if there are days left in the week
  const dailyTargetRemaining =
    daysLeft > 0 ? Math.round(remainingDistance / daysLeft) : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-medium text-gray-800">Viikon tavoite</h2>
        <div className="text-sm font-medium">
          <span className="text-purple-600">{weeklyProgress}</span>
          <span className="text-gray-500"> / {weeklyGoal} km</span>
          <span className="text-xs text-gray-400 ml-1">
            ({progressPercentage.toFixed(0)}%)
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor:
              progressPercentage >= 100
                ? "#22c55e" // green-500
                : "#a855f7", // purple-500
          }}
        />
      </div>

      <div className="flex justify-between items-center text-sm">
        <div>
          {remainingDistance > 0 ? (
            <div className="text-gray-600">
              <span className="font-medium text-purple-600">
              {remainingDistance.toFixed(0)} km
              </span>{" "}
              jäljellä
            </div>
          ) : (
            <div className="text-green-600 font-medium">
              Viikkotavoite saavutettu! 🎉
            </div>
          )}
        </div>
        <div className="text-gray-500">
          {Math.round(targetPaces.weeklyPerUser)} km/hlö
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgressBar;
