// components/ClearWeeklyProgress.tsx - Super clear weekly progress using real challenge data
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { User } from "@/app/types/types";
import { challengeParams } from "@/app/constants/challengeParams";

const r1 = (n: number) => Number(n.toFixed(1));

interface ClearWeeklyProgressProps {
  user: User;
  totalUsers?: number; // Pass actual team size from parent
}

const ClearWeeklyProgress: React.FC<ClearWeeklyProgressProps> = ({ user, totalUsers = 10 }) => {
  const weeklyData = useMemo(() => {
    // Current week (Monday to Sunday)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // This week's activities
    const weekActivities = user.activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      return activityDate >= weekStart && activityDate <= weekEnd;
    });
    const thisWeekKm = r1(weekActivities.reduce((sum, activity) => sum + activity.kilometers, 0));

    // Challenge timeline from challengeParams
    const challengeStart = new Date(challengeParams.startDate);
    const challengeEnd = new Date(challengeParams.endDate);
    
    // Calculate actual challenge progress
    const totalChallengeDays = Math.ceil((challengeEnd.getTime() - challengeStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.max(0, Math.ceil((today.getTime() - challengeStart.getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, Math.ceil((challengeEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Individual targets based on real challenge data
    const myTotalTarget = challengeParams.totalDistance / totalUsers;
    const myDailyTarget = challengeParams.dailyTarget / totalUsers;
    const myWeeklyTarget = r1(myDailyTarget * 7);
    
    // Where I should be by now (linear progression)
    const expectedProgressByNow = r1((myTotalTarget * daysPassed) / totalChallengeDays);
    
    // Am I ahead or behind overall?
    const difference = r1(user.totalKm - expectedProgressByNow);
    const isOnTrack = Math.abs(difference) <= myDailyTarget; // Within one day's target
    const isAhead = difference > myDailyTarget;
    const isBehind = difference < -myDailyTarget;

    // Week status
    let weekStatus: string;
    let weekColor: string;
    let weekEmoji: string;

    if (thisWeekKm >= myWeeklyTarget) {
      weekStatus = 'Hyvä viikko! 🎯';
      weekColor = 'text-green-600';
      weekEmoji = '💪';
    } else if (thisWeekKm >= myWeeklyTarget * 0.75) {
      weekStatus = 'Hyvässä vauhdissa';
      weekColor = 'text-yellow-600';
      weekEmoji = '👍';
    } else {
      weekStatus = 'Tarvitsee lisää vauhtia';
      weekColor = 'text-red-600';
      weekEmoji = '⚡';
    }

    return {
      thisWeekKm,
      myWeeklyTarget,
      weekStatus,
      weekColor,
      weekEmoji,
      activitiesCount: weekActivities.length,
      
      // Overall progress
      myTotalTarget,
      currentTotal: r1(user.totalKm),
      expectedTotal: expectedProgressByNow,
      difference,
      isOnTrack,
      isAhead,
      isBehind,
      
      // Timeline
      daysPassed,
      daysRemaining,
      totalChallengeDays,
      
      // Percentage
      weekPercentage: Math.round((thisWeekKm / myWeeklyTarget) * 100),
      overallPercentage: Math.round((user.totalKm / myTotalTarget) * 100)
    };
  }, [user.activities, user.totalKm, totalUsers]);

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-yellow-200">
      {/* Simple header */}
      <div className="text-center mb-5">
        <h3 className="text-xl font-bold text-gray-800 mb-1">Tämä viikko</h3>
        <p className="text-sm text-gray-500">
          {weeklyData.activitiesCount} suoritusta • Tavoite {weeklyData.myWeeklyTarget} km
        </p>
      </div>

      {/* Main progress */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-gray-800 mb-3">
          {weeklyData.thisWeekKm} km
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xl">{weeklyData.weekEmoji}</span>
          <span className={`text-lg font-medium ${weeklyData.weekColor}`}>
            {weeklyData.weekStatus}
          </span>
        </div>

        {/* Simple progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <motion.div
            className={`h-4 rounded-full flex items-center justify-center ${
              weeklyData.weekPercentage >= 100 ? 'bg-green-500' :
              weeklyData.weekPercentage >= 75 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(weeklyData.weekPercentage, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {weeklyData.weekPercentage >= 15 && (
              <span className="text-white text-sm font-medium">
                {weeklyData.weekPercentage}%
              </span>
            )}
          </motion.div>
        </div>
        
        {weeklyData.weekPercentage < 15 && (
          <div className="text-right text-sm font-medium text-gray-700">
            {weeklyData.weekPercentage}%
          </div>
        )}
      </div>

      {/* Overall status */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {weeklyData.currentTotal}
            </div>
            <div className="text-sm text-gray-600">Yhteensä kilometriä</div>
            <div className="text-xs text-gray-500">
              {weeklyData.overallPercentage}% kokonaistavoitteesta
            </div>
          </div>
          
          <div>
            <div className={`text-2xl font-bold ${
              weeklyData.isAhead ? 'text-green-600' :
              weeklyData.isBehind ? 'text-red-600' :
              'text-blue-600'
            }`}>
              {weeklyData.isAhead ? `+${weeklyData.difference}` :
               weeklyData.isBehind ? weeklyData.difference :
               '0'}
            </div>
            <div className="text-sm text-gray-600">Tavoitetahdista</div>
            <div className="text-xs text-gray-500">
              {weeklyData.isAhead ? 'Etuajassa' :
               weeklyData.isBehind ? 'Jäljessä' :
               'Aikataulussa'}
            </div>
          </div>
        </div>

        {/* Simple advice */}
        <div className="mt-4 text-center">
          {weeklyData.thisWeekKm < weeklyData.myWeeklyTarget && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
              💡 Tarvitset vielä <strong>{r1(weeklyData.myWeeklyTarget - weeklyData.thisWeekKm)} km</strong> tällä viikolla tavoitteen saavuttamiseksi
            </div>
          )}
          
          {weeklyData.isBehind && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mt-2">
              🚨 Olet <strong>{Math.abs(weeklyData.difference)} km jäljessä</strong> kokonaistavoitteesta
            </div>
          )}
          
          {weeklyData.isAhead && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mt-2">
              🚀 Loistavaa! Olet <strong>{weeklyData.difference} km etuajassa</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClearWeeklyProgress;