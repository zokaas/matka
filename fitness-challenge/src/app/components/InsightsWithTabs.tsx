import { Loader2, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useWeeklyInsights } from "../hooks/useWeeklyInsights";
import { getWeekTopSports, getLongestActivities, getWeeklyTopPerformers } from "../utils/activityUtils";
import { getLastFourWeeks } from "../utils/dateUtils";
import { filterDataByTimeframe } from "../utils/filterData";
import { getTargetLine } from "../utils/getTargetLine";
import Header from "./Insights/Header";
import KeyMetrics from "./Insights/KeyMetrics";
import PopularSports from "./Insights/PopularSports";
import ProgressChart from "./Insights/ProgressChart";
import RecordHolders from "./Insights/RecordHolders";
import WeeklyActivity from "./Insights/WeeklyActivity";
import WeeklyInsights from "./Insights/WeeklyInsights";
import PaceProjectionTabs from "./PaceProjectionTabs";
import { useEnhancedTargetPaces } from "../hooks/useTargetPaces";


export default function InsightsWithTabs() {
  // Fetch users & manage loading/error state
  const { users, loading, error } = useFetchUsers();
  
  // Calculate target progress with enhanced data
  const targetPaces = useEnhancedTargetPaces(users);
  
  // Weekly insights calculations
  const weeklyInsights = useWeeklyInsights(users, targetPaces);

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
      <Header targetPaces={targetPaces} />
      <KeyMetrics
        targetPaces={targetPaces}
        getWeekTopSports={() => getWeekTopSports(users)}
        getLongestActivities={() => getLongestActivities(users)}
        getWeeklyTopPerformers={() => getWeeklyTopPerformers(users)}
      />
      <RecordHolders />
      <WeeklyInsights weeklyInsights={weeklyInsights} />
            {/* Lisää tähän uusi PaceProjectionTabs-komponentti */}
            <PaceProjectionTabs
        historicalPace={targetPaces.historicalPace}
        recentPace={targetPaces.recentPace}
        weeklyPace={targetPaces.weeklyPace}
        targetDate={new Date("2025-06-22")}
        remainingDistance={targetPaces.remainingDistance}
        participantCount={users.length}
      />
      <ProgressChart
        targetPaces={targetPaces}
        getTargetLine={getTargetLineWrapper}
      />
      <WeeklyActivity getLastFourWeeks={getLastFourWeeks} users={users} />
      <PopularSports users={users} />
    </div>
  );
}