import { useEffect, useState } from "react";
import { Stage } from "../themes/themeTypes";


export function useCurrentStage(stages: Stage[], totalKm: number) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    for (let i = stages.length - 1; i >= 0; i--) {
      if (totalKm >= stages[i].pointsRequired) {
        setCurrentStage(i);
        break;
      }
    }
  }, [totalKm, stages]);

  const current = stages[currentStage];
  const next = stages[currentStage + 1];
  const progressToNext = next
    ? ((totalKm - current.pointsRequired) / (next.pointsRequired - current.pointsRequired)) * 100
    : 100;
  const kmToNext = next ? next.pointsRequired - totalKm : 0;

  return { currentStage, current, next, progressToNext, kmToNext };
}
