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
      <Header />
      <KeyMetrics
        targetPaces={targetPaces}
        getWeekTopSports={() => getWeekTopSports(users)} // ✅ Now passing users
        getLongestActivities={() => getLongestActivities(users)} // ✅ Now passing users
        getWeeklyTopPerformers={() => getWeeklyTopPerformers(users)} // ✅ Now passing users
      />
      <RecordHolders />
      <WeeklyInsights weeklyInsights={weeklyInsights} />
      <ProgressChart
        targetPaces={targetPaces}
        getTargetLine={() =>
          getTargetLine(users, (data) => filterDataByTimeframe(data, "all"))
        }
      />
      <WeeklyActivity getLastFourWeeks={getLastFourWeeks} users={users} />
      <PopularSports users={users} />
    </div>
  );
}
