// fitness-challenge/src/app/components/WeeklyProgressBar.tsx
import React, { useState, useEffect } from "react";
import { useFetchUsers } from "@/app/hooks/useFetchUsers";

// Constants for the challenge
const CHALLENGE_START_DATE = new Date("2025-01-06");
const CHALLENGE_END_DATE = new Date("2025-06-22");
const TOTAL_CHALLENGE_DISTANCE = 100000; // 100,000 km

const WeeklyProgressBar = () => {
  const { users, loading, error } = useFetchUsers();
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [weekStartKey, setWeekStartKey] = useState("");
  const [weeklyKmPerPerson, setWeeklyKmPerPerson] = useState(0);

  useEffect(() => {
    if (!users || users.length === 0) return;

    // Calculate the current week's key (to identify the week)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0); // Start of Monday

    // Determine the end of the week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999); // End of Sunday

    // Create a key for this week (e.g., "2025-W12")
    const weekYear = weekStart.getFullYear();
    const weekNum = Math.ceil((weekStart.getTime() - new Date(weekYear, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const currentWeekKey = `${weekYear}-W${weekNum}`;
    
    setWeekStartKey(currentWeekKey);

    // Check if we already have a stored weekly goal
    const storedWeeklyGoal = localStorage.getItem(`weekly-goal-${currentWeekKey}`);
    
    if (storedWeeklyGoal) {
      // Use the stored goal
      const parsedGoal = parseInt(storedWeeklyGoal, 10);
      setWeeklyGoal(parsedGoal);
      setWeeklyKmPerPerson(Math.round(parsedGoal / users.length));
    } else {
      // Calculate a new weekly goal based on remaining challenge distance and time
      
      // Get total progress so far
      const totalProgress = users.reduce((sum, user) => sum + user.totalKm, 0);
      
      // Calculate remaining distance to the challenge goal
      const remainingChallengeDistance = Math.max(0, TOTAL_CHALLENGE_DISTANCE - totalProgress);
      
      // Calculate days left until challenge end
      const daysRemaining = Math.max(1, Math.ceil((CHALLENGE_END_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
      
      // Calculate weeks remaining (round up to ensure we have a safety margin)
      const weeksRemaining = Math.ceil(daysRemaining / 7);
      
      // Calculate required weekly distance for the team
      const requiredWeeklyDistance = Math.ceil(remainingChallengeDistance / weeksRemaining);
      
      // Set the weekly goal and per-person breakdown
      setWeeklyGoal(requiredWeeklyDistance);
      setWeeklyKmPerPerson(Math.round(requiredWeeklyDistance / users.length));
      
      // Store this week's goal
      localStorage.setItem(`weekly-goal-${currentWeekKey}`, requiredWeeklyDistance.toString());
    }
    
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
    
    // Calculate remaining distance (never negative)
    const weekGoal = storedWeeklyGoal ? parseInt(storedWeeklyGoal, 10) : (weeklyGoal || 0);
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
        Error loading data
      </div>
    );
  }

  // Calculate progress percentage (cap at 100% for display purposes)
  const progressPercentage = weeklyGoal > 0 
    ? Math.min(100, (weeklyProgress / weeklyGoal) * 100) 
    : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-medium text-gray-800">Viikon tavoite</h2>
        <div className="text-sm font-medium">
          <span className="text-purple-600">{weeklyProgress}</span>
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
              {Math.round(remainingDistance)} km
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
          {weeklyKmPerPerson} km/hlö
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgressBar;