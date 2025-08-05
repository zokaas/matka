import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/hooks/useTheme";
import { useCurrentStage } from "@/app/hooks/useCurrentStage";
import dynamic from "next/dynamic";
import { challengeParams } from "../constants/challengeParams";

const TourMapView = dynamic(() => import("@/app/components/TourMapView"), {
  ssr: false,
});

export default function StageProgressCard({ totalKm }: { totalKm: number }) {
  const { theme, t } = useTheme();
  const { stages } = theme;
  const { currentStage } = useCurrentStage(stages, totalKm);
  const [timelineView, setTimelineView] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector(".active-stage") as HTMLDivElement;
    if (active) {
      const offsetLeft = active.offsetLeft;
      const containerWidth = list.offsetWidth;
      const scrollPos = offsetLeft - containerWidth / 2 + active.offsetWidth / 2;
      list.scrollTo({ left: scrollPos, behavior: "smooth" });
    }
  }, [currentStage]);

  const totalStageDistance = stages[stages.length - 1].pointsRequired;
  const progressPercentage = (totalKm / totalStageDistance) * 100;
  const kmToNextStage =
    currentStage + 1 < stages.length
      ? Math.max(0, stages[currentStage + 1].pointsRequired - totalKm)
      : 0;

  const getDaysToNextStage = () => {
    const avgKmPerDay = totalKm / ((Date.now() - new Date(challengeParams.startDate).getTime()) / (1000 * 60 * 60 * 24));
    if (kmToNextStage > 0 && avgKmPerDay > 0) {
      const daysToNext = kmToNextStage / avgKmPerDay;
      const etaDate = new Date(Date.now() + daysToNext * 24 * 60 * 60 * 1000);
      return etaDate.toLocaleDateString("fi-FI", { weekday: "short", day: "numeric", month: "short" });
    }
    return null;
  };

  const eta = getDaysToNextStage();

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl px-3 py-4 shadow-lg border border-yellow-200"
    >
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex gap-2 flex-1 min-w-0">
            <div className="text-lg sm:text-xl mt-0.5 flex-shrink-0">{stages[currentStage].emoji}</div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-bold text-gray-800 leading-tight">
                {t.stageLabel} {currentStage + 1}: {stages[currentStage].name}
              </h2>
              <p className="text-xs text-gray-500 leading-tight mt-0.5 line-clamp-2">
                {stages[currentStage].description || ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => setTimelineView(!timelineView)}
            className="text-xs text-blue-600 underline hover:text-blue-800 transition-colors flex-shrink-0 px-1 py-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {timelineView ? (t.mapView || "Kartta") : (t.timelineView || "Lista")}
          </button>
        </div>
      </div>

      {timelineView ? (
        <div
          ref={listRef}
          className="flex flex-col pb-2 gap-1.5 scrollbar-hide max-h-80 overflow-y-auto"
        >
          {stages.map((stage, index) => {
            const isCurrent = index === currentStage;
            const isCompleted = index < currentStage;
            const isUpcoming = index > currentStage;

            return (
              <motion.div
                key={stage.name}
                className={`relative flex-shrink-0 flex flex-col items-center px-2 py-2 w-full rounded-lg text-center transition-all duration-300 border text-xs
                  ${isCurrent ? "bg-yellow-100 border-yellow-400 shadow active-stage" : ""}
                  ${isCompleted ? "bg-green-50 border-green-300 text-green-800" : ""}
                  ${isUpcoming ? "bg-gray-50 border-gray-200 text-gray-600" : ""}`}
                animate={isCurrent ? { scale: [1, 1.01, 1] } : {}}
                transition={isCurrent ? { repeat: Infinity, duration: 3 } : {}}
              >
                <div className="text-base sm:text-lg mb-0.5">{stage.emoji}</div>
                <div className="font-semibold text-[10px] sm:text-xs">
                  {t.stageLabel} {index + 1} {isCurrent && "• NYK"}
                </div>
                <div className="text-[9px] w-full leading-tight font-medium whitespace-normal break-words px-1">
                  {stage.name.length > 30 ? `${stage.name.substring(0, 27)}...` : stage.name}
                </div>
                <div className="text-[9px] mt-0.5 text-gray-500">
                  {index === 0 ? "0 km" : `${stage.pointsRequired.toLocaleString("fi-FI")} km`}
                </div>
                {isCompleted && (
                  <span className="text-green-600 text-[9px] font-semibold mt-0.5">✓ {t.completed}</span>
                )}
                {isCurrent && (
                  <div className="w-1.5 h-1.5 mt-1 bg-yellow-400 rounded-full animate-pulse" />
                )}
                {isUpcoming && (
                  <div className="w-1 h-1 mt-1 bg-gray-400 rounded-full" />
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <TourMapView 
          stages={stages} 
          currentStage={currentStage} 
          totalKm={totalKm}
          kmToNextStage={kmToNextStage}
          eta={eta}
        />
      )}

      <div className="mt-3">
        <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
          <span>{totalKm.toLocaleString("fi-FI", { maximumFractionDigits: 1 })} km / {totalStageDistance.toLocaleString("fi-FI")} km</span>
          <span>{Math.min(progressPercentage, 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
          <span>Start: Lille</span>
          <span>Finish: Paris</span>
        </div>
      </div>
      
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.section>
  );
}