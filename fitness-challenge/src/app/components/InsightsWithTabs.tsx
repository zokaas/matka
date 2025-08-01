import { AlertCircle } from "lucide-react";
import React from "react";
import { format } from "date-fns";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useWeeklyInsights } from "../hooks/useWeeklyInsights";
import {
  getWeekTopSports,
  getLongestActivities,
  getWeeklyTopPerformers,
} from "../utils/activityUtils";
import { getLastFourWeeks } from "../utils/dateUtils";
import Header from "./Insights/Header";
import KeyMetrics from "./Insights/KeyMetrics";
import PopularSports from "./Insights/PopularSports";
import RecordHolders from "./Insights/RecordHolders";
import WeeklyActivity from "./Insights/WeeklyActivity";
import WeeklyInsights from "./Insights/WeeklyInsights";
import PaceProjectionTabs from "./PaceProjectionTabs";
import { useEnhancedTargetPaces } from "../hooks/useTargetPaces";
import { TargetPaceProvider } from "./TargetPaceContext";
import { challengeParams } from "../constants/challengeParams";
import Loader from "./common/Loader";

export default function InsightsWithTabs() {
  // Fetch users & manage loading/error state
  const { users, loading, error } = useFetchUsers();

  // Calculate target progress with enhanced data
  const targetPaces = useEnhancedTargetPaces(users);

  // Weekly insights calculations
  // Add null check for targetPaces to prevent errors
  const weeklyInsights = useWeeklyInsights(
    users,
    targetPaces || {
      totalProgress: 0,
      remainingDistance: 0,
      daysRemaining: 0,
      dailyPerUser: 0,
      weeklyPerUser: 0,
      projectedEndDate: null,
    }
  );

  // Safe wrapper for getWeekTopSports
  const safeGetWeekTopSports = () => {
    try {
      return getWeekTopSports(users);
    } catch (err) {
      console.error("Error getting top sports:", err);
      return null;
    }
  };

  // Safe wrapper for getLongestActivities
  const safeGetLongestActivities = () => {
    try {
      return getLongestActivities(users);
    } catch (err) {
      console.error("Error getting longest activities:", err);
      return [];
    }
  };

  // Safe wrapper for getWeeklyTopPerformers
  const safeGetWeeklyTopPerformers = () => {
    try {
      return getWeeklyTopPerformers(users);
    } catch (err) {
      console.error("Error getting weekly top performers:", err);
      return null;
    }
  };

  // Transform Date objects to strings in projections object
  const getFormattedProjections = () => {
    if (!targetPaces || !targetPaces.projections) return null;

    return {
      historical: {
        estimatedEndDate: targetPaces.projections.historical.estimatedEndDate
          ? format(
              targetPaces.projections.historical.estimatedEndDate,
              "yyyy-MM-dd"
            )
          : null,
        daysFromTarget: targetPaces.projections.historical.daysFromTarget,
      },
      recent: {
        estimatedEndDate: targetPaces.projections.recent.estimatedEndDate
          ? format(
              targetPaces.projections.recent.estimatedEndDate,
              "yyyy-MM-dd"
            )
          : null,
        daysFromTarget: targetPaces.projections.recent.daysFromTarget,
      },
      weekly: {
        estimatedEndDate: targetPaces.projections.weekly.estimatedEndDate
          ? format(
              targetPaces.projections.weekly.estimatedEndDate,
              "yyyy-MM-dd"
            )
          : null,
        daysFromTarget: targetPaces.projections.weekly.daysFromTarget,
      },
    };
  };

  // Loading & Error States
  if (loading) {
    return (
<Loader/>
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

  // Make sure all required data is loaded before rendering
  if (!users || users.length === 0 || !targetPaces) {
    return (
      <Loader />
    );
  }

  // Get formatted projections
  const formattedProjections = getFormattedProjections();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <TargetPaceProvider users={users}>
        <Header participantCount={users.length} />

        <KeyMetrics
          getWeekTopSports={safeGetWeekTopSports}
          getLongestActivities={safeGetLongestActivities}
          getWeeklyTopPerformers={safeGetWeeklyTopPerformers}
        />

        <RecordHolders />

        <WeeklyInsights weeklyInsights={weeklyInsights} />

        {/* Only render PaceProjectionTabs if we have the necessary data */}
        {targetPaces &&
          formattedProjections &&
          typeof targetPaces.historicalPace === "number" && (
            <PaceProjectionTabs
              historicalPace={targetPaces.historicalPace}
              recentPace={targetPaces.recentPace || 0}
              weeklyPace={targetPaces.weeklyPace || 0}
              targetDate={new Date(challengeParams.endDate)}
              remainingDistance={targetPaces.remainingDistance}
              participantCount={users.length}
              projections={formattedProjections}
            />
          )}

        <WeeklyActivity getLastFourWeeks={getLastFourWeeks} users={users} />

        <PopularSports users={users} />
      </TargetPaceProvider>
    </div>
  );
}
