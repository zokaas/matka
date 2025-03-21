import React, { createContext, useContext } from "react";
import { useEnhancedTargetPaces } from "@/app/hooks/useTargetPaces";
import { User } from "@/app/types/types";

export const TargetPaceContext = createContext<ReturnType<typeof useEnhancedTargetPaces> | null>(null);

export const TargetPaceProvider: React.FC<{ users: User[]; children: React.ReactNode }> = ({ users, children }) => {
  const targetPaces = useEnhancedTargetPaces(users);

  return (
    <TargetPaceContext.Provider value={targetPaces}>
      {children}
    </TargetPaceContext.Provider>
  );
};

export const useTargetPace = () => {
  const context = useContext(TargetPaceContext);
  if (!context) throw new Error("useTargetPace must be used within TargetPaceProvider");
  return context;
};
