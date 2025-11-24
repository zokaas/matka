// components/ImprovedWeeklyDisplay.tsx - Shows locked goals with pace context
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, Zap, Calendar } from "lucide-react";

interface ImprovedWeeklyDisplayProps {
  // Locked goal (set Monday, doesn't change)
  weeklyGoal: number;
  weeklyProgress: number;
  progressPercentage: number;
  
  // Current pace info (for context)
  currentPaceNeeded: number;
  isPaceAhead: boolean;
  paceAdjustment: number;
  
  // Week info
  daysRemaining: number;
  weekNumber: number;
}

const ImprovedWeeklyDisplay: React.FC<ImprovedWeeklyDisplayProps> = ({
  weeklyGoal,
  weeklyProgress,
  progressPercentage,
  currentPaceNeeded,
  isPaceAhead,
  paceAdjustment,
  daysRemaining,
  weekNumber,
}) => {
  const remainingKm = Math.max(0, weeklyGoal - weeklyProgress);
  const dailyPaceNeeded = daysRemaining > 0 ? remainingKm / daysRemaining : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Week {weekNumber} Goal
          </h2>
        </div>
        <div className="text-sm text-gray-500">
          {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
        </div>
      </div>

      {/* Main Goal Display */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">
              Weekly Target (locked Monday)
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {weeklyGoal.toFixed(1)} km
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-700">
              {weeklyProgress.toFixed(1)} km ({progressPercentage.toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Remaining */}
        <div className="mt-2 text-sm text-gray-600 text-center">
          <span className="font-medium">{remainingKm.toFixed(1)} km</span> remaining
          {daysRemaining > 0 && (
            <span> • Need <span className="font-medium">{dailyPaceNeeded.toFixed(1)} km/day</span></span>
          )}
        </div>
      </div>

      {/* Pace Context */}
      <div className={`p-4 rounded-lg border-2 ${
        isPaceAhead 
          ? 'bg-green-50 border-green-200' 
          : 'bg-orange-50 border-orange-200'
      }`}>
        <div className="flex items-start gap-3">
          {isPaceAhead ? (
            <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <TrendingDown className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4" />
              <span className="font-semibold text-sm">
                Pace Check
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              {isPaceAhead ? (
                <>
                   <span className="font-bold text-green-700">{Math.abs(paceAdjustment).toFixed(1)} km ahead</span> of pace! 
                  At current progress, you only need <span className="font-medium">{currentPaceNeeded.toFixed(1)} km</span> this week,
                  but your locked goal is <span className="font-medium">{weeklyGoal.toFixed(1)} km</span>.
                  Keep up the great work! 🎉
                </>
              ) : (
                <>
                  <span className="font-bold text-orange-700">{Math.abs(paceAdjustment).toFixed(1)} km behind</span> pace.
                  To get back on track, you need <span className="font-medium">{currentPaceNeeded.toFixed(1)} km</span> this week,
                  but your locked goal is <span className="font-medium">{weeklyGoal.toFixed(1)} km</span>.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ImprovedWeeklyDisplay;