import React, { useState, useMemo } from "react";
import { useTheme } from "@/app/hooks/useTheme";
import { challengeParams } from "@/app/constants/challengeParams";
import { 
  MapPin, 
  CheckCircle, 
  Clock, 
  Target,
  ChevronDown,
  ChevronUp 
} from "lucide-react";

interface StageProgressProps {
  totalProgress: number;
  users: any[];
}

const ChallengeStageProgress: React.FC<StageProgressProps> = ({ 
  totalProgress, 
  users 
}) => {
  const { colors, theme, t } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const stages = theme.stages;
  
  // Calculate current stage and progress
  const { currentStage, stageProgress, nextStageDistance } = useMemo(() => {
    let currentStageIndex = 0;
    
    for (let i = stages.length - 1; i >= 0; i--) {
      if (totalProgress >= stages[i].pointsRequired) {
        currentStageIndex = i;
        break;
      }
    }
    
    const currentStageData = stages[currentStageIndex];
    const nextStageData = stages[currentStageIndex + 1];
    
    let progressInCurrentStage = 0;
    let nextDistance = 0;
    
    if (nextStageData) {
      const stageDistance = nextStageData.pointsRequired - currentStageData.pointsRequired;
      const progressInStage = totalProgress - currentStageData.pointsRequired;
      progressInCurrentStage = Math.min(100, (progressInStage / stageDistance) * 100);
      nextDistance = nextStageData.pointsRequired - totalProgress;
    } else {
      progressInCurrentStage = 100; // Completed all stages
    }
    
    return {
      currentStage: currentStageIndex,
      stageProgress: progressInCurrentStage,
      nextStageDistance: nextDistance,
    };
  }, [totalProgress, stages]);

  const completedStages = stages.filter((_, index) => index <= currentStage);
  const upcomingStages = stages.filter((_, index) => index > currentStage);
  const nextStage = stages[currentStage + 1];

  return (
    <div 
      className="p-6 rounded-xl shadow-sm"
      style={{ backgroundColor: colors.card }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center" style={{ color: colors.text }}>
          <MapPin className="w-6 h-6 mr-2" style={{ color: colors.accent }} />
          Tour de France Etapit
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-1 rounded-lg transition-colors hover:opacity-80"
          style={{ backgroundColor: colors.secondary, color: colors.text }}
        >
          <span className="text-sm">
            {isExpanded ? 'Piilota yksityiskohdat' : 'Näytä kaikki etapit'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Current Stage Highlight */}
      <div 
        className="p-6 rounded-xl mb-6 border-2"
        style={{ 
          backgroundColor: colors.secondary,
          borderColor: colors.primary,
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{stages[currentStage].emoji}</div>
          <div>
            <h4 className="text-xl font-bold" style={{ color: colors.text }}>
              {t.stageLabel} {currentStage + 1}: {stages[currentStage].name}
            </h4>
            <p className="text-sm" style={{ color: colors.mutedText }}>
              {stages[currentStage].description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span 
                className="px-2 py-1 rounded"
                style={{ 
                  backgroundColor: colors.primary, 
                  color: colors.background 
                }}
              >
                {stages[currentStage].stageType}
              </span>
              <span style={{ color: colors.mutedText }}>
                📍 {stages[currentStage].location}
              </span>
              <span style={{ color: colors.mutedText }}>
                {theme.weatherIcons[stages[currentStage].weather]} {stages[currentStage].weather}
              </span>
            </div>
          </div>
        </div>

        {/* Progress to next stage */}
        {nextStage && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium" style={{ color: colors.text }}>
                Edistyminen seuraavaan etappiin: {nextStage.name}
              </span>
              <span className="text-sm" style={{ color: colors.mutedText }}>
                {Math.round(stageProgress)}%
              </span>
            </div>
            <div 
              className="w-full h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: colors.border }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(stageProgress, 100)}%`,
                  backgroundColor: colors.accent,
                }}
              />
            </div>
            <p className="text-sm mt-2" style={{ color: colors.mutedText }}>
              {nextStageDistance.toLocaleString('fi-FI')} km jäljellä etappiin {currentStage + 2}
            </p>
          </div>
        )}
      </div>

      {/* Stage Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div 
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: colors.secondary }}
        >
          <CheckCircle className="w-6 h-6 mx-auto mb-2" style={{ color: '#16a34a' }} />
          <div className="text-xl font-bold" style={{ color: colors.text }}>
            {completedStages.length}
          </div>
          <div className="text-xs" style={{ color: colors.mutedText }}>
            Suoritetut etapit
          </div>
        </div>
        
        <div 
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: colors.secondary }}
        >
          <Clock className="w-6 h-6 mx-auto mb-2" style={{ color: colors.accent }} />
          <div className="text-xl font-bold" style={{ color: colors.text }}>
            {upcomingStages.length}
          </div>
          <div className="text-xs" style={{ color: colors.mutedText }}>
            Jäljellä olevia etappeja
          </div>
        </div>
        
        <div 
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: colors.secondary }}
        >
          <Target className="w-6 h-6 mx-auto mb-2" style={{ color: colors.primary }} />
          <div className="text-xl font-bold" style={{ color: colors.text }}>
            {((completedStages.length / stages.length) * 100).toFixed(0)}%
          </div>
          <div className="text-xs" style={{ color: colors.mutedText }}>
            Etapeista suoritettu
          </div>
        </div>
        
        <div 
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: colors.secondary }}
        >
          <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: colors.accent }} />
          <div className="text-xl font-bold" style={{ color: colors.text }}>
            {stages[currentStage].location.split(',')[0]}
          </div>
          <div className="text-xs" style={{ color: colors.mutedText }}>
            Nykyinen sijainti
          </div>
        </div>
      </div>

      {/* Detailed Stage List (expandable) */}
      {isExpanded && (
        <div className="space-y-3">
          <h4 className="font-semibold mb-4" style={{ color: colors.text }}>
            Kaikki etapit ({stages.length} kpl)
          </h4>
          
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {stages.map((stage, index) => {
              const isCompleted = index <= currentStage;
              const isCurrent = index === currentStage;
              const isNext = index === currentStage + 1;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    isCurrent ? 'scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: isCompleted 
                      ? '#f0fdf4' 
                      : isNext 
                      ? '#fffbeb' 
                      : colors.secondary,
                    borderColor: isCurrent 
                      ? colors.primary 
                      : isCompleted 
                      ? '#16a34a' 
                      : colors.border,
                    borderWidth: isCurrent ? '2px' : '1px',
                  }}
                >
                  <div className="text-2xl">{stage.emoji}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 
                        className="font-medium truncate"
                        style={{ 
                          color: isCompleted ? '#16a34a' : colors.text 
                        }}
                      >
                        {t.stageLabel} {index + 1}: {stage.name}
                      </h5>
                      {isCompleted && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
                      {isCurrent && <Target className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary }} />}
                    </div>
                    
                    <p 
                      className="text-xs mb-2 truncate"
                      style={{ color: colors.mutedText }}
                    >
                      {stage.description}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs">
                      <span 
                        className="px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: colors.primary + '20', 
                          color: colors.text 
                        }}
                      >
                        {stage.stageType}
                      </span>
                      <span style={{ color: colors.mutedText }}>
                        📍 {stage.location.split(',')[0]}
                      </span>
                      <span style={{ color: colors.mutedText }}>
                        {theme.weatherIcons[stage.weather]}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div 
                      className="font-bold"
                      style={{ 
                        color: isCompleted ? '#16a34a' : colors.text 
                      }}
                    >
                      {stage.pointsRequired.toLocaleString('fi-FI')} km
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: colors.mutedText }}
                    >
                      {isCompleted 
                        ? '✅ Suoritettu' 
                        : isCurrent 
                        ? '🎯 Nykyinen' 
                        : '⏳ Tulossa'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Challenge Summary */}
      <div 
        className="mt-6 p-4 rounded-lg border"
        style={{ 
          backgroundColor: colors.secondary,
          borderColor: colors.border 
        }}
      >
        <div className="text-center">
          <p className="text-sm" style={{ color: colors.mutedText }}>
            Käytämme Tour de France 2025 -reittiä ({challengeParams.totalDistance} km, {challengeParams.totalDays} päivää)
          </p>
          <p className="text-xs mt-1" style={{ color: colors.mutedText }}>
            Etapit perustuvat viralliseen Tour de France 2025 -reittiin ja sen kaupunkeihin
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeStageProgress;