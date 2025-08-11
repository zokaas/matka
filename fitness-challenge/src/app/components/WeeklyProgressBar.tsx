// components/WeeklyProgressBar.tsx - CLEAN & SIMPLE VERSION
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { useFetchUsers } from "@/app/hooks/useFetchUsers";
import { useWeeklyGoal } from "@/app/hooks/useWeeklyGoal";
import { useTheme } from "@/app/hooks/useTheme";

const WeeklyProgressBar = () => {
  const { t } = useTheme();
  const { users, loading, error } = useFetchUsers();
  const [showDetails, setShowDetails] = useState(false);
  
  const weeklyGoalData = useWeeklyGoal(users);
  
  const {
    weeklyGoal,
    weeklyProgress,
    weeklyGoalPerUser,
    remainingDistance,
    progressPercentage,
    goalAdjustment,
    previousWeekGoal,
    weeklyHistory,
    hasHistory
  } = weeklyGoalData;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-16">
        <motion.div 
          className="w-5 h-5 border-4 border-yellow-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 rounded text-yellow-600 bg-yellow-50 text-center text-sm border border-yellow-200">
        {t.weeklyProgressBar.errorLoadingData}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-yellow-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-medium text-slate-800">
              {t.weeklyProgressBar.weeklyGoal}
            </h2>
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              className="p-1 hover:bg-yellow-50 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Info className="w-4 h-4 text-slate-500" />
            </motion.button>
          </div>

        </div>

        <div className="text-right">
          <div className="text-sm font-medium">
            <span className="text-slate-800">{weeklyProgress}</span>
            <span className="text-slate-600"> / {weeklyGoal} km</span>
            <span className="text-xs text-slate-500 ml-1">
              ({Math.round(progressPercentage)}%)
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {Number(weeklyGoalPerUser).toFixed(1)} km/hlö
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative mb-3">
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
          <motion.div
            className={`h-3 rounded-full transition-all duration-500 relative ${
              progressPercentage >= 100 
                ? "bg-gradient-to-r from-yellow-300 to-yellow-500" 
                : progressPercentage >= 80 
                  ? "bg-gradient-to-r from-yellow-300 to-yellow-500" 
                  : "bg-gradient-to-r from-yellow-200 to-yellow-400"
            }`}
            style={{
              width: `${Math.min(progressPercentage, 100)}%`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Glow effect when close to or exceeding goal */}
            {progressPercentage >= 90 && (
              <motion.div
                className="absolute inset-0 rounded-full opacity-30"
                style={{
                  backgroundColor: "#facc15",
                  filter: "blur(4px)",
                }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        </div>
        {/* Bicycle emoji positioned outside progress bar */}
        <motion.div
          className="absolute top-0 text-sm"
          style={{
            transform: "translateY(-4px) translateX(-8px) scaleX(-1)",
            opacity: progressPercentage > 5 ? 1 : 0,
          }}
          initial={{ left: "0%" }}
          animate={{ left: `${Math.min(progressPercentage, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          🚴‍♂️
        </motion.div>
      </div>

      {/* Bottom info */}
      <div className="flex justify-between items-center text-sm">
        <div>
          {remainingDistance > 0 ? (
            <span className="text-slate-600">
              <span className="font-medium text-slate-800">
                {Math.round(remainingDistance)} km
              </span> jäljellä
            </span>
          ) : (
            <span className="font-medium text-yellow-600">
              Viikkotavoite saavutettu! 🎉
            </span>
          )}
        </div>
        {hasHistory && goalAdjustment !== 0 && (
          <div className="text-xs text-slate-500">
            {goalAdjustment > 0 ? '📈' : '📉'} {goalAdjustment > 0 ? '+' : ''}{goalAdjustment} km viime viikosta
          </div>
        )}
      </div>

      {/* Details panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-slate-200"
          >
            <div className="space-y-3 text-sm">
              {/* Current week info */}
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600 text-xs">Tämän viikon tilanne:</span>
                  <span className="text-xs font-medium text-yellow-700">
                    {progressPercentage >= 100 ? '🎯 Tavoite saavutettu!' : '🚴‍♂️ Matkalla'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      Edistyminen: {Number(weeklyProgress).toFixed(1).replace('.', ',')} / {Number(weeklyGoal).toFixed(1).replace('.', ',')} km
                    </div>
                    <div className="text-xs text-slate-600">
                      Jäljellä: {Number(remainingDistance).toFixed(1).replace('.', ',')} km
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-600">
                      {Math.round(progressPercentage)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal comparison */}
              {previousWeekGoal && (
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-600">Viime viikon tavoite:</span>
                  <span className="font-medium text-slate-800">{previousWeekGoal} km</span>
                </div>
              )}
              
              {/* Last week's performance comparison */}
              {hasHistory && weeklyHistory.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-800 text-xs">Viime viikon suoritus</h4>
                  {(() => {
                    const lastWeek = weeklyHistory[weeklyHistory.length - 1];
                    const achievementRate = lastWeek.achievementRate;
                    const isSuccess = achievementRate >= 1;
                    
                    return (
                      <div className="p-3 rounded-lg border" style={{
                        backgroundColor: isSuccess ? '#fef3c7' : '#fef2f2',
                        borderColor: isSuccess ? '#f59e0b' : '#ef4444'
                      }}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-slate-600">Tavoite vs. saavutettu:</span>
                          <span className={`text-xs font-medium ${isSuccess ? 'text-yellow-700' : 'text-red-700'}`}>
                            {isSuccess ? '✅ Onnistui' : '❌ Ei täyttynyt'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium text-slate-800">
                              {Math.round(lastWeek.achieved).toString().replace('.', ',')} km
                            </span>
                            <span className="text-slate-600"> / {lastWeek.goalSet} km</span>
                          </div>
                          <div className={`text-sm font-medium ${isSuccess ? 'text-yellow-600' : 'text-red-600'}`}>
                            {Math.round(achievementRate * 100)}%
                          </div>
                        </div>
                        {/* Progress bar for last week */}
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                isSuccess 
                                  ? 'bg-gradient-to-r from-yellow-300 to-yellow-500' 
                                  : 'bg-gradient-to-r from-red-300 to-red-500'
                              }`}
                              style={{ width: `${Math.min(achievementRate * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
              
              {/* Recent history */}
              {hasHistory && weeklyHistory.length > 1 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-800 text-xs">Aikaisemmat viikot</h4>
                  {weeklyHistory.slice(-3, -1).map((week, index) => (
                    <div key={week.weekKey} className="flex justify-between text-xs">
                      <span className="text-slate-600">
                        {index === 0 && weeklyHistory.length > 2 ? 'Sitä edellinen' : 'Vanhempi'}:
                      </span>
                      <span className={`font-medium ${
                        week.achievementRate >= 1 ? 'text-yellow-600' : 'text-yellow-500'
                      }`}>
                        {Math.round(week.achieved).toString().replace('.', ',')}/{week.goalSet} km 
                        <span className="text-slate-500 ml-1">
                          ({Math.round(week.achievementRate * 100)}%)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* No history message */}
              {!hasHistory && (
                <div className="text-center py-4">
                  <div className="text-slate-500 text-sm">
                    📈 Historiallista dataa ei vielä saatavilla
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Historia alkaa kertyä viikon päätyttyä
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeeklyProgressBar;