// fitness-challenge/src/app/components/WeeklyProgressBar.tsx
import React, { useState, useEffect } from "react";
import { useFetchUsers } from "@/app/hooks/useFetchUsers";

// Target completion parameters
const TARGET_DATE = new Date("2025-06-22"); // Juhannus 2025
const TOTAL_CHALLENGE_DISTANCE = 100000; // km

const WeeklyProgressBar = () => {
  const { users, loading, error } = useFetchUsers();
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [weeklyPerUser, setWeeklyPerUser] = useState(0);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [weekStartKey, setWeekStartKey] = useState("");
  const [goalMet, setGoalMet] = useState(false);

  useEffect(() => {
    if (!users || users.length === 0) return;

    // Calculate the current week's key
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0); // Start of Monday

    // Create a key for this week
    const weekYear = weekStart.getFullYear();
    const weekNum = Math.ceil((weekStart.getTime() - new Date(weekYear, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const currentWeekKey = `${weekYear}-W${weekNum}`;
    
    setWeekStartKey(currentWeekKey);

    // Calculate the current week's progress
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999); // End of Sunday

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

    // Try to get the stored weekly goal for this week
    const storedWeeklyGoalKey = `weekly-goal-${currentWeekKey}`;
    const storedWeeklyGoal = localStorage.getItem(storedWeeklyGoalKey);
    
    let calculatedWeeklyGoal;
    
    // If we already have a stored goal for this week, use it
    if (storedWeeklyGoal) {
      calculatedWeeklyGoal = parseInt(storedWeeklyGoal, 10);
      
      // Also set the per-user goal based on this stored value
      setWeeklyPerUser(Math.round(calculatedWeeklyGoal / users.length));
    } 
    // Otherwise calculate a new goal based on the target completion date
    else {
      // Calculate total kilometers completed so far
      const totalKmCompleted = users.reduce((sum, user) => sum + user.totalKm, 0);
      
      // Calculate remaining kilometers to goal
      const remainingKm = Math.max(0, TOTAL_CHALLENGE_DISTANCE - totalKmCompleted);
      
      // Calculate days remaining until target date
      const daysRemaining = Math.max(1, Math.ceil((TARGET_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
      
      // Calculate weeks remaining (rounding up)
      const weeksRemaining = Math.max(1, Math.ceil(daysRemaining / 7));
      
      // Calculate the required weekly rate for the whole team
      const requiredWeeklyRate = Math.ceil(remainingKm / weeksRemaining);
      
      // Calculate required weekly rate per person
      const requiredWeeklyRatePerPerson = Math.ceil(requiredWeeklyRate / users.length);
      
      // Set this as our weekly per-person goal
      setWeeklyPerUser(requiredWeeklyRatePerPerson);
      
      // Calculate team weekly goal based on the per-person rate
      calculatedWeeklyGoal = requiredWeeklyRatePerPerson * users.length;
      
      // Store this calculated goal for the current week
      localStorage.setItem(storedWeeklyGoalKey, calculatedWeeklyGoal.toString());
    }

    setWeeklyGoal(calculatedWeeklyGoal);
    
    // Calculate remaining distance - ensure it's never negative
    const remaining = Math.max(0, calculatedWeeklyGoal - currentWeekDistance);
    setRemainingDistance(remaining);
    
    // Set goal met status
    setGoalMet(currentWeekDistance >= calculatedWeeklyGoal);
    
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

  // Calculate progress percentage
  const progressPercentage = 
    weeklyGoal > 0 ? Math.min(100, (weeklyProgress / weeklyGoal) * 100) : 0;

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
          {!goalMet ? (
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
          {weeklyPerUser > 0 ? `${weeklyPerUser} km/hlö` : "0 km/hlö"}
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgressBar;