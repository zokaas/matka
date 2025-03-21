import React from "react";
import Header from "./Header";
import KeyMetrics from "./KeyMetrics";
import ProgressChart from "./ProgressChart";
import WeeklyInsights from "./WeeklyInsights";
import { useFetchUsers } from "@/app/hooks/useFetchUsers";
import { useTargetPaces } from "@/app/hooks/useTargetPaces";
import { useWeeklyInsights } from "@/app/hooks/useWeeklyInsights";
import { Loader2, AlertCircle } from "lucide-react";
import { getLongestActivities, getWeeklyTopPerformers, getWeekTopSports } from "@/app/utils/activityUtils";
import RecordHolders from "./RecordHolders";
import PopularSports from "./PopularSports";
import WeeklyActivity from "./WeeklyActivity";
import { getLastFourWeeks } from "@/app/utils/dateUtils";
import { getTargetLine } from "@/app/utils/getTargetLine";
import { filterDataByTimeframe } from "@/app/utils/filterData";

export default function Insights() {
  // Fetch users & manage loading/error state
  const { users, loading, error } = useFetchUsers();
  // Calculate target progress
  const targetPaces = useTargetPaces(users);
  // Weekly insights calculations
  const weeklyInsights = useWeeklyInsights(users, targetPaces);

  // Calculate extra kilometers needed per person to stay on track
  const calculateExtraKmNeeded = () => {
    // If no users or no target paces, return undefined
    if (!users.length || !targetPaces.weeklyPerUser) return undefined;

    // Current total weekly kilometers for all users
    const currentWeeklyKm = users.reduce((sum, user) => {
      // Filter activities for the current week
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay()); // Start of this week
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + (6 - today.getDay())); // End of this week

      const weekActivities = user.activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= weekStart && activityDate <= weekEnd;
      });

      return sum + weekActivities.reduce((km, activity) => km + activity.kilometers, 0);
    }, 0);

    // Total weekly target for all users
    const totalWeeklyTarget = targetPaces.weeklyPerUser * users.length;

    // Calculate extra kilometers needed per person
    const extraKmNeeded = Math.max(0, (totalWeeklyTarget - currentWeeklyKm) / users.length);

    return extraKmNeeded;
  };

  // Calculate extra kilometers needed for next week only to get back on track
  const calculateNextWeekExtraKm = () => {
    if (!users.length || !targetPaces.weeklyPerUser) return undefined;
    
    // Get current behind amount
    const behindAmount = calculateBehindAmount();
    
    // If not behind, no extra km needed for next week
    if (behindAmount <= 0) return 0;
    
    // Distribute the behind amount to be caught up in the next week
    return behindAmount / users.length;
  };

  // Wrapper function to transform getTargetLine result
  const getTargetLineWrapper = () => {
    if (!users.length) return [];
    
    const { targetLineData } = getTargetLine(
      users, 
      (data) => filterDataByTimeframe(data, "all")
    );
    return targetLineData.map(item => ({
      date: item.date,
      distance: item.distance,
      target: item.target,
      progressStatus: item.progressStatus
    }));
  };

  // Calculate behind amount from target line data
  const calculateBehindAmount = () => {
    if (!users.length) return 0;
    
    const targetLineData = getTargetLineWrapper();
    if (!targetLineData.length) return 0;
    
    const lastDataPoint = [...targetLineData]
      .reverse()
      .find(point => point.distance !== null);

    if (!lastDataPoint) return 0;

    const actualDistance = lastDataPoint.distance ?? 0;
    const targetDistance = lastDataPoint.target;
    
    // If ahead of schedule, return 0 (no catch-up needed)
    if (actualDistance >= targetDistance) return 0;
    
    return Math.abs(actualDistance - targetDistance);
  };

  // Add extra kilometers needed to target paces
  const enrichedTargetPaces = {
    ...targetPaces,
    extraKmNeeded: calculateExtraKmNeeded(),
    nextWeekExtraKm: calculateNextWeekExtraKm(),
    behindAmount: calculateBehindAmount()
  };

  // Loading & Error States
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <Header targetPaces={enrichedTargetPaces} />
      <KeyMetrics
        targetPaces={enrichedTargetPaces}
        getWeekTopSports={() => getWeekTopSports(users)}
        getLongestActivities={() => getLongestActivities(users)}
        getWeeklyTopPerformers={() => getWeeklyTopPerformers(users)}
      />
      <RecordHolders />
      <WeeklyInsights weeklyInsights={weeklyInsights} />
      <ProgressChart
        targetPaces={enrichedTargetPaces}
        getTargetLine={getTargetLineWrapper}
      />
      <WeeklyActivity getLastFourWeeks={getLastFourWeeks} users={users} />
      <PopularSports users={users} />
    </div>
  );
}