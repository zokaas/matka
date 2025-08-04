"use client";

import React, { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { AlertCircle, BarChart3, Users, Calendar, Trophy } from "lucide-react";

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
import { useTheme } from "@/app/hooks/useTheme";

import EnhancedOverviewCards from "./Insights/OverviewCards";
import ChallengeStageProgress from "./Insights/ChallengeStageProgress";

export default function EnhancedInsightsWithTabs() {
  const { colors, t } = useTheme();
  const [activeSection, setActiveSection] = useState<'overview' | 'performance' | 'records' | 'analysis'>('overview');

  // Fetch users & manage loading/error state
  const { users, loading, error } = useFetchUsers();

  // Calculate target progress with enhanced data
  const targetPaces = useEnhancedTargetPaces(users);

  // Weekly insights calculations
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

  // Challenge context calculations
  const challengeStartDate = new Date(challengeParams.startDate);
  const challengeEndDate = new Date(challengeParams.endDate);
  const daysSinceStart = Math.max(0, differenceInDays(new Date(), challengeStartDate));
  const challengeProgressPercentage = Math.round((daysSinceStart / challengeParams.totalDays) * 100);

  const safeGetWeekTopSports = () => {
    try {
      return getWeekTopSports(users);
    } catch (err) {
      console.error("Error getting top sports:", err);
      return null;
    }
  };

  const safeGetLongestActivities = () => {
    try {
      return getLongestActivities(users);
    } catch (err) {
      console.error("Error getting longest activities:", err);
      return [];
    }
  };

  const safeGetWeeklyTopPerformers = () => {
    try {
      return getWeeklyTopPerformers(users);
    } catch (err) {
      console.error("Error getting weekly top performers:", err);
      return null;
    }
  };

  const getFormattedProjections = () => {
    if (!targetPaces || !targetPaces.projections) return null;

    return {
      historical: {
        estimatedEndDate: targetPaces.projections.historical.estimatedEndDate
          ? format(targetPaces.projections.historical.estimatedEndDate, "yyyy-MM-dd")
          : null,
        daysFromTarget: targetPaces.projections.historical.daysFromTarget,
      },
      recent: {
        estimatedEndDate: targetPaces.projections.recent.estimatedEndDate
          ? format(targetPaces.projections.recent.estimatedEndDate, "yyyy-MM-dd")
          : null,
        daysFromTarget: targetPaces.projections.recent.daysFromTarget,
      },
      weekly: {
        estimatedEndDate: targetPaces.projections.weekly.estimatedEndDate
          ? format(targetPaces.projections.weekly.estimatedEndDate, "yyyy-MM-dd")
          : null,
        daysFromTarget: targetPaces.projections.weekly.daysFromTarget,
      },
    };
  };

  const sections = [
    { key: 'overview', label: 'Yleiskatsaus', icon: BarChart3 },
    { key: 'performance', label: 'Suorituskyky', icon: Trophy },
    { key: 'records', label: 'Ennätykset', icon: Users },
    { key: 'analysis', label: 'Analyysit', icon: Calendar },
  ] as const;

  if (loading) return <Loader />;

  if (error) {
    return (
      <div
        className="flex items-center justify-center h-64"
        style={{ color: colors.error }}
      >
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>{t.error}: {error}</span>
      </div>
    );
  }

  if (!users || users.length === 0 || !targetPaces) {
    return <Loader />;
  }

  const formattedProjections = getFormattedProjections();

  return (
    <div
      className="min-h-screen max-w-7xl mx-auto p-6 space-y-8"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      <TargetPaceProvider users={users}>
        {/* Enhanced Header with Challenge Context */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: colors.primary }}>
            📊 {t.navbar.statistics}
          </h1>
          <p className="text-lg mb-4" style={{ color: colors.mutedText }}>
            {t.subtitle}
          </p>
          <div 
            className="inline-flex items-center gap-4 px-6 py-3 rounded-full"
            style={{ backgroundColor: colors.secondary }}
          >
            <div className="text-sm" style={{ color: colors.mutedText }}>
              Päivä {daysSinceStart} / {challengeParams.totalDays}
            </div>
            <div className="text-sm font-semibold" style={{ color: colors.text }}>
              {challengeProgressPercentage}% ajasta kulunut
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex justify-center mb-8">
          <div 
            className="inline-flex rounded-xl p-1 shadow-lg"
            style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
          >
            {sections.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  activeSection === key ? 'shadow-sm' : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: activeSection === key ? colors.primary : 'transparent',
                  color: activeSection === key ? colors.background : colors.text,
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content based on active section */}
        <div className="space-y-8">
          {activeSection === 'overview' && (
            <>
              <Header participantCount={users.length} />
              <EnhancedOverviewCards targetPaces={targetPaces} users={users} />
              <ChallengeStageProgress totalProgress={targetPaces.totalProgress} users={users} />
            </>
          )}

          {activeSection === 'performance' && (
            <>
              <KeyMetrics
                getWeekTopSports={safeGetWeekTopSports}
                getLongestActivities={safeGetLongestActivities}
                getWeeklyTopPerformers={safeGetWeeklyTopPerformers}
              />
              <WeeklyInsights weeklyInsights={weeklyInsights} />
              <WeeklyActivity getLastFourWeeks={getLastFourWeeks} users={users} />
            </>
          )}

          {activeSection === 'records' && (
            <>
              <RecordHolders />
              <PopularSports users={users} />
            </>
          )}

          {activeSection === 'analysis' && (
            <>
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
              
              {/* Challenge Progress Analysis */}
              <div 
                className="p-6 rounded-xl shadow-sm"
                style={{ backgroundColor: colors.card }}
              >
                <h3 className="text-xl font-semibold mb-6" style={{ color: colors.text }}>
                  🎯 Haasteen analyysit
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3" style={{ color: colors.text }}>
                      Kilometritavoitteet (challengeParams)
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span style={{ color: colors.mutedText }}>Kokonaistavoite:</span>
                        <span style={{ color: colors.text }}>{challengeParams.totalDistance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.mutedText }}>Päivittäinen tavoite:</span>
                        <span style={{ color: colors.text }}>{challengeParams.dailyTarget} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.mutedText }}>Viikoittainen tavoite:</span>
                        <span style={{ color: colors.text }}>{Math.round(challengeParams.weeklyTarget)} km</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3" style={{ color: colors.text }}>
                      Aikataulutiedot
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span style={{ color: colors.mutedText }}>Aloituspäivä:</span>
                        <span style={{ color: colors.text }}>{format(challengeStartDate, 'd.M.yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.mutedText }}>Lopetuspäivä:</span>
                        <span style={{ color: colors.text }}>{format(challengeEndDate, 'd.M.yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.mutedText }}>Kokonaisaika:</span>
                        <span style={{ color: colors.text }}>{challengeParams.totalDays} päivää</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </TargetPaceProvider>
    </div>
  );
}