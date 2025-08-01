// fitness-challenge/src/app/components/WeeklyProgressBar.tsx
import React, { useState, useEffect } from "react";
import { useFetchUsers } from "@/app/hooks/useFetchUsers";
import {
  getWeekStart,
  getWeekKey,
  getDaysRemaining,
} from "@/app/utils/dateUtils";
import { challengeParams } from "../constants/challengeParams";
import { useTheme } from "@/app/hooks/useTheme";

const CHALLENGE_START_DATE = new Date(challengeParams.startDate);
const CHALLENGE_END_DATE = new Date(challengeParams.endDate);
const TOTAL_CHALLENGE_DISTANCE = challengeParams.totalDistance;

const WeeklyProgressBar = () => {
  const { t } = useTheme();
  const { users, loading, error } = useFetchUsers();
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [weekStartKey, setWeekStartKey] = useState("");
  const [weeklyKmPerPerson, setWeeklyKmPerPerson] = useState(0);

  useEffect(() => {
    if (!users || users.length === 0) return;

    const today = new Date();
    const weekStart = getWeekStart(today);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const currentWeekKey = getWeekKey(today);
    setWeekStartKey(currentWeekKey);

    const storedWeeklyGoal = localStorage.getItem(`weekly-goal-${currentWeekKey}`);

    if (storedWeeklyGoal) {
      const parsedGoal = parseInt(storedWeeklyGoal, 10);
      setWeeklyGoal(parsedGoal);
      setWeeklyKmPerPerson(Math.round(parsedGoal / users.length));
    } else {
      const totalProgress = users.reduce((sum, user) => sum + user.totalKm, 0);
      const remainingChallengeDistance = Math.max(0, TOTAL_CHALLENGE_DISTANCE - totalProgress);
      const daysRemaining = getDaysRemaining(CHALLENGE_END_DATE, today);
      const weeksRemaining = Math.ceil(daysRemaining / 7);
      const requiredWeeklyDistance = Math.ceil(remainingChallengeDistance / weeksRemaining);

      setWeeklyGoal(requiredWeeklyDistance);
      setWeeklyKmPerPerson(Math.round(requiredWeeklyDistance / users.length));

      localStorage.setItem(`weekly-goal-${currentWeekKey}`, requiredWeeklyDistance.toString());
    }

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
    const weekGoal = storedWeeklyGoal ? parseInt(storedWeeklyGoal, 10) : weeklyGoal;
    const remaining = Math.max(0, weekGoal - currentWeekDistance);
    setRemainingDistance(remaining);
  }, [users]);

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
        {t.weeklyProgressBar.errorLoadingData}
      </div>
    );
  }

  const progressPercentage = weeklyGoal > 0
    ? Math.min(100, (weeklyProgress / weeklyGoal) * 100)
    : 0;

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
                : "#a855f7",
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
            <div className="bg-slate-600 font-medium">
              {t.weeklyProgressBar.goalAchieved} 🎉
            </div>
          )}
        </div>
        <div className="text-gray-500">{weeklyKmPerPerson} {t.weeklyProgressBar.kmPerPerson}</div>
      </div>
    </div>
  );
};

export default WeeklyProgressBar;