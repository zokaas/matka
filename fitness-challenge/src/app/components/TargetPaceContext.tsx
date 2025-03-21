import React, { createContext, useContext } from "react";
import { useEnhancedTargetPaces } from "@/app/hooks/useTargetPaces";
import { User } from "@/app/types/types";

// Create a default/fallback value for the context
const defaultTargetPace = {
  totalProgress: 0,
  remainingDistance: 0,
  daysRemaining: 0,
  dailyPerUser: 0,
  weeklyPerUser: 0,
  historicalPace: 0,
  recentPace: 0,
  weeklyPace: 0,
  requiredPace: 0,
  projectedEndDate: null,
  progressStatus: 'on track' as 'behind' | 'on track' | 'ahead',
  behindAmount: 0,
  projections: {
    historical: {
      estimatedEndDate: null,
      daysFromTarget: null,
    },
    recent: {
      estimatedEndDate: null,
      daysFromTarget: null,
    },
    weekly: {
      estimatedEndDate: null,
      daysFromTarget: null,
    }
  }
};

export const TargetPaceContext = createContext<ReturnType<typeof useEnhancedTargetPaces> | typeof defaultTargetPace>(defaultTargetPace);

export const TargetPaceProvider: React.FC<{ users: User[]; children: React.ReactNode }> = ({ users, children }) => {
  const targetPaces = useEnhancedTargetPaces(users);

  // Only provide the context value if it's valid
  const contextValue = targetPaces || defaultTargetPace;

  return (
    <TargetPaceContext.Provider value={contextValue}>
      {children}
    </TargetPaceContext.Provider>
  );
};

export const useTargetPace = () => {
  const context = useContext(TargetPaceContext);
  // No need to throw an error, as we now have default values
  return context;
};