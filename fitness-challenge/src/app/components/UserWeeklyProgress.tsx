// components/ClearWeeklyProgress.tsx - Enhanced with percentage comparisons
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { User } from "@/app/types/types";
import { useWeeklyGoal } from "@/app/hooks/useWeeklyGoal";
import { challengeParams } from "@/app/constants/challengeParams";

const r1 = (n: number) => Number(n.toFixed(1));

interface ClearWeeklyProgressProps {
  user: User;
  totalUsers?: number;
}

const ClearWeeklyProgress: React.FC<ClearWeeklyProgressProps> = ({ 
  user, 
  totalUsers = 10 
}) => {
  const weeklyGoalData = useWeeklyGoal([user]);
  
  const data = useMemo(() => {
    const today = new Date();
    const challengeStart = new Date(challengeParams.startDate);
    
    const totalChallengeDays = challengeParams.totalDays;
    const daysPassed = Math.max(0, Math.ceil((today.getTime() - challengeStart.getTime()) / (1000 * 60 * 60 * 24)));
    
    const myTotalTarget = r1(challengeParams.totalDistance / totalUsers);
    const expectedProgressByNow = r1((myTotalTarget * daysPassed) / totalChallengeDays);
    const difference = r1(user.totalKm - expectedProgressByNow);
    
    // Calculate percentages
    const actualProgressPercentage = r1((user.totalKm / myTotalTarget) * 100);
    const expectedProgressPercentage = r1((expectedProgressByNow / myTotalTarget) * 100);
    const percentageDifference = r1(actualProgressPercentage - expectedProgressPercentage);
    
    // Performance ratio (how well performing compared to expected)
    const performanceRatio = expectedProgressByNow > 0 ? r1((user.totalKm / expectedProgressByNow) * 100) : 100;
    
    // Onko haasteen vauhdissa?
    let challengeStatus = 'ontrack';
    let challengeEmoji = '🎯';
    let challengeText = 'Aikataulussa';
    let challengeColor = 'text-blue-600';
    
    if (difference > 5) {
      challengeStatus = 'ahead';
      challengeEmoji = '🚀';
      challengeText = 'Etuajassa';
      challengeColor = 'text-green-600';
    } else if (difference < -5) {
      challengeStatus = 'behind';
      challengeEmoji = '⚠️';
      challengeText = 'Jäljessä';
      challengeColor = 'text-red-600';
    }

    return {
      challengeStatus,
      challengeEmoji,
      challengeText,
      challengeColor,
      totalKm: r1(user.totalKm),
      expectedKm: r1(expectedProgressByNow),
      differenceKm: r1(Math.abs(difference)),
      actualProgressPercentage,
      expectedProgressPercentage,
      percentageDifference,
      performanceRatio,
      myTotalTarget,
    };
  }, [user, totalUsers, weeklyGoalData]);

  return (
    <div className={`p-4 rounded-lg border-2 ${
      data.challengeStatus === 'ahead' ? 'bg-green-50 border-green-300' :
      data.challengeStatus === 'behind' ? 'bg-red-50 border-red-300' :
      'bg-blue-50 border-blue-300'
    }`}>
      <div className="text-center mb-3">
        <div className="text-xl">{data.challengeEmoji}</div>
        <div className={`font-bold text-lg ${data.challengeColor}`}>
          Koko haaste: {data.challengeText}
        </div>
        {/* Performance ratio display */}
        <div className="text-sm text-gray-600 mt-1">
          Suorituskyky: <span className={`font-bold ${data.challengeColor}`}>
            {data.performanceRatio}%
          </span> aikataulusta
        </div>
      </div>
      
      {/* HAASTEEN PROGRESS BAR */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Haasteen edistyminen:</span>
          <span>{data.actualProgressPercentage}% / {data.expectedProgressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 relative">
          {/* Tavoitelinja (missä pitäisi olla) */}
          <div 
            className="absolute top-0 h-3 w-0.5 bg-gray-600 z-10"
            style={{ left: `${Math.min(100, data.expectedProgressPercentage)}%` }}
            title="Missä pitäisi olla"
          />
          {/* Todellinen edistyminen */}
          <motion.div
            className={`h-3 rounded-full ${
              data.challengeStatus === 'ahead' ? 'bg-green-500' :
              data.challengeStatus === 'behind' ? 'bg-red-500' :
              'bg-blue-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, data.actualProgressPercentage)}%` }}
            transition={{ duration: 1.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 km</span>
          <span className="text-gray-600 font-medium">← Tavoitelinja</span>
          <span>{data.myTotalTarget} km</span>
        </div>
      </div>
      
      {/* Percentage comparison section */}
      <div className="bg-white/50 rounded-lg p-3 mb-3">
        <div className="text-sm font-medium text-gray-700 mb-2">Prosentuaalinen vertailu:</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Todellinen edistyminen:</div>
            <div className="font-bold text-lg">{data.actualProgressPercentage}%</div>
            <div className="text-xs text-gray-500">{data.totalKm} km</div>
          </div>
          <div>
            <div className="text-gray-600">Odotettu edistyminen:</div>
            <div className="font-bold text-lg">{data.expectedProgressPercentage}%</div>
            <div className="text-xs text-gray-500">{data.expectedKm} km</div>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-center">
            <span className="text-gray-600">Ero: </span>
            <span className={`font-bold ${
              data.percentageDifference > 0 ? 'text-green-600' : 
              data.percentageDifference < 0 ? 'text-red-600' : 
              'text-blue-600'
            }`}>
              {data.percentageDifference > 0 ? '+' : ''}{data.percentageDifference}% ({data.percentageDifference > 0 ? '+' : ''}{data.differenceKm} km)
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 text-center">
        Olet tehnyt <strong>{data.totalKm} km</strong> • Omasta tavoitteesta pitäisi olla <strong>{data.expectedKm} km</strong>
        {data.challengeStatus !== 'ontrack' && (
          <div className={`font-bold mt-1 ${data.challengeColor}`}>
            {data.challengeStatus === 'ahead' ? '🚀 Etuajassa' : '⚠️ Jäljessä'} {data.differenceKm} km
          </div>
        )}
      </div>
    </div>
  );
};

export default ClearWeeklyProgress;