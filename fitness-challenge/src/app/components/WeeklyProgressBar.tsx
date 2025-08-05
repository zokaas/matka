// WeeklyProgressBar.tsx - MASSIVELY SIMPLIFIED
import React from "react";
import { useFetchUsers } from "@/app/hooks/useFetchUsers";
import { useWeeklyGoal } from "@/app/hooks/useWeeklyGoal"; // 🆕 NEW IMPORT
import { useTheme } from "@/app/hooks/useTheme";

const WeeklyProgressBar = () => {
  const { t } = useTheme();
  const { users, loading, error } = useFetchUsers();
  
  // 🆕 REPLACE ALL COMPLEX STATE AND LOGIC WITH SINGLE HOOK
  const {
    weeklyGoal,
    weeklyProgress,
    weeklyGoalPerUser,
    remainingDistance,
    progressPercentage
  } = useWeeklyGoal(users);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-16">
        <div className="w-5 h-5 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 rounded text-red-500 text-center text-sm">
        {t.weeklyProgressBar.errorLoadingData}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-medium text-gray-800">{t.weeklyProgressBar.weeklyGoal}</h2>
        <div className="text-sm font-medium">
          <span className="text-slate-600">{weeklyProgress}</span>
          <span className="text-gray-500"> / {weeklyGoal} km</span>
          <span className="text-xs text-gray-400 ml-1">
            ({Math.round(progressPercentage)}%)
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
        <div
          className="h-2.5 rounded-full transition-all duration-300"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor:
              progressPercentage >= 100
                ? "#22c55e"
                : "#facc15",
          }}
        />
      </div>

      <div className="flex justify-between items-center text-sm">
        <div>
          {remainingDistance > 0 ? (
            <div className="text-gray-600">
              <span className="font-medium text-slate-600">
                {Math.round(remainingDistance)} km
              </span>{" "}
              {t.weeklyProgressBar.remaining}
            </div>
          ) : (
            <div className="font-medium">
              {t.weeklyProgressBar.goalAchieved} 🎉
            </div>
          )}
        </div>
        <div className="text-gray-500">{weeklyGoalPerUser} {t.weeklyProgressBar.kmPerPerson}</div>
      </div>
    </div>
  );
};

export default WeeklyProgressBar;