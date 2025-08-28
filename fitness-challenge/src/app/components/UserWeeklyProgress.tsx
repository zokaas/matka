"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { User } from "@/app/types/types";
import { useWeeklyGoal } from "@/app/hooks/useWeeklyGoal";
import { challengeParams } from "@/app/constants/challengeParams";
import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { getChallengeDays, startOfLocalDay } from "@/app/utils/challengeClock";

const r1 = (n: number) => Number(n.toFixed(1));

interface ClearWeeklyProgressProps {
  user: User;
  totalUsers?: number;
}

const ClearWeeklyProgress: React.FC<ClearWeeklyProgressProps> = ({ 
  user, 
  totalUsers = 10 
}) => {
const weeklyGoalData = useWeeklyGoal([user]); // keep for re-render sync

const data = useMemo(() => {
    const today = new Date();
    const challengeStart = new Date(challengeParams.startDate);
    const challengeEnd = new Date(challengeParams.endDate);

    const { totalDays, daysPassedInclCutoff, daysRemainingExclCutoff } =
      getChallengeDays(challengeStart, challengeEnd, today);

    const myTotalTarget = r1(challengeParams.totalDistance / totalUsers);

    // progress includes today's activities (user.totalKm is already total-to-date)
    const expectedProgressByNow = r1((myTotalTarget * daysPassedInclCutoff) / totalDays);
    const difference = r1(user.totalKm - expectedProgressByNow);

    const actualProgressPercentage = r1((user.totalKm / myTotalTarget) * 100);
    const expectedProgressPercentage = r1((expectedProgressByNow / myTotalTarget) * 100);

    const remainingKm = Math.max(0, myTotalTarget - user.totalKm);
    const dailyPaceNeeded = daysRemainingExclCutoff > 0 ? r1(remainingKm / daysRemainingExclCutoff) : 0;

    // *** Unified weekly target ***
    const weeklyNeeded = daysRemainingExclCutoff > 0
      ? r1(remainingKm / (daysRemainingExclCutoff / 7))
      : 0;

    const currentDailyPace = daysPassedInclCutoff > 0 ? r1(user.totalKm / daysPassedInclCutoff) : 0;

    let status = "ontrack";
    let statusColor = "blue";
    let statusIcon = <Target className="w-4 h-4" />;
    let statusMessage = "Aikataulussa";

    if (difference > 3) {
      status = "ahead"; statusColor = "green"; statusIcon = <TrendingUp className="w-4 h-4" />; statusMessage = "Etuajassa";
    } else if (difference < -3) {
      status = "behind"; statusColor = "orange"; statusIcon = <TrendingDown className="w-4 h-4" />; statusMessage = "Jäljessä";
    }

    return {
      status, statusColor, statusIcon, statusMessage,
      totalKm: r1(user.totalKm),
      expectedKm: r1(expectedProgressByNow),
      differenceKm: r1(Math.abs(difference)),
      actualProgressPercentage, expectedProgressPercentage,
      myTotalTarget,
      daysRemaining: daysRemainingExclCutoff,           // <- exclude today
      dailyPaceNeeded, currentDailyPace,
      daysPassed: daysPassedInclCutoff,
      weeklyNeeded,                                     // <- add
    };
  }, [user, totalUsers, weeklyGoalData]);

  const getStatusColors = () => {
    switch (data.statusColor) {
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          progress: 'bg-green-500'
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          progress: 'bg-orange-500'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          progress: 'bg-blue-500'
        };
    }
  };

  const colors = getStatusColors();

  return (
    <div className={`rounded-xl border ${colors.bg} ${colors.border} overflow-hidden`}>
      {/* Mobile-optimized status header */}
      <div className="p-4 bg-white/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colors.bg}`}>
              {data.statusIcon}
            </div>
            <div>
              <div className={`font-bold ${colors.text}`}>
                {data.statusMessage}
              </div>
              <div className="text-sm text-gray-600">
                {data.totalKm} / {data.myTotalTarget} km
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-lg font-bold ${colors.text}`}>
              {data.status === "ahead" ? "+" : data.status === "behind" ? "-" : ""}{data.differenceKm} km
            </div>
            <div className="text-xs text-gray-600">
              {data.status === "ahead" ? "edellä" : data.status === "behind" ? "jäljessä" : "tasassa"}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Simplified progress bar */}
        <div>
          <div className="relative w-full bg-gray-200 rounded-full h-3 mb-2">
            {/* Expected progress marker */}
            <div
              className="absolute top-0 h-3 w-0.5 bg-gray-600 z-5"
              style={{ left: `${Math.min(100, data.expectedProgressPercentage)}%` }}
              title="Tavoitelinja"
            />
            
            {/* Actual progress */}
            <motion.div
              className={`h-3 rounded-full ${colors.progress}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, data.actualProgressPercentage)}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>0 km</span>
            <span>Tavoite: {data.expectedKm} km</span>
            <span>{data.myTotalTarget} km</span>
          </div>
        </div>

        {/* Key metrics - mobile grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/70 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-800">{data.daysRemaining}</div>
            <div className="text-xs text-gray-600">päivää jäljellä</div>
          </div>
          
          <div className="bg-white/70 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-800">{data.weeklyNeeded.toFixed(1)}</div>
            <div className="text-xs text-gray-600">km/viikko tavoite</div>
          </div>
        </div>

        {/* Simple status message */}
        <div className="bg-white/70 rounded-lg p-3">
          <div className="text-sm text-gray-700 text-center">
            {data.status === "ahead" ? (
              <span>Erinomaista! Olet {data.differenceKm} km edellä tavoitetta.</span>
            ) : data.status === "behind" ? (
              <span>Tavoite on vielä saavutettavissa säännöllisellä harjoittelulla.</span>
            ) : (
              <span>Olet täsmälleen aikataulussa. Jatka samaan malliin!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClearWeeklyProgress;